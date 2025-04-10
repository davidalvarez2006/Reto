import express from 'express';
import { pool } from './db.js';
import { config } from 'dotenv';
import cors from 'cors';

config();

const app = express();
app.use(express.json());
app.use(cors());  // Habilitar CORS

// Obtener todas las conversaciones
app.get('/conversations', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM conversaciones');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener conversaciones:', err);
    res.status(500).json({ error: err.message });
  }
});


// Agregar conversacion
app.post('/conversations/add', async (req, res) => {
  const { title, messages } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO conversaciones (title, messages) VALUES (?, ?)',
      [title, JSON.stringify(messages)]
    );
    res.json({ id: result.insertId, title, messages });
  } catch (err) {
    console.error('Error al guardar conversación:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/conversations/update/:id', async (req, res) => {
  const { id } = req.params;
  const { title, messages } = req.body;
  try {
    await pool.query(
      'UPDATE conversaciones SET title = ?, messages = ? WHERE id = ?',
      [title, JSON.stringify(messages), id]
    );
    res.json({ message: 'Conversación actualizada' });
  } catch (err) {
    console.error('Error al actualizar conversación:', err);
    res.status(500).json({ error: err.message });
  }
});


// Eliminar todas las conversaciones
app.delete('/conversations', async (req, res) => {
  try {
    await pool.query('DELETE FROM conversaciones');
    res.json({ message: 'Todas las conversaciones han sido eliminadas' });
  } catch (err) {
    console.error('Error al eliminar todas las conversaciones:', err);
    res.status(500).json({ error: err.message });
  }
});



// Escuchar en el puerto definido
const PORT = process.env.NODE_DOCKER_PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
