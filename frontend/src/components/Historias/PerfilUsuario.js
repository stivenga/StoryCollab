import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PerfilUsuario = () => {
    const [historias, setHistorias] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Llamada a la API para obtener las historias del usuario logueado
        const obtenerHistorias = async () => {
            try {
                const response = await fetch('http://localhost:5000/historias/usuario/1'); // Cambia 1 por el id del usuario logueado
                const data = await response.json();
                setHistorias(data);
            } catch (error) {
                console.error('Error al obtener las historias:', error);
            }
        };
        obtenerHistorias();
    }, []);

    const eliminarHistoria = async (id) => {
        try {
            await fetch(`http://localhost:5000/historias/${id}`, {
                method: 'DELETE',
            });
            // Filtrar las historias para eliminar la historia borrada localmente
            setHistorias(historias.filter((historia) => historia._id !== id));
        } catch (error) {
            console.error('Error al eliminar la historia:', error);
        }
    };

    const handleLogout = () => {
        // Lógica para cerrar sesión, como eliminar el token de autenticación
        localStorage.removeItem('token'); // Si usas localStorage para guardar el token
        navigate('/login'); // Redirige al usuario a la página de inicio de sesión
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Navbar */}
            <nav className="bg-gray-800 text-white py-4 mb-6">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-2xl font-bold">
                        Perfil de Usuario
                    </div>
                    <div className="flex space-x-4">
                        <Link to="/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                            Ir al inicio
                        </Link>
                        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </nav>

            <h1 className="text-3xl font-bold mb-6 text-center">Mis Historias</h1>
            <Link to="/crear-historia" className="bg-green-600 text-white px-4 py-2 rounded-md">
                Crear Nueva Historia
            </Link>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {historias.map((historia) => (
                    <div key={historia._id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-2">{historia.titulo}</h2>
                        <p className="text-gray-400">{historia.descripcion.substring(0, 100)}...</p>

                        <div className="mt-4 flex justify-between">
                            <Link to={`/editar-historia/${historia._id}`} className="bg-blue-500 px-3 py-2 rounded-md">
                                Editar
                            </Link>
                            <button
                                onClick={() => eliminarHistoria(historia._id)}
                                className="bg-red-600 px-3 py-2 rounded-md"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PerfilUsuario;

