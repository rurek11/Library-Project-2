<?php

namespace App\Api;

use App\Services\GenreService;

class GenreApi
{
    private GenreService $service;

    public function __construct()
    {
        $this->service = new GenreService();
    }

    public function getGenres(): void
    {
        try {
            $response = $this->service->getGenres();
            header('Content-Type: application/json');
            http_response_code(200);
            echo json_encode($response);
        } catch (\Throwable $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Internal server error.',
                'details' => $e->getMessage()
            ]);
        }
    }
}
