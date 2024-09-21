// routes/historias.js
const express = require('express');
const router = express.Router();
const Historia = require('../models/Historia');

// Ruta para crear una historia
router.post('/historias', async (req, res) => {
  const { titulo, descripcion, genero, tipo, imagen, contenido } = req.body;

  try {
    const nuevaHistoria = new Historia({
      titulo,
      descripcion,
      genero,
      tipo,
      imagen,  // Aquí se puede manejar la imagen (se verá más adelante)
      contenido,
    });

    await nuevaHistoria.save();
    res.status(201).json(nuevaHistoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la historia' });
  }
});

module.exports = router;
