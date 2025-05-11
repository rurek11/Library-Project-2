<?php

namespace App\Db;

class Database
{
    private string $host = "db";
    private string $dbname = "books_db";
    private string $username = "user";
    private string $password = "password";
    private ?\PDO $con = null;

    public function __construct()
    {
        try {
            $this->con = new \PDO(
                "mysql:host={$this->host};dbname={$this->dbname};charset=utf8",
                $this->username,
                $this->password
            );

            $this->con->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        } catch (\PDOException $e) {
            throw new \RuntimeException("Błąd połączenia z bazą danych: " . $e->getMessage());
        }
    }

    public function getCon(): \PDO
    {
        return $this->con;
    }
}
