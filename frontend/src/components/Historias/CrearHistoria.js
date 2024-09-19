import React, { useState } from 'react';

const CrearHistoria = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState('');
    const [type, setType] = useState('');
    const [image, setImage] = useState(null);

    const handleImageUpload = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí manejarías el envío de datos a la API para crear la historia
        console.log({ title, description, genre, type, image });
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 text-white rounded-lg shadow-lg p-8 w-full max-w-lg">
                <h1 className="text-3xl font-bold mb-6 text-center">Crear Nueva Historia</h1>

                <form onSubmit={handleSubmit}>
                    {/* Título de la historia */}
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-lg mb-2">
                            Título de la Historia
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Escribe un título atractivo..."
                            className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    {/* Descripción */}
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-lg mb-2">
                            Descripción
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe la historia..."
                            rows="4"
                            className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    {/* Género */}
                    <div className="mb-4">
                        <label htmlFor="genre" className="block text-lg mb-2">
                            Género
                        </label>
                        <select
                            id="genre"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        >
                            <option value="">Selecciona un género</option>
                            <option value="Acción">Acción</option>
                            <option value="Romance">Romance</option>
                            <option value="Terror">Terror</option>
                            <option value="Fantasía">Fantasía</option>
                            <option value="Ciencia Ficción">Ciencia Ficción</option>
                        </select>
                    </div>

                    {/* Tipo */}
                    <div className="mb-4">
                        <label htmlFor="type" className="block text-lg mb-2">
                            Tipo
                        </label>
                        <input
                            type="text"
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            placeholder="¿Es una serie, película, corto...?"
                            className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    {/* Subir Imagen */}
                    <div className="mb-6">
                        <label htmlFor="image" className="block text-lg mb-2">
                            Imagen
                        </label>
                        <input
                            type="file"
                            id="image"
                            onChange={handleImageUpload}
                            className="w-full p-3 bg-gray-700 text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* Botón de Crear */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-green-600 rounded-md hover:bg-green-500 transition duration-300 font-bold text-lg"
                    >
                        Crear Historia
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CrearHistoria;
