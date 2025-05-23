# Generated by Django 5.1.3 on 2025-04-08 23:07

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Cosmetic',
            fields=[
                ('product_name', models.CharField(max_length=100, verbose_name='Product Name')),
                ('manufacturer', models.CharField(max_length=50, verbose_name='Manufacturer')),
                ('barcode', models.CharField(max_length=13, primary_key=True, serialize=False, verbose_name='Barcode')),
                ('description', models.TextField(verbose_name='Description')),
                ('category', models.CharField(max_length=50, verbose_name='Category')),
                ('purchase_link', models.URLField(blank=True, null=True, verbose_name='Purchase Link')),
            ],
        ),
        migrations.CreateModel(
            name='IngredientINCI',
            fields=[
                ('cosing_ref_no', models.IntegerField(primary_key=True, serialize=False, verbose_name='COSING Ref No')),
                ('inci_name', models.CharField(max_length=100, verbose_name='INCI Name')),
                ('common_name', models.CharField(max_length=100, verbose_name='Common Name')),
                ('action_description', models.TextField(verbose_name='Action Description')),
                ('function', models.CharField(max_length=50, verbose_name='Function')),
                ('restrictions', models.TextField(blank=True, null=True, verbose_name='Restrictions')),
            ],
        ),
        migrations.CreateModel(
            name='CarePlan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('plan_name', models.CharField(max_length=50, verbose_name='Plan Name')),
                ('description', models.TextField(verbose_name='Description')),
                ('start_date', models.DateField(verbose_name='Start Date')),
                ('end_date', models.DateField(blank=True, null=True, verbose_name='End Date')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='CarePlanRating',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.BooleanField(verbose_name='Rating')),
                ('plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.careplan')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='CarePlanContent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('frequency', models.CharField(max_length=50, verbose_name='Frequency')),
                ('time_of_day', models.CharField(max_length=50, verbose_name='Time of Day')),
                ('notes', models.TextField(blank=True, null=True, verbose_name='Notes')),
                ('plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.careplan')),
                ('cosmetic', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.cosmetic')),
            ],
        ),
        migrations.CreateModel(
            name='FavoriteProduct',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cosmetic', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.cosmetic')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='CosmeticComposition',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cosmetic', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.cosmetic')),
                ('ingredient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.ingredientinci')),
            ],
        ),
        migrations.CreateModel(
            name='Person',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('skin_type', models.CharField(default='normal', max_length=50, verbose_name='Skin Type')),
                ('skin_problems', models.TextField(default='None', verbose_name='Skin Problems')),
                ('specialization', models.CharField(default='user', max_length=20, verbose_name='Specialization')),
                ('user', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='person', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100, verbose_name='Title')),
                ('content', models.TextField(verbose_name='Content')),
                ('rating', models.IntegerField(verbose_name='Rating')),
                ('review_date', models.DateField(verbose_name='Review Date')),
                ('cosmetic', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.cosmetic')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
