// tests/cypress/e2e/books_page.cy.js
/// <reference types="cypress" />

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
    cy.intercept("GET", "/api/books").as("getBooks");
    cy.intercept("GET", "/api/authors").as("getAuthors");
    cy.intercept("GET", "/api/genres").as("getGenres");

    cy.visit(pageUrl);
    cy.wait("@getBooks");
  });

  it("dodaje nową książkę i weryfikuje ją w tabeli", () => {
    const title = `Cy_${Cypress._.random(1e5)}`;

    cy.intercept("POST", "/api/books").as("postBook");

    cy.get("#table_button_add").click();
    cy.wait(["@getAuthors", "@getGenres"]);
    cy.get("#add_book_modal").should("be.visible");

    cy.get("#title").type(title);
    cy.get("#author").select("George Orwell");
    cy.get("#year").clear().type("2024");
    cy.get("#genre").select("Adventure");

    cy.get("#submit_button").click();
    cy.wait("@postBook").its("response.statusCode").should("eq", 201);

    cy.wait("@getBooks");

    cy.get("#books_table tbody tr")
      .contains("td", title)
      .parent("tr")
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

    cy.get("#books_table tbody tr").first().click();
    cy.get("#edit_delete_button").click();
    cy.wait("@deleteBook").its("response.statusCode").should("eq", 200);
    cy.wait("@getBooks");

    cy.get("@deletedId").then((id) => {
      cy.get("#books_table tbody tr").each(($tr) => {
        cy.wrap($tr).invoke("attr", "data-id").should("not.eq", id);
      });
    });
  });

  // --- DODATKOWE TESTY WALIDACJI FRONT-END (ALERT + BRAK REQUEST) ---

  it("AddBookModal: pusty tytuł → alert i brak POST", () => {
    cy.intercept("POST", "/api/books").as("postBook");

    cy.get("#table_button_add").click();
    cy.wait(["@getAuthors", "@getGenres"]);
    cy.get("#add_book_modal").should("be.visible");

    // wyłączamy natywną walidację HTML5
    cy.get("#add_book_modal form").then(($f) => ($f[0].noValidate = true));

    cy.get("#title").clear();
    cy.get("#author").select("George Orwell");
    cy.get("#year").clear().type("2024");
    cy.get("#genre").select("Adventure");

    cy.window().then((win) => cy.stub(win, "alert").as("alert"));

    cy.get("#submit_button").click();
    cy.wait(100);

    cy.get("@alert").should(
      "have.been.calledOnceWithExactly",
      "Title cannot be empty!"
    );
    cy.get("@postBook.all").should("have.length", 0);
    cy.get("#abandon_button").click();
  });

  it("AddBookModal: rok 2100 → alert i brak POST", () => {
    const currentYear = new Date().getFullYear();

    cy.intercept("POST", "/api/books").as("postBook");

    cy.get("#table_button_add").click();
    cy.wait(["@getAuthors", "@getGenres"]);
    cy.get("#add_book_modal").should("be.visible");

    cy.get("#add_book_modal form").then(($f) => ($f[0].noValidate = true));

    cy.get("#title").type("Some Title");
    cy.get("#author").select("George Orwell");
    cy.get("#year").clear().type("2100");
    cy.get("#genre").select("Adventure");

    cy.window().then((win) => cy.stub(win, "alert").as("alert"));

    cy.get("#submit_button").click();
    cy.wait(100);

    cy.get("@alert").should(
      "have.been.calledOnceWithExactly",
      `Year must be between 1000 and ${currentYear}!`
    );
    cy.get("@postBook.all").should("have.length", 0);
    cy.get("#abandon_button").click();
  });

  it("AddBookModal: rok 10 → alert i brak POST", () => {
    const currentYear = new Date().getFullYear();

    cy.intercept("POST", "/api/books").as("postBook");

    cy.get("#table_button_add").click();
    cy.wait(["@getAuthors", "@getGenres"]);
    cy.get("#add_book_modal").should("be.visible");

    cy.get("#add_book_modal form").then(($f) => ($f[0].noValidate = true));

    cy.get("#title").type("Another Title");
    cy.get("#author").select("George Orwell");
    cy.get("#year").clear().type("10");
    cy.get("#genre").select("Adventure");

    cy.window().then((win) => cy.stub(win, "alert").as("alert"));

    cy.get("#submit_button").click();
    cy.wait(100);

    cy.get("@alert").should(
      "have.been.calledOnceWithExactly",
      `Year must be between 1000 and ${currentYear}!`
    );
    cy.get("@postBook.all").should("have.length", 0);
    cy.get("#abandon_button").click();
  });

  it("EditBookModal: pusty tytuł → alert i brak PUT", () => {
    cy.intercept("PUT", "/api/books").as("putBook");

    cy.get("#books_table tbody tr").first().click();
    cy.wait(["@getAuthors", "@getGenres"]);
    cy.get("#edit_book_modal").should("be.visible");

    cy.get("#edit_book_modal form").then(($f) => ($f[0].noValidate = true));

    cy.get("#edit_title").clear();
    cy.get("#edit_year").clear().type("2024");

    cy.window().then((win) => cy.stub(win, "alert").as("alert"));

    cy.get("#edit_submit_button").click();
    cy.wait(100);

    cy.get("@alert").should(
      "have.been.calledOnceWithExactly",
      "Title cannot be empty!"
    );
    cy.get("@putBook.all").should("have.length", 0);
    cy.get("#edit_abandon_button").click();
  });

  it("EditBookModal: rok 10 → alert i brak PUT", () => {
    const currentYear = new Date().getFullYear();

    cy.intercept("PUT", "/api/books").as("putBook");

    cy.get("#books_table tbody tr").first().click();
    cy.wait(["@getAuthors", "@getGenres"]);
    cy.get("#edit_book_modal").should("be.visible");

    cy.get("#edit_book_modal form").then(($f) => ($f[0].noValidate = true));

    cy.get("#edit_title").type("Valid Title");
    cy.get("#edit_year").clear().type("10");

    cy.window().then((win) => cy.stub(win, "alert").as("alert"));

    cy.get("#edit_submit_button").click();
    cy.wait(100);

    cy.get("@alert").should(
      "have.been.calledOnceWithExactly",
      `Year must be between 1000 and ${currentYear}!`
    );
    cy.get("@putBook.all").should("have.length", 0);
    cy.get("#edit_abandon_button").click();
  });

  it("EditBookModal: rok 2100 → alert i brak PUT", () => {
    const currentYear = new Date().getFullYear();

    cy.intercept("PUT", "/api/books").as("putBook");

    cy.get("#books_table tbody tr").first().click();
    cy.wait(["@getAuthors", "@getGenres"]);
    cy.get("#edit_book_modal").should("be.visible");

    cy.get("#edit_book_modal form").then(($f) => ($f[0].noValidate = true));

    cy.get("#edit_title").type("Valid Title");
    cy.get("#edit_year").clear().type("2100");

    cy.window().then((win) => cy.stub(win, "alert").as("alert"));

    cy.get("#edit_submit_button").click();
    cy.wait(100);

    cy.get("@alert").should(
      "have.been.calledOnceWithExactly",
      `Year must be between 1000 and ${currentYear}!`
    );
    cy.get("@putBook.all").should("have.length", 0);
    cy.get("#edit_abandon_button").click();
  });
});
