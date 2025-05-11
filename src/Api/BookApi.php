<?php

namespace App\Api;

use App\Services\BookService;
use InvalidArgumentException;

class BookApi
{
    private BookService $service;
    private array $data = [];

    public function __construct()
    {
        $method = $_SERVER['REQUEST_METHOD'];
        if (in_array($method, ['POST', 'PUT', 'DELETE'])) {
            $raw = file_get_contents('php://input');
            $this->data = json_decode($raw, true) ?? [];

            if (!is_array($this->data)) {
                $this->respondError(400, 'Invalid JSON body');
                exit;
            }
        } else {
            $this->data = [];
        }
        $this->service = new BookService($this->data);
    }

    private function respondError(int $code, string $message, string $details = ''): void
    {
        header('Content-Type: application/json');
        http_response_code($code);
        echo json_encode([
            'error' => $message,
            'details' => $details
        ]);
    }

    public function respondSuccess(int $code, array $res = []): void
    {
        header('Content-Type: application/json');
        http_response_code($code);
        echo json_encode($res);
    }

    public function getAll(): void
    {
        try {
            $response = $this->service->getAllBooks();
            $this->respondSuccess(200, $response);
        } catch (\Throwable $e) {
            $this->respondError(500, 'Internal server error.', $e->getMessage());
        }
    }

    public function create(): void
    {
        try {
            $this->service->createBook();
            $this->respondSuccess(201, ['message' => 'Book created']);
        } catch (InvalidArgumentException $e) {
            $this->respondError(400, 'Bad request.', $e->getMessage());
        } catch (\Throwable $e) {
            $this->respondError(500, 'Internal server error.', $e->getMessage());
        }
    }

    public function update(): void
    {
        try {
            $response = $this->service->updateBook();

            if (!$response) {
                $this->respondSuccess(200, ['message' => 'Same data as existing book. No changes done']);
                return;
            }
            $this->respondSuccess(200, ['message' => 'Book updated successfully']);
        } catch (InvalidArgumentException $e) {
            $this->respondError(400, 'Bad request.', $e->getMessage());
        } catch (\Throwable $e) {
            $this->respondError(500, 'Internal server error.', $e->getMessage());
        }
    }

    public function delete(): void
    {
        try {
            $response = $this->service->deleteBook();

            if (!$response) {
                $this->respondError(404, 'Book not found');
                return;
            }

            // $this->respondSuccess(200, ['message' => 'Book deleted successfully']);
            $this->respondSuccess(200);
        } catch (InvalidArgumentException $e) {
            $this->respondError(400, 'Bad request.', $e->getMessage());
        } catch (\Throwable $e) {
            $this->respondError(500, 'Internal server error.', $e->getMessage());
        }
    }
}
