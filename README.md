# Prototyp funkcjonalności skanowania kosmetyku
Aby uruchomić projekt należy:

1. Aktywować powłokę interpretera i pobrać biblioteki zarządzane przez poetry:
```shell
poetry shell
poetry install
```
2. Uruchomić serwer backend:

```python
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Do testów funkcjonalności służy dokumentacja OpenAPI dostępna pod linkiem http://localhost:8000/docs

Koniecznie może być zainstalowanie bibliotekek sqlite3 do obsługi bazy danych oraz libzbar0, która wspomaga interpretowanie kodów kreskowych:
```shell
sudo apt install sqlite3
sudo apt-get install libzbar0
```

Dane składników INCI z bazy CosIng oraz przykładowe dane do bazy zostały umieszczone w niej poleceniami:
```
sqlite3 test.db < example_data.sql
```
```python
python load_csv_data.py
```

Aplikację można także włączyć w przeglądarce na telefonie podłączonej do tej samej sieci wi-fi przy odpowiednim ustawieniu zapory sieciowej.


