import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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
        setSuccess('');

        // Validar la contraseña en el front-end
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setError('La contraseña debe tener al menos 8 caracteres, incluyendo letras mayúsculas, minúsculas y números.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', formData);
            setSuccess(response.data.msg);
            setFormData({ username: '', email: '', password: '' });
        } catch (err) {
            if (err.response && err.response.data && err.response.data.msg) {
                setError(err.response.data.msg);
            } else {
                setError('Error al registrar el usuario.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-3 bg-white rounded shadow">
                <h1 className="text-2xl font-bold text-center">Registro de Usuario</h1>
                {error && <div className="p-2 text-red-700 bg-red-200 border border-red-700 rounded">{error}</div>}
                {success && <div className="p-2 text-green-700 bg-green-200 border border-green-700 rounded">{success}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block mb-1">Nombre de Usuario</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
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
                        <p className="text-sm text-gray-600 mt-2">
                            La contraseña debe tener al menos 8 caracteres, incluyendo letras mayúsculas, minúsculas y números.
                        </p>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                        Registrarse
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600">
                    ¿Ya tienes una cuenta? <Link to="/login" className="text-blue-600 hover:underline">Inicia Sesión</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
