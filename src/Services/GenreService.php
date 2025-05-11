<?php

namespace App\Services;

use App\Model\Genre;

class GenreService
{
    public function getGenres(): array
    {
        return Genre::getAll();
    }
}
