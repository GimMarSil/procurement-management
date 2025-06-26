CREATE TABLE IF NOT EXISTS awards (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  award_date DATE NOT NULL,
  total_value REAL NOT NULL,
  status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS award_lines (
  id TEXT PRIMARY KEY,
  award_id TEXT NOT NULL REFERENCES awards(id) ON DELETE CASCADE,
  articulado_id TEXT NOT NULL,
  supplier TEXT NOT NULL,
  response_item_id TEXT,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  total_price REAL NOT NULL,
  UNIQUE(articulado_id, supplier)
);
