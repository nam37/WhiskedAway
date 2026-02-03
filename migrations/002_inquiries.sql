CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  message TEXT,
  source_url TEXT,
  status VARCHAR(50) DEFAULT 'New',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inquiry_items (
  id UUID PRIMARY KEY,
  inquiry_id UUID REFERENCES inquiries(id) ON DELETE CASCADE,
  sku VARCHAR(100) NOT NULL,
  qty INTEGER NOT NULL,
  name_snapshot VARCHAR(255),
  price_snapshot VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_inquiry_items_inquiry ON inquiry_items (inquiry_id);
