const mongoose = require('mongoose');

const HistoriaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  contenido: { type: String, required: true },
  genero: { type: String, required: true },
  tipo: { type: String, required: true },
  correo: { type: String, required: true }, // Agrega el campo correo al esquema
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Historia', HistoriaSchema);