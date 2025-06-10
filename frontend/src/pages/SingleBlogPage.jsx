// src/pages/SingleBlogPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SingleBlogPage.css'; // Stwórz ten plik CSS

const SingleBlogPage = () => {
    const { id } = useParams(); // Pobierz ID bloga z URL
    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Ustawienie base URL dla Axios (upewnij się, że jest poprawne)
    axios.defaults.baseURL = 'http://localhost:5001'; // Twój port backendu

    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`/api/blogs/${id}`);
                setBlog(response.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                if (err.response && err.response.status === 404) {
                    setError('Blog nie znaleziony.');
                } else {
                    setError('Wystąpił błąd podczas ładowania bloga.');
                    console.error('Błąd podczas pobierania bloga:', err);
                }
            }
        };

        if (id) {
            fetchBlog();
        }
    }, [id]); // Wywołaj efekt, gdy ID bloga się zmieni

    if (loading) {
        return <div className="loading-spinner"></div>; // Styl ładowania
    }

    if (error) {
        return <div className="single-blog-error-message">{error}</div>;
    }

    if (!blog) {
        return <div className="single-blog-not-found">Blog nie dostępny.</div>;
    }

    // Funkcja pomocnicza do formatowania daty
    const formatDateTime = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('pl-PL', options);
    };

    return (
        <div className="single-blog-container">
            <h1 className="blog-title">{blog.title}</h1>
            <p className="blog-meta">
                Autor: <span className="blog-author">{blog.authorName}</span> | Data publikacji: <span className="blog-date">{formatDateTime(blog.createdAt)}</span>
            </p>

            {blog.mainImageUrl ? (
                <div className="blog-main-image-wrapper">
                    <img
                        src={`${axios.defaults.baseURL}${blog.mainImageUrl}`}
                        alt={blog.title}
                        className="blog-main-image"
                    />
                </div>
            ) : (
                <div className="blog-main-image-wrapper placeholder-image-wrapper">
                    <img
                        src="/images/placeholder.png" // Upewnij się, że masz ten obrazek w katalogu public/images
                        alt="Brak obrazka głównego"
                        className="blog-main-image placeholder-image"
                    />
                </div>
            )}

            <div className="blog-chapters-section">
                {blog.chapters.map((chapter, index) => (
                    <div key={index} className="blog-chapter">
                        <h2 className="chapter-title">{chapter.title}</h2>
                        <p className="chapter-content">{chapter.content}</p>
                    </div>
                ))}
            </div>

            <button onClick={() => navigate('/blogs')} className="back-to-blogs-button">
                Powrót do listy blogów
            </button>
        </div>
    );
};

export default SingleBlogPage;