import React, { useState } from 'react';
import Navbar from './Navbar';
import { Editor } from '@tinymce/tinymce-react';
import PrevisualizacionHistoria from './PrevisualizacionHistoria';

const CrearHistoria = () => {
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [type, setType] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [email, setEmail] = useState(localStorage.getItem('email') || ''); // Guardar el email del usuario

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setImage(file);

        if (file) {
            const previewURL = URL.createObjectURL(file);
            setImagePreview(previewURL);
        }
    };

    const handleEditorChange = (content) => {
        setContent(content);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('titulo', title);
        formData.append('descripcion', content);
        formData.append('imagen', image);
        formData.append('email', email);  // Añadir el email al FormData
    
        try {
            const response = await fetch('http://localhost:5000/historias', {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error('Error al crear la historia');
            }
    
            const data = await response.json();
            console.log('Historia creada:', data);

            setShowPreview(true);
        } catch (error) {
            console.error('Error al crear la historia:', error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />

            <div className="flex items-center justify-center">
                <div className="bg-gray-800 text-white rounded-lg shadow-lg p-8 w-full max-w-4xl mt-10">
                    <h1 className="text-3xl font-bold mb-6 text-center">Crear Nueva Historia</h1>

                    {showPreview ? (
                        <PrevisualizacionHistoria
                            title={title}
                            genre={genre}
                            type={type}
                            content={content}
                            imagePreview={imagePreview}
                        />
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-lg mb-2">Título de la Historia</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Escribe un título atractivo..."
                                    className="w-full p-3 bg-gray-700 rounded-md"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="genre" className="block text-lg mb-2">Género</label>
                                <select
                                    id="genre"
                                    value={genre}
                                    onChange={(e) => setGenre(e.target.value)}
                                    className="w-full p-3 bg-gray-700 rounded-md"
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

                            <div className="mb-4">
                                <label htmlFor="type" className="block text-lg mb-2">Tipo</label>
                                <input
                                    type="text"
                                    id="type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    placeholder="¿Es una serie, película, corto...?"
                                    className="w-full p-3 bg-gray-700 rounded-md"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="email" className="block text-lg mb-2">Email del Creador</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Introduce tu email"
                                    className="w-full p-3 bg-gray-700 rounded-md"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="image" className="block text-lg mb-2">Imagen</label>
                                <input
                                    type="file"
                                    id="image"
                                    onChange={handleImageUpload}
                                    className="w-full p-3 bg-gray-700 text-gray-400 rounded-md"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-lg mb-2">Contenido de la Historia</label>
                                <Editor
                                    apiKey="wph970glaoe9p76v1q95nve89ihnxxag5ncefc9owi9ce4gb"
                                    value={content}
                                    init={{
                                        height: 500,
                                        menubar: true,
                                        plugins: [
                                            'advlist autolink lists link image charmap print preview anchor',
                                            'searchreplace visualblocks code fullscreen',
                                            'insertdatetime media table paste code help wordcount'
                                        ],
                                        toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
                                    }}
                                    onEditorChange={handleEditorChange}
                                />
                            </div>

                            <button type="submit" className="w-full py-3 bg-green-600 rounded-md">
                                Crear Historia
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CrearHistoria;
