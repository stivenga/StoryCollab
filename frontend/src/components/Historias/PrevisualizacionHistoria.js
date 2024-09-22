import React from 'react';

const PrevisualizacionHistoria = ({ title, genre, type, content, imagePreview }) => {
    return (
        <div className="bg-gray-800 text-white rounded-lg shadow-lg p-8 w-full max-w-4xl mt-10">
            <h2 className="text-2xl font-bold mb-4">Previsualización de la Historia</h2>
            
            <div className="mb-4">
                <strong>Título:</strong> {title}
            </div>

            <div className="mb-4">
                <strong>Género:</strong> {genre}
            </div>

            <div className="mb-4">
                <strong>Tipo:</strong> {type}
            </div>

            <div className="mb-4">
                <strong>Contenido:</strong> <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>

            {imagePreview && (
                <div className="mb-4">
                    <strong>Imagen:</strong>
                    <img src={imagePreview} alt="Previsualización de la imagen" className="mt-2" />
                </div>
            )}
        </div>
    );
};

export default PrevisualizacionHistoria;
