// routes/stories.js
const express = require('express');
const Story = require('../models/Story');
const router = express.Router();

// Crear una nueva historia
router.post('/add', async (req, res) => {
    const { title, genre, author, content, image } = req.body;

    try {
        const newStory = new Story({
            title,
            genre,
            author,
            content,
            image
        });

        await newStory.save();
        res.status(201).json({ message: 'Historia creada con éxito', story: newStory });
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al crear la historia' });
    }
});

// Obtener todas las historias
router.get('/', async (req, res) => {
    try {
        const stories = await Story.find();
        res.json(stories);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener las historias.' });
    }
});

// Obtener historias por género
router.get('/genre/:genre', async (req, res) => {
    const { genre } = req.params;
    try {
        const stories = await Story.find({ genre });
        res.json(stories);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener las historias por género.' });
    }
});

module.exports = router;
