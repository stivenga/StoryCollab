// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Registro de usuario
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Validar campos
    if (!username || !email || !password) {
        return res.status(400).json({ msg: 'Por favor, completa todos los campos.' });
    }

    // Validar la contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ msg: 'La contraseña debe tener al menos 8 caracteres, incluyendo letras mayúsculas, minúsculas y números.' });
    }

    try {
        // Verificar si el correo ya está registrado
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'El correo electrónico ya está registrado.' });
        }

        // Verificar si el nombre de usuario ya está registrado
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ msg: 'El nombre de usuario ya está en uso.' });
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear nuevo usuario
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ msg: 'Usuario registrado exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error del servidor.' });
    }
});

module.exports = router;

