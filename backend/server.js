// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
    origin: 'http://localhost:3000', // Permitir solo el front-end
}));
app.use(express.json());
app.use(bodyParser.json());

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


app.get('/', (req, res) => {
    res.send('API de CollabStories funcionando');
});


const storyRoutes = require('./routes/stories');
app.use('/api/stories', storyRoutes);

const HistoriaSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
});

const Historia = mongoose.model('Historia', HistoriaSchema);

// Endpoint para crear una historia
app.post('/historias', async (req, res) => {
  const { titulo, descripcion } = req.body;
  const nuevaHistoria = new Historia({ titulo, descripcion });
  await nuevaHistoria.save();
  res.status(201).json(nuevaHistoria);
});


// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
