const express = require('express');
const router = express.Router();
const Historia = require('../models/Historia');
const User = require('../models/User');

router.post('/historias', async (req, res) => {
  const { titulo, descripcion, correo, contenido, tipo, genero } = req.body;
  const usuarioId = req.user.id;

  try {
    const nuevaHistoria = new Historia({
      titulo,
      descripcion,
      contenido,
      tipo,
      genero,
      correo, // Agrega el correo electrónico al objeto Historia
      usuario: usuarioId
    });

    await nuevaHistoria.save();

    const usuario = await User.findById(usuarioId);
    usuario.historias.push(nuevaHistoria._id);
    await usuario.save();

    res.status(201).json(nuevaHistoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la historia' });
  }
});

router.get('/historias', async (req, res) => {
  try {
    const historias = await Historia.find();
    res.json(historias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las historias' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const historia = await Historia.findById(id);
    if (!historia) {
      return res.status(404).json({ message: 'Historia no encontrada' });
    }
    res.json(historia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la historia' });
  }
});

router.get('/historias/usuario/:correo', async (req, res) => {
  const { correo } = req.params;
  console.log('Correo electrónico:', correo);

  try {
    const historias = await Historia.find({ correo });
    console.log('Historias:', historias);
    res.json(historias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las historias' });
  }
});

router.put('/:id', upload.single('imagen'), async (req, res) => {
  try {
    const id = req.params.id;
    const { titulo, contenido, genero, tipo } = req.body;
    const imagenPath = req.file ? `/uploads/${req.file.filename}` : null;

    const historia = await Historia.findByIdAndUpdate(id, {
      titulo,
      contenido,
      genero,
      tipo,
      imagen: imagenPath,
    }, { new: true });

    res.json(historia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la historia' });
  }
});

module.exports = router;