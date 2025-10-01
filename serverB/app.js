const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 4000;

// Middleware JSON-datan käsittelyyn
app.use(express.json());

// Postgres-yhteys
const pool = new Pool({
  user: 'postgres',
  host: 'db',            // docker-compose palvelun nimi
  database: 'animaldb',
  password: 'postgres',
  port: 5432,
});

// POST /adoptions
app.post('/adoptions', async (req, res) => {
  const { animal_id, applicant_name, email, phone, message } = req.body;

  if (!animal_id || !applicant_name || !email) {
    return res.status(400).json({ error: 'animal_id, applicant_name ja email ovat pakollisia kenttiä' });
  }

  try {
    // Aloitetaan transaktio
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Tallenna hakemus
      const insertAdoption = `
        INSERT INTO adoptions (animal_id, applicant_name, email, phone, message)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const adoptionResult = await client.query(insertAdoption, [
        animal_id,
        applicant_name,
        email,
        phone,
        message,
      ]);

      // 2. Päivitä eläimen status "adopted"
      const updateAnimal = `
        UPDATE animals
        SET status = 'adopted'
        WHERE id = $1
        RETURNING *;
      `;
      const animalResult = await client.query(updateAnimal, [animal_id]);

      await client.query('COMMIT');

      res.json({
        message: 'Adoptio tallennettu onnistuneesti',
        adoption: adoptionResult.rows[0],
        animal: animalResult.rows[0],
      });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Transaction error:', err);
      res.status(500).json({ error: 'Tietokantavirhe' });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Connection error:', err);
    res.status(500).json({ error: 'Yhteysvirhe tietokantaan' });
  }
});

app.listen(port, () => {
  console.log(`Server B running on port ${port}`);
});
