// src/api/historiasApi.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/historias'; // Cambia la URL según tu backend

export const crearHistoria = async (historiaData) => {
  try {
    const response = await axios.post(API_URL, historiaData);
    return response.data;
  } catch (error) {
    console.error('Error al crear la historia:', error);
    throw error;
  }
};
