import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

/** 1. Definiujemy schemat Yup dla walidacji pól */
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Nieprawidłowy format e‑mail')   // walidacja formatu e‑mail :contentReference[oaicite:2]{index=2}
    .required('E‑mail jest wymagany'),
  password: Yup.string()
    .min(6, 'Hasło musi mieć minimum 6 znaków') // walidacja długości :contentReference[oaicite:3]{index=3}
    .required('Hasło jest wymagane'),
});

const LoginForm = () => (
  <Formik
    initialValues={{ email: '', password: '' }}     // 2. Początkowe wartości pól :contentReference[oaicite:4]{index=4}
    validationSchema={validationSchema}              // 3. Przekazujemy schemat walidacji
    onSubmit={(values, { setSubmitting }) => {
      // tu wywołujesz axios.post('/api/auth/login', values)
      console.log('Submitting', values);
      setSubmitting(false);
    }}
    validateOnBlur                              
    validateOnChange                            // 4. Włączamy walidację w czasie rzeczywistym :contentReference[oaicite:5]{index=5}
  >
    {({ isSubmitting }) => (
      <Form>
        <div>
          <label htmlFor="email">E‑mail:</label>
          <Field type="email" name="email" id="email" />
          <ErrorMessage name="email" component="div" />
        </div>
        <div>
          <label htmlFor="password">Hasło:</label>
          <Field type="password" name="password" id="password" />
          <ErrorMessage name="password" component="div" />
        </div>
        <button type="submit" disabled={isSubmitting}>
          Zaloguj
        </button>
      </Form>
    )}
  </Formik>
);

export default LoginForm;
