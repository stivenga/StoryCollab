// frontend/src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';

const Dashboard = () => {
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProtectedData = async () => {
            try {
                const response = await axiosInstance.get('/api/auth/protected');
                setMessage(response.data.message);
                setUser(response.data.user);
            } catch (err) {
                setError('No se pudo obtener datos protegidos.');
            }
        };

        fetchProtectedData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-3 bg-white rounded shadow">
                <h1 className="text-2xl font-bold text-center">Dashboard</h1>
                {error && <div className="p-2 text-red-700 bg-red-200 border border-red-700 rounded">{error}</div>}
                {message && <p className="text-center">{message}</p>}
                {user && (
                    <div className="text-center">
                        <p><strong>ID de Usuario:</strong> {user.id}</p>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 font-semibold text-white bg-red-600 rounded hover:bg-red-700"
                >
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default Dashboard;

