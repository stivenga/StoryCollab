import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword); // Alternar visibilidad de la contraseña
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', response.data.token); // Guardar el token en localStorage
            navigate('/dashboard'); // Redirigir al usuario al dashboard
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Error al iniciar sesión.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-3 bg-white rounded shadow">
                <h1 className="text-2xl font-bold text-center">Iniciar Sesión</h1>
                {error && <div className="p-2 text-red-700 bg-red-200 border border-red-700 rounded">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block mb-1">Correo Electrónico</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="password" className="block mb-1">Contraseña</label>
                        <input
                            type={showPassword ? 'text' : 'password'} // Alternar entre texto y contraseña
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        {/* Botón para alternar visibilidad */}
                        <button
                            type="button"
                            onClick={toggleShowPassword}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-600"
                        >
                            {showPassword ? 'Ocultar' : 'Mostrar'}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                        Iniciar Sesión
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600">
                    ¿No tienes una cuenta? <Link to="/register" className="text-blue-600 hover:underline">Regístrate</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
