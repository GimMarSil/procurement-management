// Tipos para o sistema de procurement
export interface ArticuladoLine {
  id: string
  familyProduct: string
  description: string
  unit: string
  plannedQuantity: number
  observations?: string
  code?: string
  projectId: string
}

export interface RFQLine {
  id: string
  articuladoId: string
  plannedQuantity: number
  description: string
  unit: string
}

export interface RFQ {
  id: string
  supplier: string
  lines: RFQLine[]
  status: "Pendente" | "Respondido" | "Adjudicado"
  sentDate: string
  dueDate: string
  projectId: string
}

export interface SupplierResponseItem {
  id: string
  articuladoIds: string[] // Array para permitir 1 artigo para N linhas
  supplierArticle: string
  brand: string
  supplierDescription: string
  unit: string
  quantity: number
  unitPrice: number
  supplierRef: string
  comments?: string
}

export interface SupplierResponse {
  id: string
  rfqId: string
  supplier: string
  items: SupplierResponseItem[]
  responseDate: string
  totalValue: number
}

export interface ComparativeData {
  articuladoLines: ArticuladoLine[]
  suppliers: string[]
  responses: SupplierResponse[]
  matrix: ComparativeMatrix
}

export interface ComparativeMatrix {
  [lineId: string]: {
    [supplier: string]: {
      item?: SupplierResponseItem
      price?: number
      available: boolean
    }
  }
}

export interface Award {
  id: string
  projectId: string
  awardDate: string
  lines: AwardLine[]
  totalValue: number
  status: "Criada" | "Aprovada" | "Executada"
}

export interface AwardLine {
  id: string
  articuladoId: string
  supplier: string
  responseItemId: string
  quantity: number
  unitPrice: number
  totalPrice: number
}
