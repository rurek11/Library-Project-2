import { updateBook, deleteBook } from "../../api/books_api.js";
import { getAuthors } from "../../api/authors_api.js";
import { getGenres } from "../../api/genres_api.js";

export class EditBookModal {
  constructor(modalId, table) {
    this.modal = document.getElementById(modalId);
    this.overlay = document.getElementById("modal_overlay");
    this.form = this.modal.querySelector("form");
    this.submitButton = this.modal.querySelector("#edit_submit_button");
    this.deleteButton = this.modal.querySelector("#edit_delete_button");
    this.abandonButton = this.modal.querySelector("#edit_abandon_button");
    this.table = table;

    this.idInput = this.form.querySelector("#edit_id");
    this.titleInput = this.form.querySelector("#edit_title");
    this.authorSelect = this.form.querySelector("#edit_author");
    this.yearInput = this.form.querySelector("#edit_year");
    this.genreSelect = this.form.querySelector("#edit_genre");

    this.abandonButton.addEventListener("click", () => this.close());
    this.submitButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
    this.deleteButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.handleDelete();
    });
  }

  async open(book) {
    this.overlay.classList.remove("invisible");
    this.overlay.classList.add("overlay");
    this.modal.classList.remove("invisible");
    this.modal.classList.add("add_book_modal");

    await this.loadAuthors(book.data.author_id);
    await this.loadGenres(book.data.genre_id);

    this.idInput.value = book.data.id;
    this.titleInput.value = book.data.title;
    this.yearInput.value = book.data.year;
  }

  close() {
    this.overlay.classList.add("invisible");
    this.modal.classList.remove("visible");
    this.modal.classList.add("invisible");
    this.modal.classList.remove("add_book_modal");
    this.form.reset();
  }

  async loadAuthors(selectedAuthorId) {
    const authors = await getAuthors();
    this.authorSelect.innerHTML = "";

    authors.forEach((author) => {
      const option = document.createElement("option");
      option.value = author.id;
      option.textContent = `${author.name} ${author.surname}`;

      if (author.id === selectedAuthorId) {
        option.selected = true;
      }

      this.authorSelect.appendChild(option);
    });
  }

  async loadGenres(selectedGenreId) {
    const genres = await getGenres();
    this.genreSelect.innerHTML = "";

    genres.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre.id;
      option.textContent = genre.name;

      if (genre.id === selectedGenreId) {
        option.selected = true;
      }

      this.genreSelect.appendChild(option);
    });
  }

  async handleSubmit() {
    const title = this.titleInput.value.trim();
    const authorId = parseInt(this.authorSelect.value, 10);
    const year = parseInt(this.yearInput.value, 10);
    const genreId = parseInt(this.genreSelect.value, 10);

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

    const updatedBook = {
      id: parseInt(this.idInput.value, 10),
      title: title,
      author_id: authorId,
      year: year,
      genre_id: genreId,
    };

    try {
      await updateBook(updatedBook);
      this.close();
      await this.table.loadData();

      if (this.table.sortStatus && this.table.currentSortField) {
        this.table.sortBy(this.table.currentSortField, this.table.sortStatus);
      }

      this.table.render();
    } catch (error) {
      console.error("Failed to update book:", error);
      alert("Failed to update book!");
    }
  }

  async handleDelete() {
    const bookId = parseInt(this.idInput.value, 10);

    if (!confirm("Are you sure you want to delete this book?")) {
      return;
    }

    try {
      await deleteBook(bookId);
      this.close();
      await this.table.loadData();

      if (this.table.sortStatus && this.table.currentSortField) {
        this.table.sortBy(this.table.currentSortField, this.table.sortStatus);
      }

      this.table.render();
    } catch (error) {
      console.error("Failed to delete book:", error);
      alert("Failed to delete book!");
    }
  }
}
