import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const preorderSchema = Yup.object({
  gameTitle: Yup.string()
    .required('Tytuł gry jest wymagany'),           // prosty check notEmpty :contentReference[oaicite:9]{index=9}
  quantity: Yup.number()
    .integer('Musi być liczbą całkowitą')
    .min(1, 'Minimalna ilość to 1')
    .required('Ilość jest wymagana'),               // walidacja liczby :contentReference[oaicite:10]{index=10}
});

const PreorderForm = ({ onSubmit }) => (
  <Formik
    initialValues={{ gameTitle: '', quantity: 1 }}
    validationSchema={preorderSchema}
    onSubmit={(values, actions) => {
      onSubmit(values);
      actions.setSubmitting(false);
    }}
    validateOnBlur
    validateOnChange
  >
    {({ isSubmitting }) => (
      <Form>
        <div>
          <label htmlFor="gameTitle">Tytuł gry:</label>
          <Field name="gameTitle" id="gameTitle" />
          <ErrorMessage name="gameTitle" component="div" />
        </div>
        <div>
          <label htmlFor="quantity">Ilość:</label>
          <Field type="number" name="quantity" id="quantity" />
          <ErrorMessage name="quantity" component="div" />
        </div>
        <button type="submit" disabled={isSubmitting}>Złóż preorder</button>
      </Form>
    )}
  </Formik>
);

export default PreorderForm;
