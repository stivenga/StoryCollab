import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { Editor } from '@tinymce/tinymce-react';
import PrevisualizacionHistoria from './PrevisualizacionHistoria';

const CrearHistoria = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [genero, setGenero] = useState('');
  const [tipo, setTipo] = useState('');
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [showPreview, setShowPreview] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleEditorChange = (content) => {
    setContent(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('titulo', title);
    formData.append('contenido', content);
    formData.append('genero', genero);
    formData.append('tipo', tipo);
    formData.append('imagen', image);
    formData.append('correo', email); // Utiliza el valor de email del estado del componente
  
    try {
      const response = await axios.post('http://localhost:5000/historias', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
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
              genre={genero}
              type={tipo}
              content={content}
              imagePreview={image}
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
                <label className="block text-lg mb-2">Imagen</label>
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

              <button type="button" onClick={handlePreview} className="w-full py-3 bg-blue-600 rounded-md">
                Previsualizar
              </button>
            </form>
          )}

          {showPreview && (
            <button type="button" onClick={handleClosePreview} className="w-full py-3 bg-red-600 rounded-md">
              Cerrar Previsualización
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrearHistoria;