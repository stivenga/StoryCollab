// models/Historia.js
const mongoose = require('mongoose');

const HistoriaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  genero: { type: String, required: true },
  tipo: { type: String, required: true },
  imagen: { type: String },  // Aquí se puede almacenar la ruta o URL de la imagen
  contenido: { type: String, required: true },
  correoUsuario: { type: String, required: true },  // <-- Añadir el campo de correo del usuario
});

module.exports = mongoose.model('Historia', HistoriaSchema);
