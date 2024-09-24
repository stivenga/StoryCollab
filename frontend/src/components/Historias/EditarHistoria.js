import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import { Link } from 'react-router-dom';

const EditarHistoria = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [genero, setGenero] = useState('');
  const [tipo, setTipo] = useState('');
  const [image, setImage] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const obtenerHistoria = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/historias/${id}`);
        setTitle(response.data.titulo);
        setContent(response.data.contenido);
        setGenero(response.data.genero);
        setTipo(response.data.tipo);
        setImage(response.data.imagen);
      } catch (error) {
        console.error('Error al obtener la historia:', error);
      }
    };
  
    obtenerHistoria();
  }, [id]);

  const handleEditorChange = (content) => {
    setContent(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('titulo', title);
      formData.append('contenido', content);
      formData.append('genero', genero);
      formData.append('tipo', tipo);
      formData.append('imagen', image);

      const response = await axios.put(`http://localhost:5000/api/historias/${id}`, formData);
      console.log('Historia actualizada:', response.data);
      setMensaje('Historia actualizada con éxito');
    } catch (error) {
      console.error('Error al actualizar la historia:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Editar Historia</h1>
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
          <label htmlFor="genero" className="block text-lg mb-2">Género</label>
          <select
            id="genero"
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded-md"
          >
            <option value="">Seleccione un género</option>
            <option value="Aventura">Aventura</option>
            <option value="Ciencia Ficción">Ciencia Ficción</option>
            <option value="Fantasía">Fantasía</option>
            <option value="Misterio">Misterio</option>
            <option value="Romance">Romance</option>
            <option value="Terror">Terror</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="tipo" className="block text-lg mb-2">Tipo</label>
          <input
            type="text"
            id="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded-md"
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg mb-2">Imagen</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
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
          Actualizar Historia
        </button>
        <Link to="/perfil-usuario" className="w-full py-3 bg-blue-600 rounded-md mt-4">
          Volver al Perfil
       </Link>
      </form>
      {mensaje && <p className="text-green-600">{mensaje}</p>}
    </div>
  );
};

export default EditarHistoria;