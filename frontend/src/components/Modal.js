import React from 'react';
import './Modal.css';


const Modal = ({ showModal, stories, onClose }) => {
    if (!showModal) return null; // Si no se activa, no muestra nada

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="close-button">X</button>
                <h2 className="modal-title">Historias Disponibles</h2>
                <ul className="story-list">
                    {stories.map((story, i) => (
                        <li key={i} className="story-item">
                            <h3>{story.title}</h3>
                            <p>{story.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Modal;
