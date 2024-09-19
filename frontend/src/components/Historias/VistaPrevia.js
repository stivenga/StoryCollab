// src/components/Historias/VistaPrevia.js
import React from 'react';

const VistaPrevia = ({ titulo, descripcion }) => {
  return (
    <div style={{ border: '1px solid gray', padding: '10px', marginTop: '10px' }}>
      <h3>Vista previa de la historia:</h3>
      <h4>{titulo}</h4>
      <p>{descripcion}</p>
    </div>
  );
};

export default VistaPrevia;
