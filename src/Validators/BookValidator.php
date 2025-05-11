<?php

namespace App\Validators;

use InvalidArgumentException;

class BookValidator
{
    private mixed $title;
    private mixed $author_id;
    private mixed $year;
    private mixed $genre_id;
    private mixed $id;

    public function __construct(array $data)
    {
        $this->title = $data['title'] ?? '';
        $this->author_id = $data['author_id'] ?? null;
        $this->year = $data['year'] ?? null;
        $this->genre_id = $data['genre_id'] ?? null;
        $this->id = $data['id'] ?? null;
    }

    public function validateCreate(): void
    {
        $this->validateTitle();
        $this->validateAuthorId();
        $this->validateGenreId();
        $this->validateYear();
    }

    public function validateUpdate(): void
    {
        $this->validateCreate();
    }

    public function validateDelete(): void
    {
        $this->validateId();
    }

    private function checkPositiveInt(mixed $value, string $fieldName = 'Value'): int
    {
        if (is_bool($value)) {
            throw new InvalidArgumentException("$fieldName cannot be a boolean.");
        }

        if (!ctype_digit(strval($value))) {
            throw new InvalidArgumentException("$fieldName must be an integer number.");
        }

        $int = (int)$value;

        if ($int <= 0) {
            throw new InvalidArgumentException("$fieldName must be greater than 0.");
        }

        return $int;
    }

    function validateTitle(): void
    {
        if (!is_string($this->title)) {
            throw new InvalidArgumentException('Title must be a string.');
        }

        $cleanTitle = trim($this->title);

        if ($cleanTitle === '') {
            throw new InvalidArgumentException('Title cannot be empty.');
        }

        if (mb_strlen($cleanTitle) > 120) {
            throw new InvalidArgumentException('Title cannot be longer than 120 chars.');
        }
    }

    function validateAuthorId(): void
    {
        $this->author_id = $this->checkPositiveInt($this->author_id, "Author id");
    }

    function validateYear(): void
    {
        $currentYear = (int)date('Y');

        $this->year = $this->checkPositiveInt($this->year, "Year");

        if ($this->year < 1000 || $this->year > $currentYear) {
            throw new InvalidArgumentException("Year must be between 1000 and $currentYear.");
        }
    }

    function validateGenreId(): void
    {
        $this->genre_id = $this->checkPositiveInt($this->genre_id, "Genre id");
    }

    function validateId(): void
    {
        $this->id = $this->checkPositiveInt($this->id, "Id");
    }
}
