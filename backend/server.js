// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const multer = require('multer'); // <-- Importar Multer
const path = require('path'); // <-- Para manejar rutas de archivos

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
    origin: 'http://localhost:3000', // Permitir solo el front-end
}));
app.use(express.json());
app.use(bodyParser.json());

// Configurar la carpeta 'uploads' como pública para poder acceder a las imágenes desde el frontend
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración de Multer para manejar la subida de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Carpeta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  // Renombrar archivo con timestamp
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

// Rutas
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const storyRoutes = require('./routes/stories');
app.use('/api/stories', storyRoutes);

// Definir el esquema para las historias
const HistoriaSchema = new mongoose.Schema({
    titulo: String,
    descripcion: String,
    imagen: String, // <-- Añadir campo para la imagen
});

const Historia = mongoose.model('Historia', HistoriaSchema);

// Endpoint para crear una historia con imagen
app.post('/historias', upload.single('imagen'), async (req, res) => {
  const { titulo, descripcion } = req.body;
  const imagenPath = req.file ? `/uploads/${req.file.filename}` : null;  // Ruta de la imagen subida

  try {
    const nuevaHistoria = new Historia({
      titulo,
      descripcion,
      imagen: imagenPath  // Guardar la ruta de la imagen en la base de datos
    });

    await nuevaHistoria.save();
    res.status(201).json(nuevaHistoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la historia' });
  }
});

// Ruta de prueba para verificar que la API está funcionando
app.get('/', (req, res) => {
    res.send('API de CollabStories funcionando');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
