import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "IT_Project.settings")
import django

django.setup()

from frontend.models import RestaurantType, Restaurant, RecommendedDish


# 添加餐厅类型
restaurant_types = ['Chinese', 'Mexican', 'Italian', 'Japanese']
for name in restaurant_types:
    RestaurantType.objects.get_or_create(name=name)

# 添加 Chinese 餐厅
chinese_type = RestaurantType.objects.get(name='Chinese')
chinese_restaurant = Restaurant.objects.create(
    name='Beijing Roast Duck House',
    address='123 Beijing Street',
    phone='123-456-7890',
    restaurant_type=chinese_type
)
RecommendedDish.objects.create(
    restaurant=chinese_restaurant,
    name='Peking Duck',
    photo='path/to/peking_duck.jpg',
    price=120.00,
    description='A traditional Beijing dish with crispy skin and tender meat.'
)

# 添加 Mexican 餐厅
mexican_type = RestaurantType.objects.get(name='Mexican')
mexican_restaurant = Restaurant.objects.create(
    name='Taco Palace',
    address='456 Taco Street',
    phone='234-567-8901',
    restaurant_type=mexican_type
)
RecommendedDish.objects.create(
    restaurant=mexican_restaurant,
    name='Beef Tacos',
    photo='path/to/beef_tacos.jpg',
    price=8.99,
    description='Delicious tacos filled with seasoned beef, lettuce, and cheese.'
)

# 添加 Italian 餐厅
italian_type = RestaurantType.objects.get(name='Italian')
italian_restaurant = Restaurant.objects.create(
    name='Pizza Paradise',
    address='789 Pizza Avenue',
    phone='345-678-9012',
    restaurant_type=italian_type
)
RecommendedDish.objects.create(
    restaurant=italian_restaurant,
    name='Margherita Pizza',
    photo='path/to/margherita_pizza.jpg',
    price=15.99,
    description='Classic pizza with tomato sauce, mozzarella cheese, and fresh basil.'
)

# 添加 Japanese 餐厅
japanese_type = RestaurantType.objects.get(name='Japanese')
japanese_restaurant = Restaurant.objects.create(
    name='Sushi Delight',
    address='101 Sushi Lane',
    phone='456-789-0123',
    restaurant_type=japanese_type
)
RecommendedDish.objects.create(
    restaurant=japanese_restaurant,
    name='Salmon Sushi',
    photo='path/to/salmon_sushi.jpg',
    price=20.00,
    description='Fresh salmon sushi with vinegared rice and nori seaweed.'
)
