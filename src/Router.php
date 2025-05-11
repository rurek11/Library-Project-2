<?php

namespace App;

use App\Controller\AdminHomepageController;
use App\Controller\BooksController;
use App\Api\BookApi;
use App\Api\AuthorApi;
use App\Api\GenreApi;

class Router
{
    public function handleRequest(array $request)
    {
        $page = $request['page'] ?? 'adminHomepage';

        switch ($page) {
            case 'adminHomepage':
                $controller = new AdminHomepageController();
                $controller->index();
                break;

            case 'books':
                $controller = new BooksController();
                $controller->index();
                break;

            case 'authors':
                // require_once __DIR__ . "/controllers/AuthorsController.php";
                // $controller = new AuthorsController();
                // $controller->index();
                // break;

            default:
                echo "404 - Nie znaleziono strony";
                break;
        }
    }

    public function handleApiRequest(string $method, string $uri)
    {
        $path = parse_url($uri, PHP_URL_PATH);
        $segments = explode('/', trim($path, '/'));

        if ($segments[0] !== 'api') {
            http_response_code(404);
            echo json_encode(['error' => 'Invalid API path']);
            return;
        }

        $resource = $segments[1] ?? null;

        if ($resource === 'books') {
            $api = new BookApi();

            switch ($method) {
                case 'POST':
                    $api->create();
                    break;
                case 'PUT':
                    $api->update();
                    break;
                case 'DELETE':
                    $api->delete();
                    break;
                case 'GET':
                    $api->getAll();
                    break;
                default:
                    http_response_code(405);
                    echo json_encode(['error' => 'Unsupported HTTP method']);
                    break;
            }
        } elseif ($resource === 'authors') {
            $api = new AuthorApi();
            $api->getAuthors();
            return;
        } elseif ($resource === 'genres') {
            $api = new GenreApi();
            $api->getGenres();
            return;
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Invalid API path']);
            return;
        }
    }
}
