import { useEffect, useState } from 'react';
import axios from 'axios';

function Cancelled() {
  const [cancelledRepairs, setCancelledRepairs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/repairs/cancelled')
      .then(res => setCancelledRepairs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Cancelled Repairs</h2>
      <ul>
        {cancelledRepairs.map(repair => (
          <li key={repair._id}>{repair.client} - {repair.vehicle}</li>
        ))}
      </ul>
    </div>
  );
}

export default Cancelled;
