-- Taulu eläimille
CREATE TABLE animals (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,       -- esim. "cat", "dog"
    age INT,
    breed TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'available',
    description TEXT
);

-- Taulu adoptiolle
CREATE TABLE adoptions (
    id SERIAL PRIMARY KEY,
    animal_id INT REFERENCES animals(id),
    applicant_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Esimerkkieläimiä
INSERT INTO animals (name, type, age, breed, image_url, description)
VALUES
('Misu', 'cat', 3, 'Maine Coon', 'https://placekitten.com/200/200', 'Kiltti sisäkissa.'),
('Rekku', 'dog', 5, 'Labrador', 'https://placedog.net/200/200', 'Energiaa täynnä oleva koira.'),
('Nuppu', 'cat', 2, 'Siamese', 'https://placekitten.com/250/250', 'Utelias sorttia.'),
('Max', 'dog', 7, 'Beagle', 'https://placedog.net/250/250', 'Rauhallinen ulkoilukaveri.'),
('Polle', 'bird', 1, 'Budgerigar', 'https://loremflickr.com/200/200/parrot', 'Värikäs ja puhelias lintu.');

