import { z } from 'zod'

export const createRfqSchema = z.object({
  project: z.string().min(1, 'Project is required'),
  supplier: z.string().min(1, 'Supplier is required'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  lines: z
    .array(
      z.object({
        description: z.string().min(1, 'Description is required'),
        quantity: z.number().int().positive('Quantity must be positive'),
      })
    )
    .default([]),
})

export const sendRfqSchema = z.object({
  rfqId: z.number().int().positive(),
  user: z.string().optional(),
})

export const receiveResponseSchema = z.object({
  rfqId: z.string().min(1, 'rfqId is required'),
  supplier: z.string().min(1, 'Supplier is required'),
  responseDate: z.string().optional(),
  totalValue: z.number().min(0).optional().default(0),
  items: z
    .array(
      z.object({
        supplierArticle: z.string().default(''),
        brand: z.string().default(''),
        supplierDescription: z.string().default(''),
        unit: z.string().default(''),
        quantity: z.number().min(0).default(0),
        unitPrice: z.number().min(0).default(0),
        supplierRef: z.string().default(''),
        comments: z.string().default(''),
      })
    )
    .default([]),
  user: z.string().optional(),
})

export const createAwardSchema = z.object({
  projectId: z.string().min(1, 'projectId is required'),
  awardDate: z.string().optional(),
  lines: z
    .array(
      z.object({
        articuladoId: z.string().min(1),
        supplier: z.string().min(1),
        responseItemId: z.string().default(''),
        quantity: z.number().min(0).default(0),
        unitPrice: z.number().min(0).default(0),
        totalPrice: z.number().min(0).default(0),
      })
    )
    .min(1, 'At least one line is required'),
  totalValue: z.number().min(0).optional().default(0),
  status: z.enum(['Criada', 'Aprovada', 'Executada']).default('Criada'),
  user: z.string().optional(),
})

export const saveMappingsSchema = z.object({
  responseId: z.string().min(1, 'responseId is required'),
  mappings: z.record(z.string(), z.array(z.string())),
})

export const sendEmailSchema = z.object({
  to: z.string().min(1, 'Recipient is required'),
  subject: z.string().min(1, 'Subject is required'),
  text: z.string().optional().default(''),
  attachments: z
    .array(
      z.object({
        filename: z.string().optional(),
        path: z.string().optional(),
      })
    )
    .optional()
    .default([]),
})
