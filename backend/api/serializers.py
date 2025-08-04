from rest_framework import serializers
from .models import (
    Person,
    User,
    Cosmetic,
    IngredientINCI,
    CosmeticComposition,
    Review,
    CarePlan,
    CarePlanContent,
    CarePlanRating,
    FavoriteProduct,
)
import re


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ["id", "skin_type", "skin_problems", "specialization"]


class UserSerializer(serializers.ModelSerializer):
    person = PersonSerializer()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "person",
            "date_joined",
            "is_staff",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "date_joined": {"read_only": True},
            "is_staff": {"read_only": True},
        }

    def create(self, validated_data):
        person_data = validated_data.pop("person", None)

        user = User.objects.create_user(**validated_data)

        if person_data:
            Person.objects.create(user=user, **person_data)

        return user


class CosmeticSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cosmetic
        fields = [
            "product_name",
            "manufacturer",
            "barcode",
            "description",
            "category",
            "purchase_link",
            "is_verified",
        ]
        read_only_fields = ["purchase_link"]

    def validate_barcode(self, value):
        if self.instance is None:
            if Cosmetic.objects.filter(barcode=value).exists():
                raise serializers.ValidationError(
                    f"Kosmetyk z kodem kreskowym {value} już istnieje w bazie danych."
                )
        return value

    def validate(self, data):
        print(f"CosmeticSerializer - Received data: {data}")
        return data

    def create(self, validated_data):
        print(f"CosmeticSerializer - Creating cosmetic with data: {validated_data}")

        # generate automatic purchase link based on product name
        product_name = validated_data.get("product_name", "")
        search_term = "+".join(product_name.lower().split())
        search_term = re.sub(r"[^a-z0-9+ąćęłńóśźż]", "", search_term)
        validated_data["purchase_link"] = f"https://www.ceneo.pl/;szukaj-{search_term}"

        # unverified by default
        validated_data["is_verified"] = False

        try:
            return super().create(validated_data)
        except Exception as e:
            print(f"CosmeticSerializer - Error creating cosmetic: {e}")
            raise


class IngredientINCISerializer(serializers.ModelSerializer):
    class Meta:
        model = IngredientINCI
        fields = [
            "cosing_ref_no",
            "inci_name",
            "common_name",
            "action_description",
            "function",
            "restrictions",
            "safety_rating",
            "restriction_description",
        ]


class CosmeticCompositionSerializer(serializers.ModelSerializer):
    # For creating/updating, we use SlugRelatedField to reference by barcode and cosing_ref_no
    cosmetic = serializers.SlugRelatedField(
        slug_field="barcode", queryset=Cosmetic.objects.all()
    )
    ingredient = serializers.SlugRelatedField(
        slug_field="cosing_ref_no", queryset=IngredientINCI.objects.all()
    )

    class Meta:
        model = CosmeticComposition
        fields = ["id", "cosmetic", "ingredient", "order_in_composition"]


class CosmeticCompositionReadSerializer(serializers.ModelSerializer):
    # For read operations, we return full details of cosmetic and ingredient
    cosmetic = CosmeticSerializer(read_only=True)
    ingredient = IngredientINCISerializer(read_only=True)

    class Meta:
        model = CosmeticComposition
        fields = ["id", "cosmetic", "ingredient", "order_in_composition"]


class ReviewSerializer(serializers.ModelSerializer):
    cosmetic = CosmeticSerializer()
    user = UserSerializer()

    class Meta:
        model = Review
        fields = ["id", "cosmetic", "user", "title", "content", "rating", "review_date"]


class CarePlanSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = CarePlan
        fields = ["id", "user", "plan_name", "description", "start_date", "end_date"]


class CarePlanContentSerializer(serializers.ModelSerializer):
    plan = CarePlanSerializer()
    cosmetic = CosmeticSerializer()

    class Meta:
        model = CarePlanContent
        fields = ["id", "plan", "cosmetic", "frequency", "time_of_day", "notes"]


class CarePlanRatingSerializer(serializers.ModelSerializer):
    plan = CarePlanSerializer()
    user = UserSerializer()

    class Meta:
        model = CarePlanRating
        fields = ["id", "plan", "user", "rating"]


class FavoriteProductSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    cosmetic = CosmeticSerializer()

    class Meta:
        model = FavoriteProduct
        fields = ["id", "user", "cosmetic"]
