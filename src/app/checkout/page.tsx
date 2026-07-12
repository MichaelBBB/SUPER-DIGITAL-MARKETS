const handleCapitecConfirmation = async () => {
  setProcessing(true);
  try {
    const customerEmail = prompt('Please enter your email for instant delivery after approval:');
    if (!customerEmail) {
      alert('Email is required for delivery.');
      return;
    }

    const res = await fetch('/api/payment/capitec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        amount: product.price, 
        orderId: `SD-${product.id}`,
        productName: product.name,
        customerEmail: customerEmail // 🔹 Added email capture
      })
    });
    
    const data = await res.json();
    alert(data.success ? '✅ Payment recorded! Admin will verify & deliver instantly.' : `❌ Error: ${data.error}`);
  } catch (e) {
    alert('Failed to connect to server.');
  } finally {
    setProcessing(false);
  }
};
