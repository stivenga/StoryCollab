import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 text-white py-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-2xl font-bold">
                    <Link to="/dashboard">Home</Link>
                </div>
                <div className="flex space-x-4">
                    {/* Otras opciones de navegación */}
                    <Link to="/crear-historia" className="hover:text-green-400">Crear Historia</Link>
                    {/* Botón para ir al perfil del usuario */}
                    <Link to="/perfil-usuario" className="hover:text-green-400">Perfil</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
