import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Componente NavBar
const NavBar = ({ handleLogout }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700"
                >
                    Géneros
                </button>
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
        infinite: false,
        speed: 500,
        slidesToShow: 5, // Mostramos 5 slides al mismo tiempo
        slidesToScroll: 5,
        arrows: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className="carousel-container mb-8">
            <h2 className="text-2xl font-bold mb-4">{category}</h2>
            <Slider {...settings}>
                {stories.map((story, i) => (
                    <div key={i} className="px-2">
                        <div className="story-card hover-card">
                            <img
                                src={story.image}
                                alt={story.title}
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="story-info">
                                <h3 className="story-title">{story.title}</h3>
                                <p className="story-description">{story.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

// Componente Banner
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
    const [stories, setStories] = useState([]); // Cambiado de categories a stories, ya que las historias pueden no estar agrupadas inicialmente
    const navigate = useNavigate();

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

        const fetchStories = async () => {
            try {
                const token = localStorage.getItem('token'); // Obtener el token
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    }
                };
                const response = await axiosInstance.get('/api/stories', config); 
                console.log('Respuesta de la API:', response.data);
        
                if (response.data && Array.isArray(response.data)) {
                    setStories(response.data); // Guardar las historias
                } else {
                    setStories([]); // En caso de que la respuesta no sea válida
                }
            } catch (err) {
                console.error('Error al obtener historias:', err);
            }
        };

        fetchProtectedData();
        fetchStories(); 
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Función para agrupar las historias por categorías
    const groupStoriesByCategory = (stories) => {
        const categories = {};

        stories.forEach((story) => {
            const category = story.genre || 'Otros'; // Asegúrate de que cada historia tenga un campo de género
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(story);
        });

        return Object.entries(categories); // Devuelve un arreglo de pares [categoría, historias]
    };

    return (
        <div className="bg-black min-h-screen text-white">
            <NavBar handleLogout={handleLogout} />

            <div className="container mx-auto py-8">
                {user && <h1 className="text-3xl font-bold mb-6">Bienvenido, {user.name}</h1>}
                {message && <p className="text-center mb-4">{message}</p>}
                {error && <div className="p-2 text-red-700 bg-red-200 border border-red-700 rounded">{error}</div>}

                <Banner imageUrl="https://example.com/imagen-del-banner.jpg" />

                {/* Agrupar historias por categorías antes de mostrarlas */}
                {stories.length > 0 ? (
                    groupStoriesByCategory(stories).map(([category, stories], index) => (
                        <div key={index} className="mb-12">
                            <Carousel category={category} stories={stories} />
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400">No hay historias disponibles.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
