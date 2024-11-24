from django.contrib import admin
from .models import *

admin.site.register(User)
admin.site.register(Person)
admin.site.register(Cosmetic)
admin.site.register(IngredientINCI)
admin.site.register(CosmeticComposition)
admin.site.register(Review)
admin.site.register(CarePlan)
admin.site.register(CarePlanContent)
admin.site.register(CarePlanRating)
admin.site.register(FavoriteProduct)
