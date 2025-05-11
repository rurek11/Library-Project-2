# Books & Authors Web Application

Prosta aplikacja webowa do zarządzania książkami i autorami, z REST API, interfejsem użytkownika oraz pełnym zestawem testów (unit, API, UI, performance). Całość uruchamiana jako kontenery Docker.

## Spis treści

- [Wymagania](#wymagania)
- [Struktura projektu](#struktura-projektu)
- [Instalacja i uruchomienie](#instalacja-i-uruchomienie)
- [Uruchamianie testów](#uruchamianie-testów)
  - [Testy jednostkowe (Unit tests)](#testy-jednostkowe-unit-tests)
  - [Testy API (Postman)](#testy-api-postman)
  - [Testy UI (Cypress)](#testy-ui-cypress)
  - [Testy wydajnościowe (k6)](#testy-wydajnościowe-k6)
- [Konfiguracja Docker](#konfiguracja-docker)
- [Kontakt](#kontakt)

---

## Wymagania

- Docker & Docker Compose
- Java 11+ (lub inny język, jeśli wybrano inne środowisko)
- Node.js 14+ (dla frontendu i testów Cypress)
- Postman (do eksportu kolekcji)
- k6 (dla testów wydajnościowych)

---

## Struktura projektu

```
├── backend/                 # Kod źródłowy backendu (Spring Boot lub inny)
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml / build.gradle
├── frontend/                # Kod frontend (React/Vue lub czysty HTML/JS)
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── tests/
│   ├── unit/                # Testy jednostkowe (JUnit, Mockito itp.)
│   ├── api/                 # Kolekcja Postman + raport JSON
│   ├── ui/                  # Skrypty Cypress
│   └── performance/         # Skrypty k6
├── docker-compose.yml
└── README.md
```

---

## Instalacja i uruchomienie

1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/twoje-repo/books-authors.git
   cd books-authors
   ```
2. Zbuduj i uruchom kontenery:
   ```bash
   docker-compose up --build -d
   ```
3. Aplikacja dostępna pod:
   - Backend API: `http://localhost:8080/api`
   - Frontend: `http://localhost:3000` (lub inny port, zależnie od konfiguracji)

---

## Uruchamianie testów

### Testy jednostkowe (Unit tests)

```bash
# wejdź do kontenera backend i uruchom testy
docker exec -it books-backend bash
./mvnw test
```

### Testy API (Postman)

1. Otwórz kolekcję `tests/api/BooksAuthors.postman_collection.json` w Postmanie.
2. Wykonaj wszystkie requesty.
3. Eksportuj raport do JSON:
   ```bash
   newman run tests/api/BooksAuthors.postman_collection.json      --reporters cli,json      --reporter-json-export tests/api/report.json
   ```

### Testy UI (Cypress)

```bash
cd tests/ui
npm install
npx cypress run --record
```

Raport znajdziesz w `tests/ui/cypress/results/`.

### Testy wydajnościowe (k6)

```bash
cd tests/performance
k6 run --vus 50 --duration 30s book_api_load_test.js
```

Wyniki w konsoli lub przekierowane do pliku:

```bash
k6 run ... > tests/performance/result.txt
```
