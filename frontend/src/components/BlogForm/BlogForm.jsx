// src/components/Blog/BlogForm.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BlogForm.css'; // Upewnij się, że masz ten plik CSS

const BlogForm = () => {
    const { id } = useParams(); // ID bloga, jeśli edytujemy (dla istniejącego bloga)
    const navigate = useNavigate();

    const [blogTitle, setBlogTitle] = useState('');
    const [chapters, setChapters] = useState([{ title: '', content: '' }]);
    const [mainImageFile, setMainImageFile] = useState(null); // Przechowuje faktyczny plik obrazka
    const [mainImagePreviewUrl, setMainImagePreviewUrl] = useState(''); // Przechowuje URL do podglądu lub istniejącego obrazka
    const [loading, setLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ type: '', text: '' });

    // Ustawienie base URL dla Axios
    axios.defaults.baseURL = 'http://localhost:5001'; // Ustaw swój adres backendu

    useEffect(() => {
        if (id) {
            // Edycja istniejącego bloga - pobierz dane
            const fetchBlog = async () => {
                setLoading(true);
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`/api/blogs/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const blog = response.data;
                    setBlogTitle(blog.title);
                    setChapters(blog.chapters);
                    setMainImagePreviewUrl(blog.mainImageUrl || ''); // Ustaw URL istniejącego obrazka
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    console.error('Błąd podczas pobierania bloga:', error);
                    setServerMessage({ type: 'error', text: 'Nie udało się załadować bloga.' });
                }
            };
            fetchBlog();
        }
    }, [id]);

    // Obsługa zmiany tytułu bloga
    const handleBlogTitleChange = (e) => {
        setBlogTitle(e.target.value);
    };

    // Obsługa zmiany tytułu rozdziału
    const handleChapterTitleChange = (index, e) => {
        const newChapters = [...chapters];
        newChapters[index].title = e.target.value;
        setChapters(newChapters);
    };

    // Obsługa zmiany treści rozdziału
    const handleChapterContentChange = (index, e) => {
        const newChapters = [...chapters];
        newChapters[index].content = e.target.value;
        setChapters(newChapters);
    };

    // Dodanie nowego rozdziału
    const addChapter = () => {
        setChapters([...chapters, { title: '', content: '' }]);
    };

    // Usunięcie rozdziału
    const removeChapter = (index) => {
        const newChapters = chapters.filter((_, i) => i !== index);
        setChapters(newChapters);
    };

    // Obsługa wyboru głównego obrazka (input type="file")
    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImageFile(file); // Zapisz plik
            setMainImagePreviewUrl(URL.createObjectURL(file)); // Utwórz tymczasowy URL do podglądu
        } else {
            setMainImageFile(null);
            setMainImagePreviewUrl('');
        }
    };

    // Funkcja do uploadu obrazka na serwer
    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('image', file); // 'image' musi odpowiadać nazwie pola w Multerze ('upload.single('image'))

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/upload-blog-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Nagłówek wymagany przez upload plików
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.imageUrl; // Zwróć URL obrazka z serwera
        } catch (error) {
            console.error('Błąd podczas uploadu obrazka:', error.response?.data?.message || error.message);
            setServerMessage({ type: 'error', text: error.response?.data?.message || 'Błąd podczas uploadu obrazka.' });
            return null;
        }
    };

    // Obsługa submitu formularza
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setServerMessage({ type: '', text: '' }); // Wyczyść poprzednie wiadomości

        let finalMainImageUrl = mainImagePreviewUrl; // Zakładamy, że to jest aktualny URL lub pusty

        // Jeśli użytkownik wybrał NOWY plik obrazka (`mainImageFile` nie jest nullem),
        // to najpierw go załaduj na serwer
        if (mainImageFile) {
            const uploadedUrl = await uploadImage(mainImageFile);
            if (uploadedUrl) {
                finalMainImageUrl = uploadedUrl;
            } else {
                // Jeśli upload się nie powiódł, zatrzymaj submit
                setLoading(false);
                return;
            }
        } else if (mainImageFile === null && id && mainImagePreviewUrl.startsWith('blob:')) {
            // Jeśli użytkownik usunął obrazek, ale był to tylko podgląd nowego,
            // to ustaw URL na pusty. Jeśli usunął istniejący, to `mainImagePreviewUrl`
            // będzie już pusty z `setMainImagePreviewUrl('')` w `handleMainImageChange`
            finalMainImageUrl = '';
        }


        try {
            const token = localStorage.getItem('token');
            const blogData = {
                title: blogTitle,
                chapters: chapters,
                mainImageUrl: finalMainImageUrl // Dodaj ostateczny URL głównego obrazka do danych bloga
            };

            let response;
            if (id) {
                // Edycja istniejącego bloga
                response = await axios.put(`/api/blogs/${id}`, blogData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setServerMessage({ type: 'success', text: 'Blog został zaktualizowany!' });
            } else {
                // Tworzenie nowego bloga
                response = await axios.post('/api/blogs', blogData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setServerMessage({ type: 'success', text: 'Blog został dodany!' });
                // Po dodaniu nowego bloga, wyczyść formularz
                setBlogTitle('');
                setChapters([{ title: '', content: '' }]);
                setMainImageFile(null);
                setMainImagePreviewUrl('');
            }
            // Po sukcesie, przekieruj po krótkiej chwili
            setTimeout(() => {
                navigate('/manage-blogs');
            }, 2000);
        } catch (error) {
            console.error('Błąd podczas zapisywania bloga:', error.response?.data?.message || error.message);
            setServerMessage({ type: 'error', text: error.response?.data?.message || 'Nie udało się zapisać bloga.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="blog-form-container">
            <h2>{id ? 'Edytuj wpis na blogu' : 'Dodaj nowy wpis na blogu'}</h2>

            {serverMessage.text && (
                <p className={`server-message ${serverMessage.type}`}>{serverMessage.text}</p>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="blogTitle">Tytuł Bloga:</label>
                    <input
                        type="text"
                        id="blogTitle"
                        value={blogTitle}
                        onChange={handleBlogTitleChange}
                        placeholder="Wprowadź tytuł bloga"
                        required
                    />
                </div>

                {/* Sekcja uploadu głównego obrazka */}
                <div className="form-group">
                    <label htmlFor="mainImage">Główny obrazek (miniatura/nagłówkowy):</label>
                    <input
                        type="file"
                        id="mainImage"
                        accept="image/*" /* Akceptuj tylko pliki graficzne */
                        onChange={handleMainImageChange}
                    />
                    {(mainImagePreviewUrl || mainImageFile) && ( // Pokaż podgląd, jeśli jest URL lub plik
                        <div className="image-preview">
                            {mainImagePreviewUrl && <img src={mainImagePreviewUrl} alt="Podgląd głównego obrazka" />}
                            <button
                                type="button"
                                onClick={() => {
                                    setMainImageFile(null); // Usuń wybrany plik
                                    setMainImagePreviewUrl(''); // Wyczyść podgląd i URL
                                    // Tutaj możesz dodać logikę do usunięcia obrazka z serwera, jeśli był to istniejący obrazek
                                    // i chcesz, aby był usunięty również z serwera, a nie tylko odlinkowany.
                                    // To wymagałoby dodatkowego API do usuwania obrazków.
                                }}
                            >
                                Usuń obrazek
                            </button>
                        </div>
                    )}
                </div>

                <div className="chapters-container">
                    <h3>Rozdziały:</h3>
                    {chapters.map((chapter, index) => (
                        <div key={index} className="chapter-item">
                            <div className="form-group">
                                <label htmlFor={`chapterTitle-${index}`}>Tytuł Rozdziału {index + 1}:</label>
                                <input
                                    type="text"
                                    id={`chapterTitle-${index}`}
                                    value={chapter.title}
                                    onChange={(e) => handleChapterTitleChange(index, e)}
                                    placeholder={`Wprowadź tytuł rozdziału ${index + 1}`}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor={`chapterContent-${index}`}>Treść Rozdziału {index + 1}:</label>
                                <textarea
                                    id={`chapterContent-${index}`}
                                    value={chapter.content}
                                    onChange={(e) => handleChapterContentChange(index, e)}
                                    placeholder={`Wprowadź treść rozdziału ${index + 1}`}
                                    rows="10"
                                    required
                                ></textarea>
                            </div>

                            {chapters.length > 1 && (
                                <button type="button" onClick={() => removeChapter(index)} className="remove-chapter-button">
                                    Usuń Rozdział
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addChapter} className="add-chapter-button">
                        Dodaj Rozdział
                    </button>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Zapisywanie...' : (id ? 'Zapisz zmiany' : 'Dodaj Blog')}
                    </button>
                    <button type="button" onClick={() => navigate('/manage-blogs')} className="back-button" disabled={loading}>
                        Anuluj
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BlogForm;