# Prototyp funkcjonalności skanowania kosmetyku
Aby uruchomić projekt należy:
0. Zainstalować bibliotekę sqlite3 do obsługi bazy danych oraz bibliotekę libzbar0 wspomagającą interpretowanie kodów kreskowych:
```shell
sudo apt install sqlite3
sudo apt-get install libzbar0
```
1. Aktywować powłokę interpretera i pobrać biblioteki zarządzane przez poetry:
```shell
poetry shell
poetry install
```
2. Uruchomić serwer backend:

```python
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

3. Załadować dane składników INCI z bazy CosIng oraz przykładowe dane do bazy:
```
sqlite3 test.db < example_data.sql
```
```python
python load_csv_data.py
```

Do testów funkcjonalności służy dokumentacja OpenAPI dostępna pod linkiem http://localhost:8000/docs

