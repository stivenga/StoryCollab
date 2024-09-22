// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard'; 
import CrearHistoria from './components/Historias/CrearHistoria';
import PerfilUsuario from './components/Historias/PerfilUsuario'; // Asegúrate de que la ruta sea correcta
import EditarHistoria from './components/Historias/EditarHistoria';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/crear-historia" element={<CrearHistoria />} />
                <Route path="/perfil-usuario" element={<PerfilUsuario />} />
                <Route path="/editar-historia/:id" element={<EditarHistoria />} />
            </Routes>
        </Router>
    );
}

// Componente para proteger rutas privadas
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

export default App;
