// src/pages/ManageBlogsPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ManageBlogsPage.css';

const ManageBlogsPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [serverMessage, setServerMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

  
    axios.defaults.baseURL = 'http://localhost:5001';

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setServerMessage({ type: 'error', text: 'Brak autoryzacji. Zaloguj się ponownie.' });
                setLoading(false);
                return;
            }
            const response = await axios.get('/api/blogs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBlogs(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Błąd podczas pobierania blogów:', error.response?.data?.message || error.message);
            setServerMessage({ type: 'error', text: error.response?.data?.message || 'Nie udało się pobrać blogów.' });
        }
    };

    const handleDelete = async (blogId) => {
        if (window.confirm('Czy na pewno chcesz usunąć ten wpis na blogu?')) {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/blogs/${blogId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setServerMessage({ type: 'success', text: 'Blog został usunięty!' });
                fetchBlogs(); // Odśwież listę blogów po usunięciu
            } catch (error) {
                setLoading(false);
                console.error('Błąd podczas usuwania bloga:', error.response?.data?.message || error.message);
                setServerMessage({ type: 'error', text: error.response?.data?.message || 'Nie udało się usunąć bloga.' });
            }
        }
    };

    if (loading) {
        return <div className="loading-spinner"></div>;
    }

    return (
        // NOWY WRAPPER DLA CENTROWANIA CAŁEJ STRONY
        <div className="manage-blogs-page-wrapper">
            <div className="manage-blogs-container">
                <h2>Zarządzaj swoimi blogami</h2>

                {serverMessage.text && (
                    <p className={`server-message ${serverMessage.type}`}>{serverMessage.text}</p>
                )}

                <div className="blogs-actions">
                    <button
                        onClick={() => navigate('/add-blog')}
                        className="add-new-blog-button"
                    >
                        Dodaj Nowy Blog
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="back-to-dashboard-button"
                    >
                        Powrót do panelu
                    </button>
                </div>

                {blogs.length === 0 ? (
                    <p className="no-blogs-message">Nie masz jeszcze żadnych blogów. Dodaj pierwszy!</p>
                ) : (
                    <div className="blog-list">
                        {blogs.map((blog) => (
                            <div key={blog._id} className="blog-item">
                                {blog.mainImageUrl && (
                                    <div className="blog-item-image-wrapper">
                                        <img src={`${axios.defaults.baseURL}${blog.mainImageUrl}`} alt={blog.title} className="blog-item-image" />
                                    </div>
                                )}
                                <h3>{blog.title}</h3>
                                <p>Rozdziałów: {blog.chapters.length}</p>

                                <div className="blog-item-actions">
                                    <button
                                        onClick={() => navigate(`/edit-blog/${blog._id}`)}
                                        className="edit-blog-button"
                                    >
                                        Edytuj
                                    </button>
                                    <button
                                        onClick={() => handleDelete(blog._id)}
                                        className="delete-blog-button"
                                    >
                                        Usuń
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageBlogsPage;