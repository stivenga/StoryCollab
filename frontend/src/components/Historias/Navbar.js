import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Aquí manejarías la lógica de cierre de sesión, por ejemplo, eliminando tokens de autenticación
        console.log('Sesión cerrada');
        navigate('/login'); // Redirige al usuario a la página de login después de cerrar sesión
    };

    return (
        <nav className="bg-gray-800 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo o título del dashboard */}
                <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/dashboard')}>
                    Dashboard
                </div>

                {/* Botón de Cerrar Sesión */}
                <div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-500 transition duration-300"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
