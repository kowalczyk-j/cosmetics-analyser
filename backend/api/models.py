from django.db import models
from django.contrib.auth.models import User


class Person(models.Model):  # Tabela "Osoba"
    skin_type = models.CharField(max_length=50, verbose_name="Skin Type")
    skin_problems = models.TextField(verbose_name="Skin Problems")
    specialization = models.CharField(max_length=20, verbose_name="Specialization")

    def __str__(self):
        return self.specialization


class Test(models.Model):  # Tabela "Osoba"
    test = models.CharField(max_length=50, verbose_name="test")


class User(models.Model):  # Tabela "Użytkownik"
    username = models.CharField(max_length=20, verbose_name="Username")
    email = models.EmailField(max_length=50, verbose_name="Email")
    password = models.CharField(max_length=20, verbose_name="Password")
    registration_date = models.DateField(verbose_name="Registration Date")
    person = models.ForeignKey(Person, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.username


class Cosmetic(models.Model):  # Tabela "Kosmetyk"
    product_name = models.CharField(max_length=100, verbose_name="Product Name")
    manufacturer = models.CharField(max_length=50, verbose_name="Manufacturer")
    barcode = models.CharField(max_length=13, verbose_name="Barcode")
    description = models.TextField(verbose_name="Description")
    category = models.CharField(max_length=50, verbose_name="Category")
    purchase_link = models.URLField(
        max_length=200, verbose_name="Purchase Link", blank=True, null=True
    )

    def __str__(self):
        return self.product_name


class IngredientINCI(models.Model):  # Tabela "Składnik_INCI"
    cosing_ref_no = models.IntegerField(primary_key=True, verbose_name="COSING Ref No")
    inci_name = models.CharField(max_length=100, verbose_name="INCI Name")
    common_name = models.CharField(max_length=100, verbose_name="Common Name")
    action_description = models.TextField(verbose_name="Action Description")
    function = models.CharField(max_length=50, verbose_name="Function")
    restrictions = models.TextField(verbose_name="Restrictions", blank=True, null=True)

    def __str__(self):
        return self.inci_name


class CosmeticComposition(models.Model):  # Tabela "Skład_kosmetyku"
    cosmetic = models.ForeignKey(Cosmetic, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(IngredientINCI, on_delete=models.CASCADE)


class Review(models.Model):  # Tabela "Recenzja"
    cosmetic = models.ForeignKey(Cosmetic, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100, verbose_name="Title")
    content = models.TextField(verbose_name="Content")
    rating = models.IntegerField(verbose_name="Rating")
    review_date = models.DateField(verbose_name="Review Date")

    def __str__(self):
        return f"{self.title} - {self.rating}"


class CarePlan(models.Model):  # Tabela "Plan_pielęgnacji"
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    plan_name = models.CharField(max_length=50, verbose_name="Plan Name")
    description = models.TextField(verbose_name="Description")
    start_date = models.DateField(verbose_name="Start Date")
    end_date = models.DateField(verbose_name="End Date", blank=True, null=True)

    def __str__(self):
        return self.plan_name


class CarePlanContent(models.Model):  # Tabela "Zawartość_planu_pielęgnacji"
    plan = models.ForeignKey(CarePlan, on_delete=models.CASCADE)
    cosmetic = models.ForeignKey(Cosmetic, on_delete=models.CASCADE)
    frequency = models.CharField(max_length=50, verbose_name="Frequency")
    time_of_day = models.CharField(max_length=50, verbose_name="Time of Day")
    notes = models.TextField(verbose_name="Notes", blank=True, null=True)


class CarePlanRating(models.Model):  # Tabela "Ocena_planu_pielęgnacji"
    plan = models.ForeignKey(CarePlan, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.BooleanField(verbose_name="Rating")


class FavoriteProduct(models.Model):  # Tabela "Ulubione_produkty"
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cosmetic = models.ForeignKey(Cosmetic, on_delete=models.CASCADE)
