// tests/cypress/e2e/books_page.cy.js
/// <reference types="cypress" />

/**
 * Mały helper – porównuje tekst po trim() i redukuje wielokrotne spacje
 * Przykład użycia:
 * cy.get('selector').shouldHaveTrimmedText('Oczekiwany tekst');
 */
Cypress.Commands.add(
  "shouldHaveTrimmedText",
  { prevSubject: true },
  (subject, expected) => {
    cy.wrap(subject)
      .invoke("text")
      .then((txt) => txt.replace(/\s+/g, " ").trim())
      .should("eq", expected.replace(/\s+/g, " ").trim());
  }
);

describe("Books CRUD – /admin/books", () => {
  const pageUrl = "/index.php?page=books";

  beforeEach(() => {
    // intercepty muszą być zarejestrowane PRZED visit()
    cy.intercept("GET", "/api/books").as("getBooks");
    cy.intercept("GET", "/api/authors").as("getAuthors");
    cy.intercept("GET", "/api/genres").as("getGenres");

    cy.visit(pageUrl);
    cy.wait("@getBooks");
  });

  it("dodaje nową książkę i weryfikuje ją w tabeli", () => {
    const title = `Cy_${Cypress._.random(1e5)}`;

    cy.intercept("POST", "/api/books").as("postBook");

    // otwórz modal „Add book”
    cy.get("#table_button_add").click();
    cy.wait(["@getAuthors", "@getGenres"]);
    cy.get("#add_book_modal").should("be.visible");

    // wypełnij formularz
    cy.get("#title").type(title);
    cy.get("#author").select("George Orwell");
    cy.get("#year").clear().type("2024");
    cy.get("#genre").select("Adventure");

    cy.get("#submit_button").click();
    cy.wait("@postBook").its("response.statusCode").should("eq", 201);

    // po powodzeniu backend odświeża listę – czekamy na nowy GET
    cy.wait("@getBooks");

    /** ------------------------------------------------------------------
     *  Wyszukujemy po tytule, aby upewnić się, że weryfikujemy WŁAŚCIWY
     *  wiersz – niezależnie od aktualnego sortowania w tabeli.
     * ------------------------------------------------------------------*/
    cy.get("#books_table tbody tr")
      .contains("td", title) // znajduje <td> z naszym tytułem
      .parent("tr") // przechodzi do całego wiersza
      .within(() => {
        cy.get("td").eq(0).shouldHaveTrimmedText(title);
        cy.get("td").eq(2).shouldHaveTrimmedText("2024");
        cy.get("td").eq(3).shouldHaveTrimmedText("Adventure");
        cy.get("td").eq(1).invoke("text").should("contain", "Orwell");
      });
  });

  it("edytuje istniejącą książkę i potwierdza zmiany", () => {
    const newTitle = `Edytowany_${Cypress._.random(1e5)}`;

    cy.intercept("PUT", "/api/books").as("putBook");

    // klikamy pierwszy wiersz w tabeli (dowolny rekord do edycji)
    cy.get("#books_table tbody tr").first().click();
    cy.wait(["@getAuthors", "@getGenres"]);

    cy.get("#edit_book_modal")
      .should("be.visible")
      .within(() => {
        cy.get('[name="title"]').clear().type(newTitle);
        cy.get('[name="year"]').clear().type("2025");
        cy.get("#edit_submit_button").click();
      });

    cy.wait("@putBook").its("response.statusCode").should("eq", 200);
    cy.wait("@getBooks");

    // sprawdzamy, że wiersz z nowym tytułem istnieje
    cy.get("#books_table tbody tr")
      .contains("td", newTitle)
      .parent("tr")
      .within(() => {
        cy.get("td").eq(0).shouldHaveTrimmedText(newTitle);
        cy.get("td").eq(2).shouldHaveTrimmedText("2025");
      });
  });

  it("usuwa książkę (pierwszy wiersz) i sprawdza, że zniknęła", () => {
    cy.intercept("DELETE", "/api/books").as("deleteBook");

    cy.get("#books_table tbody tr")
      .first()
      .invoke("attr", "data-id")
      .then((bookId) => {
        expect(bookId, "data-id musi istnieć").to.match(/^\d+$/);
        cy.wrap(bookId).as("deletedId");
      });

    // otwieramy modal edycji i klikamy Delete
    cy.get("#books_table tbody tr").first().click();
    cy.get("#edit_delete_button").click(); // zakładamy modal z potwierdzeniem
    cy.wait("@deleteBook").its("response.statusCode").should("eq", 200);
    cy.wait("@getBooks");

    // w tabeli nie powinno być już usuniętego ID
    cy.get("@deletedId").then((id) => {
      cy.get("#books_table tbody tr").each(($tr) => {
        cy.wrap($tr).invoke("attr", "data-id").should("not.eq", id);
      });
    });
  });
});
