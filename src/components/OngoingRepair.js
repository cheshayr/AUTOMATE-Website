import { useEffect, useState } from 'react';
import axios from 'axios';

function OngoingRepair() {
  const [repairs, setRepairs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/repairs/Ongoing')
      .then(res => setRepairs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Ongoing Repairs</h2>
      <ul>
        {repairs.map(repair => (
          <li key={repair._id}>{repair.customerName} - {repair.vehicle}</li>
        ))}
      </ul>
    </div>
  );
}