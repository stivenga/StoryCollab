const express = require('express');
const router = express.Router();
const Historia = require('../models/Historia');


// Ruta para crear una historia
router.post('/historias', async (req, res) => {
  const { titulo, descripcion, genero, tipo, imagen, contenido, correoUsuario } = req.body;

  try {
    const nuevaHistoria = new Historia({
      titulo,
      descripcion,
      genero,
      tipo,
      imagen,
      contenido,
      correoUsuario  // <-- Guardar el correo del usuario
    });

    await nuevaHistoria.save();
    res.status(201).json(nuevaHistoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la historia' });
  }
});

app.get('/historias/usuario/:correo', async (req, res) => {
  const { correo } = req.params;
  try {
    const historias = await Historia.find({ correoUsuario: correo });
    if (!historias.length) {
      return res.status(404).json({ mensaje: 'No se encontraron historias para este usuario' });
    }
    res.json(historias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las historias' });
  }
});
module.exports = router;