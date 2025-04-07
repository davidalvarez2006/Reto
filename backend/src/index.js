import express from 'express';
import { config } from 'dotenv';
import { pool } from './db.js'; // importar pool
config();

const app = express();
app.use(express.json()); // importante para poder leer JSON en POST

app.get('/', (req, res) => {
  res.send('Hello Worlddd');
});

app.get('/ping', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW()');
    res.json(rows);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Ruta para guardar un mensaje en la DB
app.post('/mensaje', async (req, res) => {
  const { msjUsuario, msjBot } = req.body;  // Aseguramos que tomas msjUsuario y msjBot
  try {
    await pool.query(
      'INSERT INTO mensajes (msjUsuario, msjBot) VALUES (?, ?)', // Reemplazar 'usuario' por 'msjUsuario'
      [msjUsuario, msjBot]
    );
    res.json({ ok: true, msg: 'Mensaje guardado' });
  } catch (err) {
    console.error('Error insertando:', err);
    res.status(500).json({ error: err.message });
  }
});


app.listen(process.env.NODE_DOCKER_PORT, () =>
  console.log('Server on port', process.env.NODE_DOCKER_PORT)
);
