// src/components/Preorder/ManagePreorder.jsx

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './ManagePreorder.css';

/**
 * Schemat walidacji dla formularza preorderu.
 */
const preorderValidationSchema = Yup.object({
  edition: Yup.string()
    .oneOf(['Standard Edition', 'Deluxe Edition'], 'Wybierz prawidłową edycję')
    .required('Edycja jest wymagana'),
  paymentMethod: Yup.string()
    .oneOf(['Credit Card', 'PayPal', 'Bank Transfer'], 'Wybierz prawidłową formę płatności')
    .required('Forma płatności jest wymagana'),
});

const ManagePreorder = () => {
  const [currentPreorder, setCurrentPreorder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverMessage, setServerMessage] = useState(null);

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    const fetchPreorder = async () => {
      try {
        setLoading(true);
        setServerMessage(null);
        const token = getToken();
        if (!token) {
          console.error('Brak tokena autoryzacji. Proszę się zalogować.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5001/api/preorders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.data && response.data.length > 0) {
          setCurrentPreorder(response.data[0]);
        } else {
          setCurrentPreorder(null);
        }
      } catch (error) {
        console.error('Błąd podczas pobierania preorderu:', error.response?.data || error.message);
        setServerMessage({ success: false, message: 'Nie udało się pobrać danych preorderu.' });
      } finally {
        setLoading(false);
      }
    };

    fetchPreorder();
  }, []);

  const handlePreorderSubmit = async (values, { setSubmitting, resetForm }) => {
    setServerMessage(null);
    const token = getToken();
    if (!token) {
      setServerMessage({ success: false, message: 'Brak autoryzacji. Zaloguj się ponownie.' });
      setSubmitting(false);
      return;
    }

    try {
      let response;
      if (currentPreorder) {
        const { edition, paymentMethod } = values; 
        response = await axios.put(`http://localhost:5001/api/preorders/${currentPreorder._id}`, { edition, paymentMethod }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setServerMessage({ success: true, message: 'Preorder został zaktualizowany!' });
      } else {
        response = await axios.post('http://localhost:5001/api/preorders', values, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setServerMessage({ success: true, message: 'Preorder został pomyślnie złożony!' });
        resetForm();
      }
      setCurrentPreorder(response.data);
    } catch (error) {
      console.error('Błąd operacji na preorderze:', error.response?.data || error.message);
      setServerMessage({ success: false, message: error.response?.data?.message || 'Wystąpił błąd podczas operacji.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePreorder = async () => {
    if (!window.confirm('Czy na pewno chcesz usunąć swój preorder?')) {
      return;
    }

    setServerMessage(null);
    const token = getToken();
    if (!token) {
      setServerMessage({ success: false, message: 'Brak autoryzacji. Zaloguj się ponownie.' });
      return;
    }

    try {
      await axios.delete(`http://localhost:5001/api/preorders/${currentPreorder._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setServerMessage({ success: true, message: 'Preorder został usunięty!' });
      setCurrentPreorder(null);
    } catch (error) {
      console.error('Błąd podczas usuwania preorderu:', error.response?.data || error.message);
      setServerMessage({ success: false, message: error.response?.data?.message || 'Nie udało się usunąć preorderu.' });
    }
  };

  if (loading) {
    return (
      <div className="preorder-container">
        <h2>Ładowanie preorderu...</h2>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="preorder-container">
      <h2>{currentPreorder ? 'Zarządzaj swoim preorderem' : 'Złóż nowy preorder'}</h2>

      {serverMessage && serverMessage.message && (
        <div className={`server-message ${serverMessage.success ? 'success' : 'error'}`}>
          {serverMessage.message}
        </div>
      )}

      <Formik
        initialValues={currentPreorder ? {
          edition: currentPreorder.edition,
          paymentMethod: currentPreorder.paymentMethod,
          status: currentPreorder.status
        } : {
          edition: 'Standard Edition',
          paymentMethod: 'Credit Card',
          status: 'pending'
        }}
        validationSchema={preorderValidationSchema}
        onSubmit={handlePreorderSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting, status, values }) => (
          <Form>
       
            <div className="form-group">
              <label htmlFor="edition">Wybierz Edycję:</label>
              <Field as="select" name="edition" id="edition">
                <option value="Standard Edition">Edycja Standardowa</option>
                <option value="Deluxe Edition">Edycja Deluxe</option>
              </Field>
              <ErrorMessage name="edition" component="div" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="paymentMethod">Forma płatności:</label>
              <Field as="select" name="paymentMethod" id="paymentMethod">
                <option value="Credit Card">Karta Kredytowa</option>
                <option value="PayPal">PayPal</option>
                <option value="Bank Transfer">Przelew Bankowy</option>
              </Field>
              <ErrorMessage name="paymentMethod" component="div" className="error-message" />
            </div>

            {currentPreorder && ( 
              <div className="preorder-details-summary"> 
                <h3>Aktualne dane preorderu:</h3>
                <div className="detail-item">
                  <span className="detail-label">Edycja:</span>
                  <span className="detail-value">{values.edition}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Forma płatności:</span>
                  <span className="detail-value">{values.paymentMethod}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span className={`detail-value status-${values.status}`}>
                    {values.status.charAt(0).toUpperCase() + values.status.slice(1)}
                  </span>
                </div>
              </div>
            )}
            
            <div className="form-actions">
              <button type="submit" disabled={isSubmitting} className="submit-button">
                {isSubmitting ? 'Zapisywanie...' : currentPreorder ? 'Zapisz zmiany' : 'Złóż Preorder'}
              </button>

              {currentPreorder && (
                <button
                  type="button"
                  onClick={handleDeletePreorder}
                  disabled={isSubmitting}
                  className="delete-button"
                >
                  Usuń Preorder
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ManagePreorder;