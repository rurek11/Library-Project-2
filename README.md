# Library Testowanie

Prosta aplikacja webowa „Books & Authors” do zarządzania książkami i autorami, uruchamiana w kontenerach Docker, z REST API, frontendem oraz pełnym zestawem testów.

---

## Spis treści

- [Wymagania](#wymagania)
- [Struktura projektu](#struktura-projektu)
- [Instalacja i uruchomienie](#instalacja-i-uruchomienie)
- [Uruchamianie testów](#uruchamianie-testów)
  - [PHPUnit (unit tests)](#phpunit-unit-tests)
  - [Cypress (UI tests)](#cypress-ui-tests)
  - [k6 (performance tests)](#k6-performance-tests)
- [Konfiguracja Docker](#konfiguracja-docker)
- [Kontakt](#kontakt)

---

## Wymagania

- Docker i Docker Compose
- Composer (zainstalowany w kontenerze)
- Node.js i npm (do testów Cypress)
- k6 (do testów wydajnościowych)

---

## Struktura projektu

```
.
├── composer.json
├── composer.lock
├── cypress.config.js
├── Docker/
│   └── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
├── phpunit.xml
├── public/
│   ├── css/
│   ├── images/
│   ├── index.php
│   └── js/
├── README.md
├── SQL/
│   ├── inserts.sql
│   └── tables.sql
├── src/
│   ├── Api/
│   ├── Controller/
│   ├── Db/
│   ├── Model/
│   ├── Router.php
│   ├── Services/
│   └── Validators/
└── tests/
    ├── cypress/
    ├── k6/
    └── phpUnit/
```

---

## Instalacja i uruchomienie

1. **Zbuduj i uruchom kontenery:**

   ```bash
   docker-compose up --build
   docker-compose up -d
   ```

2. **Aplikacja dostępna na:**  
   `http://localhost:8000`

3. **Instalacja zależności PHP w kontenerze:**

   ```bash
   docker exec -it $(docker ps --filter "ancestor=php" -q) bash
   composer install
   composer dump-autoload
   exit
   ```

---

## Uruchamianie testów

### PHPUnit (unit tests)

```bash
docker exec -it $(docker ps --filter "ancestor=php" -q) bash   -c "vendor/bin/phpunit --configuration phpunit.xml tests/phpUnit"
```

### Cypress (UI tests)

```bash
npm install
npx cypress run
```

### k6 (performance tests)

```bash
k6 run tests/k6/k6_stress_test.js
```

---

## Konfiguracja Docker

- **Dockerfile** w `Docker/`: definiuje multi-stage build z Composer i PHP 8.2 Apache.
- **docker-compose.yml**: uruchamia usługi:
  - `php` – serwer PHP/Apache na porcie 8000
  - `db` – MySQL 8.0 z wolumenem `db-data`

---

## Kontakt

W razie pytań lub problemów otwórz issue w repozytorium lub napisz:  
fkatra1@stu.vistula.edu.pl
