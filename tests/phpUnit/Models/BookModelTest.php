<?php

namespace Tests\Models;

use PHPUnit\Framework\TestCase;
use App\Model\Book;
use App\Db\Database;

class BookModelTest extends TestCase
{
    protected static \PDO $conn;

    public static function setUpBeforeClass(): void
    {
        // nawiązujemy połączenie i seedujemy bazę
        $db = new Database();
        self::$conn = $db->getCon();

        // czyścimy poprzednie testowe rekordy
        self::$conn->exec('DELETE FROM books');

        // upewniamy się, że istnieje autor i gatunek o id=1
        self::$conn->exec("
            INSERT INTO authors (id, name, surname)
            VALUES (1, 'Test', 'Author')
            ON DUPLICATE KEY UPDATE name = name
        ");
        self::$conn->exec("
            INSERT INTO genres (id, name)
            VALUES (1, 'TestGenre')
            ON DUPLICATE KEY UPDATE name = name
        ");
    }

    public function testGetAllReturnsEmptyArrayWhenNoBooks(): void
    {
        $all = Book::getAll();
        $this->assertIsArray($all);
        $this->assertEmpty($all, 'getAll() powinno zwrócić pustą tablicę gdy brak rekordów');
    }

    public function testGetByIdReturnsNullForNonexistent(): void
    {
        $this->assertNull(Book::getById('9999'), 'getById() dla nieistniejącego ID powinno zwrócić null');
    }

    public function testCreateAndGetById(): void
    {
        $title    = 'Model Test Book';
        $authorId = 1;
        $year     = 2022;
        $genreId  = 1;

        $ok = Book::create($title, $authorId, $year, $genreId);
        $this->assertTrue($ok, 'create() powinno zwrócić true');

        // pobieramy najświeższy rekord
        $all   = Book::getAll();
        $this->assertNotEmpty($all, 'getAll() nie może być puste po utworzeniu książki');

        $first = reset($all);
        $this->assertEquals($title,     $first['title']);
        $this->assertEquals($authorId,  $first['author_id']);
        $this->assertEquals($year,      $first['year']);
        $this->assertEquals($genreId,   $first['genre_id']);

        // test getById
        $byId = Book::getById((string)$first['id']);
        $this->assertNotNull($byId, 'getById() powinno zwrócić tablicę');
        $this->assertEquals($title,    $byId['title']);
    }

    public function testUpdateModifiesExistingRecord(): void
    {
        // najpierw tworzymy nową książkę, którą potem zaktualizujemy:
        Book::create('Book To Update', 1, 2022, 1);

        // pobieramy ten świeżo utworzony rekord:
        $all   = Book::getAll();
        $first = reset($all);
        $id    = (int) $first['id'];

        $newTitle = 'Updated Title';
        $newYear  = 2023;
        $ok = Book::update($id, $newTitle, 1, $newYear, 1);
        $this->assertTrue($ok, 'update() powinno zwrócić true');

        $byId = Book::getById((string)$id);
        $this->assertEquals($newTitle, $byId['title']);
        $this->assertEquals($newYear,  $byId['year']);
    }

    public function testUpdateNonexistentReturnsFalseOrThrows(): void
    {
        // w zależności od implementacji: może zwrócić false albo wyjątek
        try {
            $res = Book::update(99999, 'X', 1, 2022, 1);
            $this->assertFalse($res, 'update() dla nieistniejącego ID powinno zwrócić false');
        } catch (\Throwable $e) {
            $this->assertTrue(
                $e instanceof \Exception,
                'update() dla nieistniejącego ID może też rzucić wyjątek'
            );
        }
    }

    public function testDeleteRemovesRecord(): void
    {
        Book::create('Test Book to Delete', 1, 2024, 1);

        // dodajmy nową:
        $all   = Book::getAll();
        $first = reset($all);
        $id    = (int) $first['id'];

        $deleted = Book::delete($id);
        $this->assertTrue($deleted, 'delete() powinno zwrócić true dla istniejącego rekordu');

        $this->assertNull(
            Book::getById((string)$id),
            'Po usunięciu getById() powinno zwrócić null'
        );
    }

    public function testDeleteNonexistentReturnsFalse(): void
    {
        $this->assertFalse(
            Book::delete(99999),
            'delete() dla nieistniejącego ID powinno zwrócić false'
        );
    }
}
