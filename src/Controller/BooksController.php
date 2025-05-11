<?php

namespace App\Controller;

class BooksController
{
    public function index()
    {
        require __DIR__ . '/../views/books.php';
    }
}
