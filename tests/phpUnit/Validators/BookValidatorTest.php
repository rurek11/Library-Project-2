<?php

namespace Tests\Validators;

use PHPUnit\Framework\TestCase;
use App\Validators\BookValidator;
use InvalidArgumentException;

class BookValidatorTest extends TestCase
{
    /** @var int Aktualny rok do testów zakresu year */
    private int $currentYear;

    protected function setUp(): void
    {
        parent::setUp();
        $this->currentYear = (int)date('Y');
    }

    //
    // —— testy pozytywne dla validateCreate()
    //

    public function testValidateCreateWithValidDataDoesNotThrow(): void
    {
        $data = [
            'title'     => 'Valid Title',
            'author_id' => '1',
            'year'      => (string)$this->currentYear,
            'genre_id'  => '2',
        ];
        $validator = new BookValidator($data);
        // metoda nic nie zwraca (void), więc zwróci null
        $this->assertNull($validator->validateCreate());
    }

    //
    // —— testy negatywne dla pola title
    //

    public function testTitleMustBeString(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Title must be a string.');
        $validator = new BookValidator([
            'title'     => true,
            'author_id' => '1',
            'year'      => '2024',
            'genre_id'  => '1',
        ]);
        $validator->validateCreate();
    }

    public function testTitleCannotBeEmpty(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Title cannot be empty.');
        $validator = new BookValidator([
            'title'     => '',
            'author_id' => '1',
            'year'      => '2024',
            'genre_id'  => '1',
        ]);
        $validator->validateCreate();
    }

    public function testTitleCannotBeOnlySpaces(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Title cannot be empty.');
        $validator = new BookValidator([
            'title'     => '    ',
            'author_id' => '1',
            'year'      => '2024',
            'genre_id'  => '1',
        ]);
        $validator->validateCreate();
    }

    public function testTitleCannotBeLongerThan120Chars(): void
    {
        $long = str_repeat('a', 121);
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Title cannot be longer than 120 chars.');
        $validator = new BookValidator([
            'title'     => $long,
            'author_id' => '1',
            'year'      => '2024',
            'genre_id'  => '1',
        ]);
        $validator->validateCreate();
    }

    //
    // —— testy negatywne dla pola author_id
    //

    public function testAuthorIdCannotBeBoolean(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Author id cannot be a boolean.');
        $validator = new BookValidator([
            'title'     => 'T',
            'author_id' => true,
            'year'      => '2024',
            'genre_id'  => '1',
        ]);
        $validator->validateCreate();
    }

    public function testAuthorIdMustBeIntegerNumber(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Author id must be an integer number.');
        $validator = new BookValidator([
            'title'     => 'T',
            'author_id' => 'abc',
            'year'      => '2024',
            'genre_id'  => '1',
        ]);
        $validator->validateCreate();
    }

    public function testAuthorIdMustBeGreaterThanZero(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Author id must be greater than 0.');
        $validator = new BookValidator([
            'title'     => 'T',
            'author_id' => '0',
            'year'      => '2024',
            'genre_id'  => '1',
        ]);
        $validator->validateCreate();
    }

    //
    // —— testy negatywne dla pola genre_id
    //

    public function testGenreIdCannotBeBoolean(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Genre id cannot be a boolean.');
        $validator = new BookValidator([
            'title'     => 'T',
            'author_id' => '1',
            'year'      => '2024',
            'genre_id'  => true,
        ]);
        $validator->validateCreate();
    }

    public function testGenreIdMustBeIntegerNumber(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Genre id must be an integer number.');
        $validator = new BookValidator([
            'title'     => 'T',
            'author_id' => '1',
            'year'      => '2024',
            'genre_id'  => 'abc',
        ]);
        $validator->validateCreate();
    }

    public function testGenreIdMustBeGreaterThanZero(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Genre id must be greater than 0.');
        $validator = new BookValidator([
            'title'     => 'T',
            'author_id' => '1',
            'year'      => '2024',
            'genre_id'  => '0',
        ]);
        $validator->validateCreate();
    }

    //
    // —— testy negatywne dla pola year
    //

    public function testYearCannotBeBoolean(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Year cannot be a boolean.');
        $validator = new BookValidator([
            'title'     => 'T',
            'author_id' => '1',
            'year'      => true,
            'genre_id'  => '1',
        ]);
        $validator->validateCreate();
    }

    public function testYearMustBeIntegerNumber(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Year must be an integer number.');
        $validator = new BookValidator([
            'title'     => 'T',
            'author_id' => '1',
            'year'      => '20x4',
            'genre_id'  => '1',
        ]);
        $validator->validateCreate();
    }

    public function testYearMustBeGreaterThanZero(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Year must be greater than 0.');
        $validator = new BookValidator([
            'title'     => 'T',
            'author_id' => '1',
            'year'      => '0',
            'genre_id'  => '1',
        ]);
        $validator->validateCreate();
    }

    public function testYearMustBeAtLeast1000(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage("Year must be between 1000 and {$this->currentYear}.");
        $validator = new BookValidator([
            'title'     => 'T',
            'author_id' => '1',
            'year'      => '999',
            'genre_id'  => '1',
        ]);
        $validator->validateCreate();
    }

    public function testYearCannotExceedCurrentYear(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage("Year must be between 1000 and {$this->currentYear}.");
        $validator = new BookValidator([
            'title'     => 'T',
            'author_id' => '1',
            'year'      => (string)($this->currentYear + 1),
            'genre_id'  => '1',
        ]);
        $validator->validateCreate();
    }

    //
    // —— testy pozytywne i negatywne dla pola id (validateDelete)
    //

    public function testValidateDeleteWithValidIdDoesNotThrow(): void
    {
        $validator = new BookValidator(['id' => '5']);
        $this->assertNull($validator->validateDelete());
    }

    public function testIdCannotBeBoolean(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Id cannot be a boolean.');
        (new BookValidator(['id' => true]))->validateDelete();
    }

    public function testIdMustBeIntegerNumber(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Id must be an integer number.');
        (new BookValidator(['id' => 'abc']))->validateDelete();
    }

    public function testIdMustBeGreaterThanZero(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Id must be greater than 0.');
        (new BookValidator(['id' => '0']))->validateDelete();
    }
}
