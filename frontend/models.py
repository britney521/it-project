

from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    avatar = models.ImageField(max_length=100, upload_to='avatar',default='avatar/avatar.jpg')
    full_name = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.username

class RestaurantType(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Restaurant Type")
    photo = models.ImageField(max_length=100,upload_to='type_photo')

    def __str__(self):
        return self.name

class Restaurant(models.Model):
    name = models.CharField(max_length=200, verbose_name="Restaurant Name")
    address = models.CharField(max_length=255, verbose_name="Address")
    phone = models.CharField(max_length=15, verbose_name="Phone")
    restaurant_type = models.ForeignKey(
        RestaurantType,
        on_delete=models.CASCADE,
        related_name="restaurants",
        verbose_name="Restaurant Type"
    )
    rating = models.FloatField(default=0.0, verbose_name="Rating")
    comment_count = models.PositiveIntegerField(default=0, verbose_name="Comment Count")
    view_count = models.PositiveIntegerField(default=0, verbose_name="View Count")
    favorite_count = models.PositiveIntegerField(default=0, verbose_name="Favorite Count")

    def __str__(self):
        return self.name

class RestaurantPhoto(models.Model):
    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        related_name="photos",
        verbose_name="Restaurant"
    )
    photo = models.ImageField(upload_to="restaurant_photos/", verbose_name="Photo")

    def __str__(self):
        return f"{self.restaurant.name} - Photo"


class RecommendedDish(models.Model):
    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        related_name="recommended_dishes",
        verbose_name="Restaurant"
    )
    name = models.CharField(max_length=200, verbose_name="Dish Name")
    photo = models.ImageField(upload_to="recommended_dishes/", verbose_name="Photo")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Price")
    description = models.TextField(blank=True, verbose_name="Description")

    def __str__(self):
        return f"{self.restaurant.name} - {self.name}"
class Comment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="comments", verbose_name="User")
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name="comments", verbose_name="Restaurant")
    content = models.TextField(verbose_name="Comment Content")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")

    def __str__(self):
        return f"{self.user.username} - {self.restaurant.name}"

class Rating(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="ratings", verbose_name="User")
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name="ratings", verbose_name="Restaurant")
    score = models.PositiveSmallIntegerField(verbose_name="Score")

    def __str__(self):
        return f"{self.user.username} - {self.restaurant.name}"

class Favorite(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="favorites", verbose_name="User")
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name="favorites", verbose_name="Restaurant")

    class Meta:
        unique_together = ('user', 'restaurant')  # Ensure the combination of user and restaurant is unique

    def __str__(self):
        return f"{self.user.username} - {self.restaurant.name}"