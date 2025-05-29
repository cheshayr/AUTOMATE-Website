import { useEffect, useState } from 'react';
import axios from 'axios';

function Billing() {
  const [billingItems, setBillingItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/repairs/billing')
      .then(res => setBillingItems(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Billing</h2>
      <ul>
        {billingItems.map(item => (
          <li key={item._id}>{item.client} - {item.vehicle} - ${item.amountDue}</li>
        ))}
      </ul>
    </div>
  );
}

export default Billing;
