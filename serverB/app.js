const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 4000;

app.use(express.json());

// Postgres-yhteys
const pool = new Pool({
  user: 'postgres',
  host: 'db', // docker-compose service name
  database: 'animaldb',
  password: 'postgres',
  port: 5432,
});

// POST /adoptions
app.post('/adoptions', async (req, res) => {
  const { animal_id, applicant_name, email, phone, message } = req.body;

  if (!animal_id || !applicant_name || !email) {
    return res.status(400).send("animal_id, applicant_name ja email ovat pakollisia");
  }

  try {
    // Lisää hakemus
    const insertAdoption = await pool.query(
      `INSERT INTO adoptions (animal_id, applicant_name, email, phone, message) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [animal_id, applicant_name, email, phone || null, message || null]
    );

    // Päivitä eläimen status
    await pool.query(
      'UPDATE animals SET status = $1 WHERE id = $2',
      ['adopted', animal_id]
    );

    res.status(201).json(insertAdoption.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

app.listen(port, () => {
  console.log(`Server B running on port ${port}`);
});
