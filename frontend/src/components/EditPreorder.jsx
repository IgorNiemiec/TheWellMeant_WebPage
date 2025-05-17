import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import PreorderForm from './PreorderForm';

const EditPreorder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);

  useEffect(() => {
    axios.get(`/preorders/${id}`)
      .then(res => setInitial({
        gameTitle: res.data.gameTitle,
        quantity: res.data.quantity
      }))
      .catch(err => console.error(err));
  }, [id]);

  if (!initial) return <div>Ładowanie…</div>;

  const onSubmit = (values) =>
    axios.put(`/preorders/${id}`, values)
      .then(() => navigate('/preorders'))
      .catch(console.error);

  return <PreorderForm initialValues={initial} onSubmit={onSubmit} />;
};

export default EditPreorder;
