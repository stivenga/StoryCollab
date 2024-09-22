import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { Editor } from '@tinymce/tinymce-react';

const EditarHistoria = () => {
    const { id } = useParams(); // Obtener el id de la historia desde la URL
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [type, setType] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerHistoria = async () => {
            try {
                const response = await fetch(`http://localhost:5000/historias/${id}`);
                const data = await response.json();
                setTitle(data.titulo);
                setGenre(data.genero);
                setType(data.tipo);
                setContent(data.descripcion);
            } catch (error) {
                console.error('Error al obtener la historia:', error);
            }
        };
        obtenerHistoria();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('titulo', title);
        formData.append('descripcion', content);
        if (image) {
            formData.append('imagen', image); // Sólo agregar la imagen si se ha seleccionado una nueva
        }

        try {
            await fetch(`http://localhost:5000/historias/${id}`, {
                method: 'PUT',
                body: formData,
            });
            navigate('/perfil-usuario'); // Redirigir al perfil tras la edición
        } catch (error) {
            console.error('Error al editar la historia:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <div className="flex items-center justify-center">
                <div className="bg-gray-800 text-white rounded-lg p-8 w-full max-w-4xl mt-10">
                    <h1 className="text-3xl font-bold mb-6 text-center">Editar Historia</h1>
                    <form onSubmit={handleSubmit}>
                        {/* Reutilizamos los inputs y editor como en CrearHistoria */}
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-lg mb-2">Título de la Historia</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-3 bg-gray-700 rounded-md"
                            />
                        </div>
                        {/* Otros campos similares... */}
                        <button type="submit" className="w-full py-3 bg-green-600 rounded-md">Guardar Cambios</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditarHistoria;
