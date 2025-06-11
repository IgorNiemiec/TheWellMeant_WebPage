import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // <-- DODAJ TEN IMPORT

import './LoginForm.css';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Nieprawidłowy format e‑mail')
    .required('E‑mail jest wymagany'),
  password: Yup.string()
    .min(6, 'Hasło musi mieć minimum 6 znaków')
    .required('Hasło jest wymagane'),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setStatus(null); 
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', values);

      console.log('Login successful:', response.data);
      if (response.data.token) {
        login(response.data.token);
        setStatus({ success: true, message: 'Logowanie pomyślne!' }); 

      
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000); 
      } else {
          setStatus({ success: false, message: 'Logowanie nie powiodło się: brak tokenu w odpowiedzi serwera.' });
      }

    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);

      let errorMessage = 'Błąd logowania. Spróbuj ponownie.'; 

      if (error.response && error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.description) {
          errorMessage = error.response.data.description;
        }
        else if (error.response.data.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
            errorMessage = error.response.data.errors.map(err => err.msg).join(', ');
        }
      }
      setStatus({ success: false, message: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <h2>Zaloguj się</h2>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnBlur
          validateOnChange
        >
          {({ isSubmitting, status }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="email">E‑mail:</label>
                <Field type="email" name="email" id="email" />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="password">Hasło:</label>
                <Field type="password" name="password" id="password" />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>

              {status && status.message && (
                <div className={`server-message ${status.success ? 'success' : 'error'}`}>
                  {status.message}
                </div>
              )}

              <button type="submit" disabled={isSubmitting} className="submit-button auth-button">
                {isSubmitting ? 'Logowanie...' : 'Zaloguj'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="back-to-home-button auth-button"
                style={{ marginTop: '15px' }}
              >
                Powrót do strony głównej
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginForm;