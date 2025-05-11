<?php

namespace Tests\Services;

use PHPUnit\Framework\TestCase;
use App\Services\BookService;
use App\Model\Book;
use InvalidArgumentException;

class BookServiceTest extends TestCase
{
    protected static bool $dbSeeded = false;

    public static function setUpBeforeClass(): void
    {
        if (!self::$dbSeeded) {
            // Jeśli potrzeba, tu można zasilić testową bazę authors/genres
            self::$dbSeeded = true;
        }
    }

    public function testGetAllBooksReturnsArray(): void
    {
        $service = new BookService([]);
        $all = $service->getAllBooks();
        $this->assertIsArray($all, "getAllBooks() should return an array");
    }

    public function testCreateBookWithValidDataReturnsTrue(): void
    {
        $data = [
            'title'     => 'Unit Test Book',
            'author_id' => 1,
            'year'      => 2021,
            'genre_id'  => 1,
        ];
        $service = new BookService($data);
        $ok = $service->createBook();
        $this->assertTrue($ok, 'createBook() should return true on success');
    }

    public function testCreateBookWithInvalidDataThrowsException(): void
    {
        $data = [
            'title'     => '',     // empty title
            'author_id' => -5,     // invalid author
            'year'      => 999,    // too early
            'genre_id'  => 0,      // invalid genre
        ];
        $service = new BookService($data);
        $this->expectException(InvalidArgumentException::class);
        $service->createBook();
    }

    // ——— NOWY TEST — Verify that the data really got saved ———
    public function testCreateBookAndVerifyData(): void
    {
        $data = [
            'title'     => 'Verification Book',
            'author_id' => 1,
            'year'      => 2024,
            'genre_id'  => 1,
        ];
        $this->assertTrue((new BookService($data))->createBook());

        // pobieramy wszystkie książki, bierzemy tę z największym ID
        $all   = Book::getAll();
        $first = reset($all);

        $this->assertEquals($data['title'],     $first['title']);
        $this->assertEquals($data['author_id'], $first['author_id']);
        $this->assertEquals($data['year'],      $first['year']);
        $this->assertEquals($data['genre_id'],  $first['genre_id']);
    }

    public function testUpdateBookWithSameDataReturnsFalse(): void
    {
        // najpierw dodajemy
        $data = [
            'title'     => 'Updatable Book',
            'author_id' => 1,
            'year'      => 2022,
            'genre_id'  => 1,
        ];
        (new BookService($data))->createBook();

        // pobieramy największe ID
        $all   = Book::getAll();
        $first = reset($all);
        $id    = $first['id'];

        // próbujemy zaktualizować tymi samymi danymi
        $dataUpdate = array_merge($data, ['id' => $id]);
        $changed = (new BookService($dataUpdate))->updateBook();

        $this->assertFalse($changed, 'updateBook() should return false if no fields changed');
    }

    public function testUpdateBookWithNonexistentIdThrowsException(): void
    {
        $data = [
            'id'        => 999999,  // nie istnieje
            'title'     => 'Foo',
            'author_id' => 1,
            'year'      => 2022,
            'genre_id'  => 1,
        ];
        $service = new BookService($data);
        $this->expectException(InvalidArgumentException::class);
        $service->updateBook();
    }

    // ——— NOWY TEST — Verify that update really changed data ———
    public function testUpdateBookAndVerifyData(): void
    {
        // dodajemy nową książkę
        $original = [
            'title'     => 'Original Title',
            'author_id' => 1,
            'year'      => 2023,
            'genre_id'  => 1,
        ];
        (new BookService($original))->createBook();

        // pobieramy jej ID
        $all   = Book::getAll();
        $first = reset($all);
        $id    = $first['id'];

        // przygotowujemy nowe dane
        $updated = [
            'id'        => $id,
            'title'     => 'Updated Title',
            'author_id' => 1,
            'year'      => 2024,
            'genre_id'  => 1,
        ];
        $this->assertTrue((new BookService($updated))->updateBook(), 'updateBook() should return true on successful update');

        // sprawdzamy w bazie
        $changed = Book::getById($id);
        $this->assertEquals('Updated Title', $changed['title']);
        $this->assertEquals(2024,            $changed['year']);
    }

    public function testDeleteBookWithValidIdReturnsTrue(): void
    {
        $data = [
            'title'     => 'Deletable Book',
            'author_id' => 1,
            'year'      => 2023,
            'genre_id'  => 1,
        ];
        (new BookService($data))->createBook();

        // pobieramy największe ID
        $all   = Book::getAll();
        $first = reset($all);
        $id    = $first['id'];

        $deleted = (new BookService(['id' => $id]))->deleteBook();
        $this->assertTrue($deleted, 'deleteBook() should return true for existing record');
    }

    public function testDeleteBookWithInvalidIdThrowsException(): void
    {
        $service = new BookService(['id' => 0]);
        $this->expectException(InvalidArgumentException::class);
        $service->deleteBook();
    }
}
