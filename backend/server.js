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

const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/');
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      }
    }),
    limits: { fileSize: 1000000 }, // Tamaño máximo del archivo
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Solo se permiten archivos de imagen'));
      }
      cb(undefined, true);
    }
  });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

const historiasRouter = require('./routes/historias');
app.use('/api/historias', historiasRouter);

app.use('/api', require('./routes/historias'));

// Crear historia con imagen
app.post('/historias', upload.single('imagen'), async (req, res) => {
  try {
    const { titulo, descripcion, contenido, tipo, genero } = req.body;
    const imagenPath = req.file ? `/uploads/${req.file.filename}` : null;

    const nuevaHistoria = new Historia({
      titulo,
      descripcion,
      contenido,
      tipo,
      genero,
      imagen: imagenPath,
      correo: req.body.correo, // Agregar el correo electrónico al objeto Historia
    });

    await nuevaHistoria.save();
    res.status(201).json(nuevaHistoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la historia', error: error.message });
  }
});

app.get('/api/historias', async (req, res) => {
  try {
    const historias = await Historia.find();
    res.json(historias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las historias' });
  }
});

app.get('/api/historias/:id', async (req, res) => {
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

app.put('/api/historias/:id', upload.single('imagen'), async (req, res) => {
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

app.delete('/historias/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Historia.findByIdAndDelete(id);
    res.status(200).json({ mensaje: 'Historia eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la historia' });
  }
});

// Obtener historias de un usuario específico por correo
app.get('/historias/usuario/:correo', async (req, res) => {
  const { correo } = req.params;

  try {
    const historias = await Historia.find({ correo });
    res.json(historias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las historias' });
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