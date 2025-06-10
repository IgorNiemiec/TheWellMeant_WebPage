// src/App.js (lub główny plik routingu)

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import PreorderForm from './components/PreorderForm';
import ManagePreordersPage from './components/Preorder/ManagePreorder';
import ManageBlogsPage from './pages/ManageBlogsPage';
import BlogForm from './components/BlogForm/BlogForm';
import BlogListPage from './pages/BlogListPage'; 
import PrivateRoute from './components/PrivateRoute';
import SingleBlogPage from './pages/SingleBlogPage';
import Preorders from './pages/Preorders'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Trasa dla publicznej listy blogów */}
                <Route path="/blogs" element={<BlogListPage />} />
                <Route path="/blog/:id" element={<SingleBlogPage />} />


                {/* Trasy chronione dla zalogowanych użytkowników */}
                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/preorders" element={ <Preorders/>}/>
                    <Route path="/preorder-form" element={<PreorderForm />} />
                    <Route path="/manage-preorders" element={<ManagePreordersPage />} />
                    <Route path="/manage-blogs" element={<ManageBlogsPage />} />
                    <Route path="/add-blog" element={<BlogForm />} />
                    <Route path="/edit-blog/:id" element={<BlogForm />} />
                </Route>

                {/* Obsługa nieznanych tras (404) */}
                <Route path="*" element={<h1>404 - Strona nie znaleziona</h1>} />
            </Routes>
        </Router>
    );
}

export default App;