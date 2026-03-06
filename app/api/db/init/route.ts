import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { withErrorHandling } from '@/lib/api-handler'

const SCHEMA = `
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ArticuladoLines' AND xtype='U')
CREATE TABLE ArticuladoLines (
  id INT IDENTITY(1,1) PRIMARY KEY,
  familyProduct NVARCHAR(255) NOT NULL,
  description NVARCHAR(500) NOT NULL,
  unit NVARCHAR(50) NOT NULL,
  plannedQuantity INT NOT NULL DEFAULT 0,
  observations NVARCHAR(500),
  code NVARCHAR(255),
  projectId NVARCHAR(255) NOT NULL
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='RFQs' AND xtype='U')
CREATE TABLE RFQs (
  id INT IDENTITY(1,1) PRIMARY KEY,
  project NVARCHAR(255) NOT NULL,
  supplier NVARCHAR(255) NOT NULL,
  dueDate DATE NOT NULL,
  createdAt DATETIME DEFAULT GETDATE(),
  sentAt NVARCHAR(50)
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='RFQLines' AND xtype='U')
CREATE TABLE RFQLines (
  id INT IDENTITY(1,1) PRIMARY KEY,
  rfqId INT NOT NULL REFERENCES RFQs(id),
  description NVARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 0
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SupplierResponses' AND xtype='U')
CREATE TABLE SupplierResponses (
  id INT IDENTITY(1,1) PRIMARY KEY,
  rfqId NVARCHAR(255) NOT NULL,
  supplier NVARCHAR(255) NOT NULL,
  responseDate NVARCHAR(50) NOT NULL,
  totalValue FLOAT NOT NULL DEFAULT 0
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ResponseItems' AND xtype='U')
CREATE TABLE ResponseItems (
  id INT IDENTITY(1,1) PRIMARY KEY,
  responseId NVARCHAR(255) NOT NULL,
  supplierArticle NVARCHAR(255),
  brand NVARCHAR(255),
  description NVARCHAR(500),
  unit NVARCHAR(50),
  quantity FLOAT NOT NULL DEFAULT 0,
  unitPrice FLOAT NOT NULL DEFAULT 0,
  supplierRef NVARCHAR(255),
  comments NVARCHAR(500)
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ResponseMappings' AND xtype='U')
CREATE TABLE ResponseMappings (
  id INT IDENTITY(1,1) PRIMARY KEY,
  responseId NVARCHAR(255) NOT NULL,
  itemId NVARCHAR(255) NOT NULL,
  articuladoId NVARCHAR(255) NOT NULL
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Awards' AND xtype='U')
CREATE TABLE Awards (
  id INT IDENTITY(1,1) PRIMARY KEY,
  projectId NVARCHAR(255) NOT NULL,
  awardDate NVARCHAR(50) NOT NULL,
  totalValue FLOAT NOT NULL DEFAULT 0,
  status NVARCHAR(50) NOT NULL DEFAULT 'Criada'
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AwardLines' AND xtype='U')
CREATE TABLE AwardLines (
  id INT IDENTITY(1,1) PRIMARY KEY,
  awardId NVARCHAR(255) NOT NULL,
  articuladoId NVARCHAR(255) NOT NULL,
  supplier NVARCHAR(255) NOT NULL,
  responseItemId NVARCHAR(255),
  quantity FLOAT NOT NULL DEFAULT 0,
  unitPrice FLOAT NOT NULL DEFAULT 0,
  totalPrice FLOAT NOT NULL DEFAULT 0
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Logs' AND xtype='U')
CREATE TABLE Logs (
  id INT IDENTITY(1,1) PRIMARY KEY,
  timestamp NVARCHAR(50) NOT NULL,
  [user] NVARCHAR(255) NOT NULL,
  action NVARCHAR(255) NOT NULL,
  details NVARCHAR(MAX) NOT NULL
);
`

export const POST = withErrorHandling(async () => {
  const db = await getDb()
  const statements = SCHEMA.split(';').map((s) => s.trim()).filter(Boolean)

  for (const stmt of statements) {
    await db.request().query(stmt)
  }

  return NextResponse.json({ success: true, tables: 9 })
})
