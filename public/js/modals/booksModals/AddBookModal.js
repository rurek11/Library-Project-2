import { addBook } from "../../api/books_api.js";
import { getAuthors } from "../../api/authors_api.js";
import { getGenres } from "../../api/genres_api.js";

export class AddBookModal {
  constructor(modalId, table) {
    this.modal = document.getElementById(modalId);
    this.overlay = document.getElementById("modal_overlay");
    this.form = this.modal.querySelector("form");
    this.submitButton = this.modal.querySelector("#submit_button");
    this.abandonButton = this.modal.querySelector("#abandon_button");
    this.table = table;

    this.authorSelect = this.form.querySelector("#author");
    this.genreSelect = this.form.querySelector("#genre");

    this.abandonButton.addEventListener("click", () => this.close());

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  async open() {
    this.overlay.classList.remove("invisible");
    this.overlay.classList.add("overlay");
    this.modal.classList.remove("invisible");
    this.modal.classList.add("visible");
    this.modal.classList.add("add_book_modal");

    await this.loadAuthors();
    await this.loadGenres();
  }

  close() {
    this.overlay.classList.add("invisible");
    this.modal.classList.remove("visible");
    this.modal.classList.add("invisible");
    this.modal.classList.remove("add_book_modal");
    this.form.reset();
  }

  async loadAuthors() {
    const authors = await getAuthors();
    this.authorSelect.innerHTML = "";

    authors.forEach((author) => {
      const option = document.createElement("option");
      option.value = author.id;
      option.textContent = `${author.name} ${author.surname}`;
      this.authorSelect.appendChild(option);
    });
  }

  async loadGenres() {
    const genres = await getGenres();
    this.genreSelect.innerHTML = "";

    genres.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre.id;
      option.textContent = genre.name;
      this.genreSelect.appendChild(option);
    });
  }

  async handleSubmit() {
    const title = this.form.title.value.trim();
    const authorId = parseInt(this.form.author.value, 10);
    const year = parseInt(this.form.year.value, 10);
    const genreId = parseInt(this.form.genre.value, 10);

    if (!title) {
      alert("Title cannot be empty!");
      return;
    }

    if (!authorId || authorId <= 0) {
      alert("Please select a valid author!");
      return;
    }

    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1000 || year > currentYear) {
      alert(`Year must be between 1000 and ${currentYear}!`);
      return;
    }

    if (!genreId || genreId <= 0) {
      alert("Please select a valid genre!");
      return;
    }

    const bookData = {
      title: title,
      author_id: authorId,
      year: year,
      genre_id: genreId,
    };

    try {
      await addBook(bookData);
      this.close();
      await this.table.loadData();

      if (this.table.sortStatus && this.table.currentSortField) {
        this.table.sortBy(this.table.currentSortField, this.table.sortStatus);
      }

      this.table.render();
    } catch (error) {
      console.error("Failed to add book:", error);
      alert("Failed to add book!");
    }
  }
}
