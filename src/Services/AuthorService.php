<?php

namespace App\Services;

use App\Model\Author;

class AuthorService
{
    public function getAuthors(): array
    {
        return Author::getAll();
    }
}
