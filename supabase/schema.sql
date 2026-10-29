CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,
  product_name TEXT NOT NULL,
  amount_usd NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  gateway TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_session_id ON payments(session_id);
