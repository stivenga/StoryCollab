import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Modal from './Modal'; 
import './Dashboard.css';
import { Link } from 'react-router-dom';

const NavBar = ({ handleLogout, onSearch, onGenreClick }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);
    const navigate = useNavigate(); // Hook para la navegación

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

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        onSearch(event.target.value);
    };

    // Función para navegar a la página de creación de historias
    const handleCreateStory = () => {
        navigate('/crear-historia'); // Redirige a la página de creación de historia
    };

    return (
        <nav className="bg-black p-4 text-white flex justify-between items-center relative">
            <h1 className="text-2xl font-bold">TuApp</h1>

            <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Buscar historias..."
                className="px-4 py-2 rounded bg-gray-800 text-white focus:outline-none"
            />

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
                                        <button
                                            key={i}
                                            className="block hover:underline text-left"
                                            onClick={() => {
                                                onGenreClick(genre); // Filtrar historias por género
                                                setIsDropdownOpen(false); // Cerrar el dropdown
                                            }}
                                        >
                                            {genre}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex space-x-4">
                
                <button 
                    onClick={handleCreateStory} 
                    className="bg-green-600 px-3 py-2 rounded hover:bg-green-500"
                >
                    Crear historia
                </button>
                <button 
                    onClick={handleLogout} 
                    className="bg-red-600 px-3 py-2 rounded hover:bg-red-500"
                >
                    Cerrar sesión
                </button>
                <Link to="/historias" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                  Ver todas las historias
               </Link>
            </div>
        </nav>
    );
};

// Componente para el carrusel de historias por categoría
const Carousel = ({ category, stories, onStoryClick }) => {
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5, 
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
                    <div key={i} className="px-2" onClick={() => onStoryClick(story)}>
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
    const [stories, setStories] = useState([]);
    const [filteredStories, setFilteredStories] = useState([]); 
    const [modalStory, setModalStory] = useState(null); 
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
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    }
                };
                const response = await axiosInstance.get('/api/stories', config);
                console.log('Respuesta de la API:', response.data);
        
                if (response.data && Array.isArray(response.data)) {
                    setStories(response.data);
                    setFilteredStories(response.data); 
                } else {
                    setStories([]);
                    setFilteredStories([]);
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

    // Agrupar historias por categorías
    const groupStoriesByCategory = (stories) => {
        const categories = {};

        stories.forEach((story) => {
            const category = story.genre || 'Otros';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(story);
        });

        return Object.entries(categories);
    };

    // Filtrar historias por título, descripción, género o tipo
    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setFilteredStories(stories); 
        } else {
            const filtered = stories.filter((story) => {
                const title = story.title ? story.title.toLowerCase() : '';
                const description = story.description ? story.description.toLowerCase() : '';
                const genre = story.genre ? story.genre.toLowerCase() : '';  
                const type = story.type ? story.type.toLowerCase() : '';      
                return (
                    title.includes(searchTerm.toLowerCase()) ||
                    description.includes(searchTerm.toLowerCase()) ||
                    genre.includes(searchTerm.toLowerCase()) ||
                    type.includes(searchTerm.toLowerCase())
                );
            });
            setFilteredStories(filtered);
        }
    };

    // Filtrar historias por género
    const handleGenreClick = (genre) => {
        const filtered = stories.filter((story) => {
            return story.genre && story.genre.toLowerCase() === genre.toLowerCase();
        });
        setFilteredStories(filtered);
    };

    const handleStoryClick = (story) => {
        setModalStory(story);
    };

    return (
        <div className="bg-black min-h-screen text-white">
            <NavBar handleLogout={handleLogout} onSearch={handleSearch} onGenreClick={handleGenreClick} />

            {error && <p>{error}</p>}

            <div className="px-4 py-8">
                <h1 className="text-4xl font-bold mb-8">Bienvenido, {user?.name}</h1>

                <Banner imageUrl="https://via.placeholder.com/1200x400" />

                {groupStoriesByCategory(filteredStories).map(([category, stories]) => (
                    <Carousel key={category} category={category} stories={stories} onStoryClick={handleStoryClick} />
                ))}
            </div>

            {modalStory && (
                <Modal story={modalStory} onClose={() => setModalStory(null)} />
            )}
        </div>
    );
};

export default Dashboard;
