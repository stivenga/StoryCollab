import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Historias = () => {
  const [historias, setHistorias] = useState([]);

  useEffect(() => {
    const obtenerHistorias = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/historias'); // Cambia la ruta aquí
        setHistorias(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    obtenerHistorias();
  }, []);

  return (
    <div>
      <h1>Todas las historias</h1>
      <ul>
        {historias.map((historia) => (
          <li key={historia._id}>
            <h2>{historia.titulo}</h2>
            <p>{historia.descripcion}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Historias;