// src/pages/BlogListPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BlogListPage.css'; // Stwórz ten plik CSS

const BlogListPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [serverMessage, setServerMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    axios.defaults.baseURL = 'http://localhost:5001'; 

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/blogs/public');
                setBlogs(response.data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error('Błąd podczas pobierania blogów:', error.response?.data?.message || error.message);
                setServerMessage({ type: 'error', text: error.response?.data?.message || 'Nie udało się pobrać blogów.' });
            }
        };

        fetchBlogs();
    }, []);

    const handleBlogClick = (blogId) => {
        navigate(`/blog/${blogId}`); 
    };

    if (loading) {
        return <div className="loading-spinner"></div>; 
    }

    return (
        <div className="blog-list-page-container">
            {/* Zaktualizowany tytuł z nową klasą CSS */}
            <h2 className="page-title">Wszystkie Blogi</h2>

            {serverMessage.text && (
                <p className={`server-message ${serverMessage.type}`}>{serverMessage.text}</p>
            )}

            {/* Kontener dla przycisków akcji */}
            <div className="blog-actions">
                <button
                    onClick={() => navigate('/')}
                    className="back-to-home-button"
                >
                    Powrót do strony głównej
                </button>
            </div>


            {blogs.length === 0 ? (
                <p className="no-blogs-message">Brak dostępnych blogów.</p>
            ) : (
                <div className="blog-cards-grid">
                    {blogs.map((blog) => (
                        <div key={blog._id} className="blog-card" onClick={() => handleBlogClick(blog._id)}>
                            {blog.mainImageUrl && (
                                <div className="blog-card-image-wrapper">
                                    <img
                                        src={`${axios.defaults.baseURL}${blog.mainImageUrl}`}
                                        alt={blog.title}
                                        className="blog-card-image"
                                    />
                                </div>
                            )}
                            <div className="blog-card-content">
                                <h3>{blog.title}</h3>
                          
                                <button className="read-more-button">Czytaj więcej</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlogListPage;