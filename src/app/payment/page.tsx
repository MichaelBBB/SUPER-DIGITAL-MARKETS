'use client';

import { useState } from 'react';

export default function PaymentPage() {
  const [country, setCountry] = useState('sa');

  return (
    <div style={{padding: '20px', background: 'black', color: 'white', minHeight: '100vh'}}>
      <h1>Payment Page</h1>
      
      <select 
        value={country} 
        onChange={(e) => setCountry(e.target.value)}
        style={{padding: '10px', marginBottom: '20px'}}
      >
        <option value="sa">South Africa</option>
        <option value="usa">USA</option>
        <option value="india">India</option>
        <option value="china">China</option>
      </select>

      <div style={{background: 'blue', padding: '20px', marginBottom: '20px'}}>
        <h2>Banking: CABLZAJJ</h2>
      </div>

      {country === 'usa' && (
        <div style={{background: 'green', padding: '20px'}}>
          <h3>USA APPS SHOWING!</h3>
          <p>Wise: test@email.com</p>
          <p>PayPal: test@email.com</p>
        </div>
      )}

      {country === 'india' && (
        <div style={{background: 'green', padding: '20px'}}>
          <h3>INDIA APPS SHOWING!</h3>
          <p>UPI: test@upi</p>
          <p>Wise: test@email.com</p>
        </div>
      )}

      {country === 'china' && (
        <div style={{background: 'green', padding: '20px'}}>
          <h3>CHINA APPS SHOWING!</h3>
          <p>Alipay: test@alipay</p>
          <p>WeChat: test@wechat</p>
        </div>
      )}
    </div>
  );
}
