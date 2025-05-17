import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const Preorders = () => {
  const [preorders, setPreorders] = useState([]);

  useEffect(() => {
    // GET /preorders na starcie komponentu
    axios.get('/preorders')
      .then(res => setPreorders(res.data))
      .catch(console.error);
  }, []); // pusty array → hook uruchomi się tylko raz po mount :contentReference[oaicite:11]{index=11}

  return (
    <div>
      <h1>Moje Preordery</h1>
     <ul>
         {preorders.map(p => (
         <li key={p._id}>
            {p.gameTitle}
            <button onClick={() =>
              axios.delete(`/preorders/${p._id}`)
                 .then(() => setPreorders(prev => prev.filter(x => x._id !== p._id)))
                 .catch(console.error)
      }>
        Usuń
      </button>
    </li>
  ))}
</ul>
    </div>
  );
};

export default Preorders;
