// frontend/src/components/Dashboard.js
import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Componente NavBar con opción de cerrar sesión y menú desplegable de géneros
const NavBar = ({ handleLogout }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Función para controlar el clic fuera del dropdown
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const genres = [
        ['Acción', 'Anime', 'Cine de intriga', 'Clásicas', 'Colombianos', 'Cortos', 'Deportes'],
        ['Documentales', 'Dramas', 'Fantasía', 'Fe y espiritualidad', 'Independientes', 'Internacionales', 'Latinoamericanas'],
        ['Música y musicales', 'Para reír', 'Para ver en familia', 'Policiacas', 'Romances', 'Sci-fi', 'Terror'],
    ];

    return (
        <nav className="bg-black p-4 text-white flex justify-between items-center relative">
            <h1 className="text-2xl font-bold">TuApp</h1>

            {/* Botón de géneros */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700"
                >
                    Géneros
                </button>

                {/* Dropdown de géneros */}
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-gray-900 text-white rounded shadow-lg z-10">
                        <div className="grid grid-cols-3 p-4">
                            {genres.map((column, index) => (
                                <div key={index} className="space-y-2">
                                    {column.map((genre, i) => (
                                        <button key={i} className="block hover:underline text-left">
                                            {genre}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div>
                <button onClick={handleLogout} className="bg-red-600 px-3 py-2 rounded">
                    Cerrar sesión
                </button>
            </div>
        </nav>
    );
};

// Componente para el carrusel de historias por categoría
const Carousel = ({ category, stories }) => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{category}</h2>
            <Slider {...settings}>
                {stories.map((story, i) => (
                    <div key={i} className="px-2">
                        <img src={story.img} alt={story.title} className="rounded-lg" />
                        <p className="text-white mt-2">{story.title}</p>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

// Componente para el banner
const Banner = ({ imageUrl }) => {
    return (
        <div className="w-full h-64 my-8">
            <img
                src={imageUrl}
                alt="Banner"
                className="w-full h-full object-cover rounded-lg shadow-md"
            />
        </div>
    );
};

const Dashboard = () => {
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Historias por categorías (simuladas, puedes reemplazar con una llamada a API)
    const categories = [
        {
            category: "Acción",
            stories: [
                { title: "Historia 1", img: "url-de-imagen-1" },
                { title: "Historia 2", img: "url-de-imagen-2" },
            ],
        },
        {
            category: "Drama",
            stories: [
                { title: "Historia 3", img: "url-de-imagen-3" },
                { title: "Historia 4", img: "url-de-imagen-4" },
            ],
        },
    ];

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
        navigate('/login'); // Redirigir al login
    };

    return (
        <div className="bg-black min-h-screen text-white">
            {/* NavBar con menú de géneros */}
            <NavBar handleLogout={handleLogout} />

            <div className="container mx-auto py-8">
                {/* Mensaje de bienvenida */}
                {user && <h1 className="text-3xl font-bold mb-6">Bienvenido, {user.name}</h1>}
                {message && <p className="text-center mb-4">{message}</p>}
                {error && <div className="p-2 text-red-700 bg-red-200 border border-red-700 rounded">{error}</div>}

                {/* Banner debajo del mensaje de bienvenida */}
                <Banner imageUrl="https://example.com/imagen-del-banner.jpg" />

                {/* Carruseles de categorías */}
                {categories.map((categoryData, index) => (
                    <div key={index} className="mb-12">
                        <Carousel category={categoryData.category} stories={categoryData.stories} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
