from django.contrib.auth.models import User
from django.db.models import Q, Count, Avg
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.views.decorators.csrf import csrf_exempt

from frontend.models import RestaurantType, CustomUser, Restaurant, Rating, Comment, Favorite


def render_page(request, template_name):
    """
    Render a specific template page.
    """
    return render(request, template_name)


def homepage(request):
    """
    Display the homepage with restaurant types.
    """
    data = RestaurantType.objects.all()
    return render(request, 'Homepage.html', {'data': data})


def login_page(request):
    """
    Handle user login.
    """
    if request.method == "POST":
        email = request.POST.get('email')
        password = request.POST.get('password')

        print(email, password)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            messages.error(request, "This email does not exist. Please sign up.")
            return redirect("Login")

        if user and user.check_password(password):
            login(request, user)
            messages.success(request, "Login successful!")
            return redirect("Homepage")
        else:
            messages.error(request, "Incorrect password. Please try again.")
            return redirect("Login")

    return render(request, "Login.html")


User = get_user_model()  # Using custom user model


def validate_password_strength(password):
    """
    Validate the strength of the password.
    """
    if len(password) < 8:
        raise ValidationError("Password must be at least 8 characters")
    if not any(char.isdigit() for char in password):
        raise ValidationError("Password must contain numbers")
    if not any(char.isalpha() for char in password):
        raise ValidationError("Password must contain letters")


def signup(request):
    """
    Handle user registration.
    """
    error_messages = {
        'username_taken': 'Username already taken',
        'email_registered': 'Email already registered',
        'password_mismatch': 'Passwords do not match',
        'invalid_email': 'Invalid email format',
        'weak_password': 'Weak password: Must be at least 8 characters with both letters and numbers'
    }

    if request.method == "POST":
        data = request.POST
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirm_password')

        errors = []
        response_data = {'success': False, 'errors': []}

        # Basic field validation
        if not all([username, email, password, confirm_password]):
            errors.append('All fields are required')

        # Password confirmation check
        if password != confirm_password:
            errors.append(error_messages['password_mismatch'])

        # Email format validation
        try:
            validate_email(email)
        except ValidationError:
            errors.append(error_messages['invalid_email'])

        # Password strength validation
        try:
            validate_password_strength(password)
        except ValidationError as e:
            errors.extend(e.messages)

        # Uniqueness validation
        if User.objects.filter(username=username).exists():
            errors.append(error_messages['username_taken'])
        if User.objects.filter(email=email).exists():
            errors.append(error_messages['email_registered'])

        # Error handling
        if errors:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                response_data['errors'] = errors
                return JsonResponse(response_data, status=400)
            else:
                for error in errors:
                    messages.error(request, error)
                return render(request, 'auth/Signup.html')

        # Create user
        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            login(request, user)

            # Handle AJAX request
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                response_data.update({
                    'success': True,
                    'redirect_url': '/Login/'
                })
                return JsonResponse(response_data)

            # Regular request handling
            messages.success(request, 'Registration successful!')
            return redirect('Login')

        except Exception as e:
            error = f'System error: {str(e)}'
            if request.is_ajax():
                response_data['errors'] = [error]
                return JsonResponse(response_data, status=500)
            messages.error(request, error)
            return render(request, 'auth/Signup.html')

    return render(request, 'auth/Signup.html')


def search_results(request):
    """
    Display search results for restaurants.
    """
    query = request.GET.get('search', '')  # Get the search keyword
    if query:
        # Query restaurants whose name or recommended dish name contains the keyword
        restaurants = Restaurant.objects.filter(
            Q(name__icontains=query) | Q(recommended_dishes__name__icontains=query) | Q(restaurant_type__name__icontains=query)
        ).distinct()
    else:
        restaurants = Restaurant.objects.all()  # Return an empty queryset if no keyword

    context = {
        'query': query,
        'restaurants': restaurants
    }
    return render(request, 'list.html', context)


def logout_page(request):
    """
    Handle user logout.
    """
    logout(request)
    messages.success(request, "You have been logged out.")
    return redirect("Homepage")


def restaurant_detail(request, restaurant_id):
    """
    Display the details of a restaurant.
    """
    # Generate a rating range from 1 to 5
    rating_range = list(range(1, 6))
    restaurant = get_object_or_404(Restaurant, id=restaurant_id)
    restaurant.view_count += 1
    restaurant.save()

    # Check if the user has favorited this restaurant
    is_favorited = Favorite.objects.filter(user=request.user, restaurant=restaurant).exists()

    # Get comments
    comments = restaurant.comments.all().order_by('-created_at')

    # Get the count of each rating
    rating_counts = Rating.objects.filter(restaurant=restaurant).values('score').annotate(count=Count('score'))

    # Get the overall average rating
    average_rating = Rating.objects.filter(restaurant=restaurant).aggregate(Avg('score'))['score__avg']

    # Convert the rating counts to a dictionary
    rating_counts_dict = {item['score']: item['count'] for item in rating_counts}

    rating_counts = []
    # Ensure ratings from 0 to 5 all have corresponding counts
    for score in range(6):
        if score not in rating_counts_dict:
            rating_counts.append({'score': score, 'count': 0, 'percent': 0})
        else:
            rating_counts.append({'score': score, 'count': rating_counts_dict[score], 'percent': rating_counts_dict[score] / restaurant.ratings.count() * 100})
    context = {
        'restaurant': restaurant,
        'rating_counts': rating_counts,
        'average_rating': round(average_rating, 1) if average_rating else 0,
        'rating_range': rating_range,
        'comments': comments,
        'is_favorited': is_favorited,  # Whether it has been favorited
    }
    return render(request, 'Restaurant_Detail.html', context)


def rate_restaurant(request, restaurant_id):
    """
    Handle rating a restaurant.
    """
    restaurant = get_object_or_404(Restaurant, id=restaurant_id)

    if request.method == "POST":
        score = int(request.POST.get('score'))
        if score < 1 or score > 5:
            messages.error(request, "Invalid rating. Please select a rating between 1 and 5.")
            return redirect('RestaurantDetail', restaurant_id=restaurant_id)

        # Check if the user has already rated this restaurant
        rating, created = Rating.objects.get_or_create(user=request.user, restaurant=restaurant, score=0)
        rating.score = score
        rating.save()

        messages.success(request, "Your rating has been saved.")
        return redirect('RestaurantDetail', restaurant_id=restaurant_id)


def submit_comment(request, restaurant_id):
    """
    Handle submitting a comment for a restaurant.
    """
    restaurant = get_object_or_404(Restaurant, id=restaurant_id)
    if request.method == "POST":
        content = request.POST.get('content')
        if not content:
            messages.error(request, "Comment content is required.")
            return redirect('RestaurantDetail', restaurant_id=restaurant_id)

        comment = Comment.objects.create(
            user=request.user,
            restaurant=restaurant,
            content=content
        )
        messages.success(request, "Your review has been submitted.")
        return redirect('RestaurantDetail', restaurant_id=restaurant_id)


def profile_page(request):
    """
    Display the user's profile page.
    """
    user = request.user

    # Get the user's favorited restaurants
    favorites = user.favorites.all()
    rating_range = list(range(1, 6))
    # Get the user's ratings
    ratings = user.ratings.all()

    context = {
        'profile': user,
        'favorites': favorites,
        'ratings': ratings,
        'rating_range': rating_range,
    }
    return render(request, 'profile.html', context)


@csrf_exempt
def add_favorite(request, restaurant_id):
    """
    Add a restaurant to the user's favorites.
    """
    try:
        restaurant = Restaurant.objects.get(id=restaurant_id)
        favorite, created = Favorite.objects.get_or_create(user=request.user, restaurant=restaurant)
        if created:
            return JsonResponse({'success': True, 'message': 'Restaurant added to favorites.'})
        else:
            return JsonResponse({'success': False, 'message': 'You have already favorited this restaurant.'})
    except Restaurant.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Restaurant not found.'})