import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importuj useNavigate

import './RegisterForm.css'; 

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Nieprawidłowy format e‑mail')
    .required('E‑mail jest wymagany'),
  password: Yup.string()
    .min(6, 'Hasło musi mieć minimum 6 znaków')
    .required('Hasło jest wymagane'),
});

const RegisterForm = () => {
  const navigate = useNavigate(); 

  const handleSubmit = async (values, { setSubmitting, setStatus, resetForm }) => {
    setStatus(null); 
    try {
      const response = await axios.post('http://localhost:5001/api/auth/register', values);

      console.log('Registration successful:', response.data);
      setStatus({ success: true, message: 'Rejestracja zakończona sukcesem! Możesz się zalogować.' });
      resetForm(); 

    

    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
      setStatus({ success: false, message: error.response?.data?.message || 'Błąd rejestracji. Spróbuj ponownie.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container"> 
      <h2>Zarejestruj się</h2>
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

            <button type="submit" disabled={isSubmitting} className="submit-button">
              {isSubmitting ? 'Rejestrowanie...' : 'Zarejestruj'}
            </button>

          
            <div className="switch-form-container">
              <p>Masz już konto?</p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="switch-button"
              >
                Zaloguj się
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterForm;