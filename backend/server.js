const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.log(err));

// Modelos
const Historia = require('./models/Historia');

// Rutas de autenticación
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Rutas de historias
const storyRoutes = require('./routes/stories');
app.use('/api/stories', storyRoutes);

// Crear historia con imagen
app.post('/historias', upload.single('imagen'), async (req, res) => {
    const { titulo, descripcion, correo } = req.body;
    const imagenPath = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const nuevaHistoria = new Historia({
            titulo,
            descripcion,
            imagen: imagenPath,
            correo
        });

        await nuevaHistoria.save();
        res.status(201).json(nuevaHistoria);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la historia' });
    }
});

// Obtener historias de un usuario específico por correo
app.get('/historias/usuario/:correo', async (req, res) => {
    const { correo } = req.params;
    try {
        const historias = await Historia.find({ correo });

        if (!historias.length) {
            return res.status(404).json({ mensaje: 'No se encontraron historias para este usuario' });
        }

        res.json(historias);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las historias' });
    }
});

// Eliminar historia
app.delete('/historias/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        await Historia.findByIdAndDelete(id);
        res.status(200).json({ mensaje: 'Historia eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la historia' });
    }
});

// Ruta para probar la API
app.get('/', (req, res) => {
    res.send('API de CollabStories funcionando');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
