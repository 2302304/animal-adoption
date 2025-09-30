const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Postgres yhteys
const pool = new Pool({
  user: 'postgres',
  host: 'db',        // huom! docker-compose palvelun nimi
  database: 'animaldb',
  password: 'postgres',
  port: 5432,
});

// Hae kaikki eläimet
app.get('/animals', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM animals');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// Hae yksi eläin id:n mukaan
app.get('/animals/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query('SELECT * FROM animals WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).send('Animal not found');
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

app.listen(port, () => {
  console.log(`Server A running on port ${port}`);
});
