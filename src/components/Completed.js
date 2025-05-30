import { useEffect, useState } from 'react';
import axios from 'axios';

function Completed() {
  const [completedRepairs, setCompletedRepairs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/repairs/completed')
      .then(res => setCompletedRepairs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Completed Repairs</h2>
      <ul>
        {completedRepairs.map(repair => (
          <li key={repair._id}>{repair.client} - {repair.vehicle}</li>
        ))}
      </ul>
    </div>
  );
}

export default Completed;
