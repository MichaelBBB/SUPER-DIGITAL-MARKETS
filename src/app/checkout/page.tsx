  const handlePeachPayment = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/peach-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: product.price, 
          orderId: `SD-${product.id}`, 
          productName: product.name 
        })
      });

      // Handle non-200 responses
      if (!res.ok) {
        let errorMsg = 'Payment service unavailable';
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }
      
      const data = await res.json();
      
      if (!data.success || !data.checkoutUrl) {
        throw new Error('Failed to initialize secure checkout. Please try again.');
      }
      
      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      console.error('Checkout Error:', err);
      alert(`❌ Payment Error: ${err.message || 'Network connection failed. Please check your internet and try again.'}`);
    } finally {
      setProcessing(false);
    }
  };
