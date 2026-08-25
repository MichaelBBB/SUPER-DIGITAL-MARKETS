// Load Peach Widget Script Safely
useEffect(() => {
  if (checkoutId && activeTab === 'capitec') {
    // Prevent duplicate scripts
    if (document.getElementById('peach-widget-script')) return;

    const entityId = process.env.NEXT_PUBLIC_PEACH_ENTITY_ID;
    
    // ✅ Safety check: Don't load widget without Entity ID
    if (!entityId) {
      console.error("Peach Entity ID is missing. Check Vercel Env Vars & next.config.ts");
      return;
    }

    const script = document.createElement('script');
    script.id = 'peach-widget-script';
    script.src = `https://test.peachpayments.com/checkout/v1/widget.js?entityId=${entityId}`;
    script.async = true;
    
    script.onload = () => {
      if (window.PeachPayments) {
        window.PeachPayments.createWidget({
          checkoutId: checkoutId,
          selector: '#peach-widget-container',
          style: { primaryColor: '#0ea5e9', borderRadius: '12px' }
        });
      }
    };
    
    script.onerror = () => {
      console.error("Failed to load Peach Payments widget script");
    };
    
    document.body.appendChild(script);
    return () => { 
      const existingScript = document.getElementById('peach-widget-script');
      if (existingScript) document.body.removeChild(existingScript); 
    };
  }
}, [checkoutId, activeTab]);
