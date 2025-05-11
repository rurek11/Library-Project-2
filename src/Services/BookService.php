<?php

namespace App\Services;

use App\Validators\BookValidator;
use App\Model\Book;
use InvalidArgumentException;

class BookService
{
    private array $data;

    public function __construct(array $data = [])
    {
        $this->data = $data;
    }

    public function getAllBooks(): array
    {
        return Book::getAll();
    }

    public function createBook(): bool
    {
        $validator = new BookValidator($this->data);

        $validator->validateCreate();

        return Book::create(
            $this->data['title'],
            (int)$this->data['author_id'],
            (int)$this->data['year'],
            (int)$this->data['genre_id']
        );
    }

    public function updateBook(): bool
    {
        $validator =  new BookValidator($this->data);
        $validator->validateId();

        $currentBookData = Book::getById($this->data['id']);
        if (!$currentBookData) {
            throw new InvalidArgumentException('Book with given ID not found.');
        }

        if (
            $currentBookData['title'] === $this->data['title'] &&
            $currentBookData['author_id'] === $this->data['author_id'] &&
            $currentBookData['genre_id'] === $this->data['genre_id'] &&
            $currentBookData['year'] === $this->data['year']
        ) {
            return false;
        }

        $validator->validateUpdate();

        return Book::update(
            (int)$this->data['id'],
            (string)$this->data['title'],
            (int)$this->data['author_id'],
            (int)$this->data['year'],
            (int)$this->data['genre_id'],
        );
    }

    public function deleteBook(): bool
    {
        $validator = new BookValidator($this->data);
        $validator->validateId();

        return Book::delete((int)$this->data['id']);
    }
}
