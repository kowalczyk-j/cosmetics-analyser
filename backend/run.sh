#!/bin/bash
# Skrypt wymaga nadania uprawnień do uruchomienia: chmod +x run.sh
# Uruchamianie w środowisku wirtualnym Poetry (z katalogu backend): poetry run ./run.sh

# Odświeżanie ważności uprawnień sudo
sudo -v

# Instalowanie wymaganych pakietów
poetry install

# Uruchomienie PostgreSQL
sudo service postgresql start &

# Migracje bazy danych
python manage.py makemigrations
python manage.py migrate

# Uruchomienie serwera backendowego Django
python manage.py runserver 0.0.0.0:8000 &
PID_DJANGO=$!

# Uruchomienie serwera frontendowego React
cd ../frontend
npm install
npm run dev &
PID_REACT=$!

cd ..

# Zakończenie wszystkich procesów po zakończeniu pracy
trap "kill $PID_DJANGO $PID_REACT" EXIT

# Oczekiwanie na zakończenie skryptu
wait