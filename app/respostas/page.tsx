"use client"

import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, LinkIcon, CheckCircle, AlertTriangle, FileText, Search } from "lucide-react"
import type { SupplierResponse, ArticuladoLine } from "@/types/procurement"
import Link from "next/link"

export default function RespostasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [supplierFilter, setSupplierFilter] = useState("all")
  const [showMappingModal, setShowMappingModal] = useState(false)
  const [selectedResponse, setSelectedResponse] = useState<SupplierResponse | null>(null)

  // Mock data de respostas
  const responses: SupplierResponse[] = [
    {
      id: "resp-001",
      rfqId: "RFQ-001",
      supplier: "FrancAir",
      responseDate: "2024-02-10",
      totalValue: 32497.22,
      items: [
        {
          id: "item-001",
          articuladoIds: ["art-002"],
          supplierArticle: "ETAP-S1-LED",
          brand: "ETAP",
          supplierDescription: "Luminária de emergência LED tipo S1",
          unit: "un",
          quantity: 263,
          unitPrice: 80.27,
          supplierRef: "ETAP-S1-123",
          comments: "Inclui bateria Li-Ion e teste automático",
        },
        {
          id: "item-002",
          articuladoIds: ["art-003"],
          supplierArticle: "NORM-GEN-LED",
          brand: "Philips",
          supplierDescription: "Iluminação normal geral LED",
          unit: "un",
          quantity: 45,
          unitPrice: 111.11,
          supplierRef: "PHI-NORM-456",
          comments: "Dimming disponível",
        },
      ],
    },
    {
      id: "resp-002",
      rfqId: "RFQ-002",
      supplier: "Rexel - Porto",
      responseDate: "2024-02-12",
      totalValue: 16700.0,
      items: [
        {
          id: "item-003",
          articuladoIds: ["art-001"],
          supplierArticle: "IP-CAM-4K",
          brand: "Hikvision",
          supplierDescription: "Câmara IP 4K com visão noturna",
          unit: "un",
          quantity: 3,
          unitPrice: 1317.11,
          supplierRef: "HIK-4K-789",
          comments: "Inclui software de gestão",
        },
      ],
    },
  ]

  // Mock data do articulado para mapear
  const articuladoLines: ArticuladoLine[] = [
    {
      id: "art-001",
      familyProduct: "009-CCTV",
      description: "Câmara IP policromática com capacidade de resolução 4K",
      unit: "un",
      plannedQuantity: 3,
      projectId: "92114",
    },
    {
      id: "art-002",
      familyProduct: "026-Ilum. Segurança",
      description: "Iluminação de Segurança Normal Geral Vários",
      unit: "un",
      plannedQuantity: 263,
      projectId: "92114",
    },
    {
      id: "art-003",
      familyProduct: "025-Iluminação Norm",
      description: "GEN - Iluminação Normal Geral Vários",
      unit: "un",
      plannedQuantity: 45,
      projectId: "92114",
    },
  ]

  const suppliers = [...new Set(responses.map((r) => r.supplier))]

  const filteredResponses = responses.filter((response) => {
    const matchesSearch =
      response.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSupplier = supplierFilter === "all" || response.supplier === supplierFilter
    return matchesSearch && matchesSupplier
  })

  const openMappingModal = (response: SupplierResponse) => {
    setSelectedResponse(response)
    setShowMappingModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Respostas de Fornecedores</h1>
          <p className="text-muted-foreground">Gestão e mapeamento de propostas recebidas</p>
        </div>
        <div className="flex gap-2">
          <Link href="/comparativo">
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Ver Comparativo
            </Button>
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Respostas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responses.length}</div>
            <p className="text-xs text-muted-foreground">Propostas recebidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{responses.reduce((acc, r) => acc + r.totalValue, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Soma das propostas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens Únicos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responses.reduce((acc, r) => acc + r.items.length, 0)}</div>
            <p className="text-xs text-muted-foreground">Artigos propostos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mapeamentos</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {responses.reduce((acc, r) => acc + r.items.reduce((iacc, i) => iacc + i.articuladoIds.length, 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Ligações criadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pesquisar respostas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={supplierFilter} onValueChange={setSupplierFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Fornecedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier} value={supplier}>
                    {supplier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Respostas */}
      <div className="space-y-4">
        {filteredResponses.map((response) => (
          <Card key={response.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {response.supplier}
                    <Badge variant="outline">{response.id}</Badge>
                  </CardTitle>
                  <CardDescription>
                    Resposta ao pedido {response.rfqId} • {response.responseDate} • €
                    {response.totalValue.toLocaleString()}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => openMappingModal(response)}>
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Mapear
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Detalhe
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Artigo Fornecedor</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Qtd.</TableHead>
                    <TableHead>Preço Unit.</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Linhas Articulado</TableHead>
                    <TableHead>Ref. Fornecedor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {response.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.supplierArticle}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.brand}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{item.supplierDescription}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>€{item.unitPrice.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">
                        €{(item.quantity * item.unitPrice).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {item.articuladoIds.map((artId) => (
                            <Badge key={artId} variant="secondary" className="text-xs">
                              {artId}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.supplierRef}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Mapeamento */}
      <Dialog open={showMappingModal} onOpenChange={setShowMappingModal}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Mapeamento de Correspondências</DialogTitle>
            <DialogDescription>
              Definir correspondência entre artigos do fornecedor e linhas do articulado
            </DialogDescription>
          </DialogHeader>
          {selectedResponse && (
            <MappingEditor
              response={selectedResponse}
              articuladoLines={articuladoLines}
              onClose={() => setShowMappingModal(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function MappingEditor({
  response,
  articuladoLines,
  onClose,
}: {
  response: SupplierResponse
  articuladoLines: ArticuladoLine[]
  onClose: () => void
}) {
  const [mappings, setMappings] = useState<{ [itemId: string]: string[] }>(() => {
    const initial: { [itemId: string]: string[] } = {}
    response.items.forEach((item) => {
      initial[item.id] = [...item.articuladoIds]
    })
    return initial
  })

  const handleMappingChange = (itemId: string, articuladoId: string, checked: boolean) => {
    setMappings((prev) => ({
      ...prev,
      [itemId]: checked
        ? [...(prev[itemId] || []), articuladoId]
        : (prev[itemId] || []).filter((id) => id !== articuladoId),
    }))
  }

  const saveMappings = () => {
    toast({
      title: "Mapeamentos guardados",
    })
    onClose()
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        Fornecedor: <strong>{response.supplier}</strong> • Resposta: <strong>{response.id}</strong> • Total:{" "}
        <strong>€{response.totalValue.toLocaleString()}</strong>
      </div>

      <div className="space-y-4">
        {response.items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {item.supplierArticle} - {item.brand}
              </CardTitle>
              <CardDescription>{item.supplierDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Detalhes do Artigo</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Quantidade:</span>
                      <span className="font-medium">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Preço Unitário:</span>
                      <span className="font-medium">€{item.unitPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-medium">€{(item.quantity * item.unitPrice).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ref. Fornecedor:</span>
                      <span className="font-medium">{item.supplierRef}</span>
                    </div>
                    {item.comments && (
                      <div>
                        <span>Comentários:</span>
                        <p className="text-muted-foreground mt-1">{item.comments}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Linhas do Articulado</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {articuladoLines.map((line) => (
                      <div key={line.id} className="flex items-start space-x-2 p-2 border rounded">
                        <Checkbox
                          checked={mappings[item.id]?.includes(line.id) || false}
                          onCheckedChange={(checked) => handleMappingChange(item.id, line.id, checked as boolean)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {line.familyProduct}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{line.id}</span>
                          </div>
                          <p className="text-sm font-medium truncate">{line.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {line.plannedQuantity} {line.unit}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={saveMappings}>Guardar Mapeamentos</Button>
      </div>
    </div>
  )
}
