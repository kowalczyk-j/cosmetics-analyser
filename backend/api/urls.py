from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PersonViewSet,
    UserViewSet,
    CosmeticViewSet,
    IngredientINCIViewSet,
    CosmeticCompositionViewSet,
    ReviewViewSet,
    CarePlanViewSet,
    CarePlanContentViewSet,
    CarePlanRatingViewSet,
    FavoriteProductViewSet,
    import_cosing_view,
)

router = DefaultRouter()
router.register(r"persons", PersonViewSet)
router.register(r"users", UserViewSet)
router.register(r"cosmetics", CosmeticViewSet)
router.register(r"ingredients", IngredientINCIViewSet)
router.register(r"cosmetic_compositions", CosmeticCompositionViewSet)
router.register(r"reviews", ReviewViewSet)
router.register(r"care_plans", CarePlanViewSet)
router.register(r"care_plan_contents", CarePlanContentViewSet)
router.register(r"care_plan_ratings", CarePlanRatingViewSet)
router.register(r"favorite_products", FavoriteProductViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("import_cosing/", import_cosing_view, name="import_cosing"),
]
