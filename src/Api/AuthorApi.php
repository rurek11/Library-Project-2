<?php

namespace App\Api;

use App\Services\AuthorService;

class AuthorApi
{
    private AuthorService $service;

    public function __construct()
    {
        $this->service = new AuthorService();
    }

    public function getAuthors(): void
    {
        try {
            $response = $this->service->getAuthors();
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
