-- Wstawianie autorów
INSERT INTO authors (name, surname, nationality, books_written, books_owned) VALUES
('J.K.', 'Rowling', 'UK', 7, 12),
('George', 'Orwell', 'UK', 6, 9),
('Stephen', 'King', 'USA', 28, 35),
('Agatha', 'Christie', 'UK', 22, 29),
('Isaac', 'Asimov', 'Russia/USA', 19, 25),
('Andrzej', 'Sapkowski', 'Poland', 8, 12),
('Ernest', 'Hemingway', 'USA', 10, 16),
('Haruki', 'Murakami', 'Japan', 12, 14),
('Gabriel', 'García Márquez', 'Colombia', 9, 13),
('Jane', 'Austen', 'UK', 6, 7);

-- Wstawianie gatunków
INSERT INTO genres (name) VALUES
('Mystery'),
('Adventure'),
('Sci-Fi'),
('Fantasy'),
('Drama'),
('Philosophy'),
('Historical'),
('Thriller'),
('Horror'),
('Romance');

-- Wstawianie książek
INSERT INTO books (title, author_id, year, genre_id) VALUES
('The Silent City', 1, 2002, 1),
('Fangs of the Wolf', 2, 1978, 2),
('Memory Maze', 3, 1985, 3),
('Quantum Shadows', 4, 1990, 4),
('Echoes of the Past', 5, 2001, 5),
('Forgotten Realms', 6, 1998, 4),
('Dawn Breaker', 7, 2005, 3),
('Legacy Code', 8, 2012, 6),
('The Iron Pact', 9, 1967, 7),
('Edge of Time', 10, 2020, 8),
('Flamebound', 1, 1993, 9),
('Blood Archive', 2, 2011, 1),
('Lunar Song', 3, 1999, 4),
('The Ivory Tower', 4, 2007, 5),
('Steelheart', 5, 1965, 2),
('Ashes and Embers', 6, 1981, 8),
('Crimson Bloom', 7, 1995, 10),
('Orbital Drift', 8, 1972, 3),
('The Seventh Seal', 9, 2003, 7),
('Hollow Roots', 10, 2015, 5),
('Chasm Walker', 1, 2006, 4),
('Specter’s Mark', 2, 2018, 1),
('Blind Prophet', 3, 2014, 3),
('The Nameless', 4, 1991, 9),
('Etherwind', 5, 1986, 3),
('Black Ice', 6, 1979, 8),
('Whispers Beyond', 7, 2022, 4),
('Frozen Kingdom', 8, 2010, 2),
('Clockwork Rose', 9, 2004, 7),
('The Velvet Cage', 10, 2019, 10),
('Shattered Compass', 1, 2000, 2),
('Veins of Gold', 2, 2016, 6),
('The Glimmer Pact', 3, 1988, 5),
('Soul Lantern', 4, 1997, 4),
('Dream Carver', 5, 1969, 10),
('Skyborn', 6, 2002, 4),
('Truth and Trickery', 7, 2017, 1),
('Roots of Wrath', 8, 1983, 5),
('Howling Pact', 9, 1996, 9),
('Dread and Delight', 10, 2021, 6),
('Tears of Stone', 1, 2009, 5),
('The Crooked Path', 2, 2013, 1),
('Painted Ash', 3, 2015, 8),
('Abyss Rising', 4, 1987, 3),
('Whispering Steel', 5, 1998, 7),
('Shadow Orchard', 6, 2006, 4),
('Mist Veil', 7, 2008, 10),
('Night\'s Oracle', 8, 2023, 4),
('Stormbound', 9, 1977, 2),
('Chains of Fire', 10, 2010, 8);