"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Award, CheckCircle, AlertTriangle, TrendingUp, Crown, Calculator, FileCheck } from "lucide-react"
import type { ComparativeMatrix, ArticuladoLine, Award as AwardType } from "@/types/procurement"

export default function ComparativoPage() {
  const [selectedScenario, setSelectedScenario] = useState<{ [lineId: string]: string }>({})
  const [showAwardModal, setShowAwardModal] = useState(false)

  // Mock data
  const articuladoLines: ArticuladoLine[] = [
    {
      id: "art-001",
      familyProduct: "009-CCTV",
      description: "Câmara IP policromática 4K",
      unit: "un",
      plannedQuantity: 3,
      projectId: "92114",
    },
    {
      id: "art-002",
      familyProduct: "026-Ilum. Segurança",
      description: "Iluminação de Segurança Normal",
      unit: "un",
      plannedQuantity: 263,
      projectId: "92114",
    },
    {
      id: "art-003",
      familyProduct: "025-Iluminação Norm",
      description: "Iluminação Normal Geral",
      unit: "un",
      plannedQuantity: 45,
      projectId: "92114",
    },
  ]

  const suppliers = ["FrancAir", "Rexel - Porto", "Sluz - Gaia"]

  // Matriz de comparação baseada nas imagens
  const comparativeMatrix: ComparativeMatrix = {
    "art-001": {
      FrancAir: { available: false },
      "Rexel - Porto": {
        available: true,
        price: 1317.11,
        item: {
          id: "item-003",
          articuladoIds: ["art-001"],
          supplierArticle: "IP-CAM-4K",
          brand: "Hikvision",
          supplierDescription: "Câmara IP 4K",
          unit: "un",
          quantity: 3,
          unitPrice: 1317.11,
          supplierRef: "HIK-4K-789",
        },
      },
      "Sluz - Gaia": { available: false },
    },
    "art-002": {
      FrancAir: {
        available: true,
        price: 80.27,
        item: {
          id: "item-001",
          articuladoIds: ["art-002"],
          supplierArticle: "ETAP-S1-LED",
          brand: "ETAP",
          supplierDescription: "Luminária emergência LED",
          unit: "un",
          quantity: 263,
          unitPrice: 80.27,
          supplierRef: "ETAP-S1-123",
        },
      },
      "Rexel - Porto": { available: false },
      "Sluz - Gaia": {
        available: true,
        price: 85.5,
        item: {
          id: "item-004",
          articuladoIds: ["art-002"],
          supplierArticle: "LED-EMER-S1",
          brand: "Philips",
          supplierDescription: "Sistema emergência LED",
          unit: "un",
          quantity: 263,
          unitPrice: 85.5,
          supplierRef: "PHI-LED-456",
        },
      },
    },
    "art-003": {
      FrancAir: {
        available: true,
        price: 111.11,
        item: {
          id: "item-002",
          articuladoIds: ["art-003"],
          supplierArticle: "NORM-GEN-LED",
          brand: "Philips",
          supplierDescription: "Iluminação normal LED",
          unit: "un",
          quantity: 45,
          unitPrice: 111.11,
          supplierRef: "PHI-NORM-456",
        },
      },
      "Rexel - Porto": { available: false },
      "Sluz - Gaia": {
        available: true,
        price: 105.0,
        item: {
          id: "item-005",
          articuladoIds: ["art-003"],
          supplierArticle: "NORM-LED-STD",
          brand: "Osram",
          supplierDescription: "Iluminação LED standard",
          unit: "un",
          quantity: 45,
          unitPrice: 105.0,
          supplierRef: "OSR-LED-789",
        },
      },
    },
  }

  // Calcular totais por fornecedor
  const calculateSupplierTotals = () => {
    const totals: { [supplier: string]: { total: number; coverage: number; lines: string[] } } = {}

    suppliers.forEach((supplier) => {
      let total = 0
      let coverage = 0
      const lines: string[] = []

      articuladoLines.forEach((line) => {
        const supplierData = comparativeMatrix[line.id]?.[supplier]
        if (supplierData?.available && supplierData.price) {
          total += supplierData.price * line.plannedQuantity
          coverage++
          lines.push(line.id)
        }
      })

      totals[supplier] = {
        total,
        coverage: (coverage / articuladoLines.length) * 100,
        lines,
      }
    })

    return totals
  }

  const supplierTotals = calculateSupplierTotals()

  // Calcular total do cenário selecionado
  const calculateScenarioTotal = () => {
    let total = 0
    articuladoLines.forEach((line) => {
      const selectedSupplier = selectedScenario[line.id]
      if (selectedSupplier) {
        const supplierData = comparativeMatrix[line.id]?.[selectedSupplier]
        if (supplierData?.available && supplierData.price) {
          total += supplierData.price * line.plannedQuantity
        }
      }
    })
    return total
  }

  const handleLineSelection = (lineId: string, supplier: string) => {
    setSelectedScenario((prev) => ({
      ...prev,
      [lineId]: supplier,
    }))
  }

  const handleSupplierProposal = (supplier: string) => {
    const newScenario: { [lineId: string]: string } = {}
    articuladoLines.forEach((line) => {
      const supplierData = comparativeMatrix[line.id]?.[supplier]
      if (supplierData?.available) {
        newScenario[line.id] = supplier
      }
    })
    setSelectedScenario(newScenario)
  }

  const isValidForAward = () => {
    return articuladoLines.every((line) => selectedScenario[line.id])
  }

  const getBestPrice = (lineId: string) => {
    let bestPrice = Number.POSITIVE_INFINITY
    let bestSupplier = ""

    suppliers.forEach((supplier) => {
      const supplierData = comparativeMatrix[lineId]?.[supplier]
      if (supplierData?.available && supplierData.price && supplierData.price < bestPrice) {
        bestPrice = supplierData.price
        bestSupplier = supplier
      }
    })

    return { price: bestPrice === Number.POSITIVE_INFINITY ? null : bestPrice, supplier: bestSupplier }
  }

  const scenarioTotal = calculateScenarioTotal()
  const selectedLinesCount = Object.keys(selectedScenario).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Comparativo de Propostas</h1>
          <p className="text-muted-foreground">Análise comparativa para apoio à decisão</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAwardModal} onOpenChange={setShowAwardModal}>
            <DialogTrigger asChild>
              <Button disabled={!isValidForAward()}>
                <Award className="h-4 w-4 mr-2" />
                Criar Adjudicação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Criar Adjudicação</DialogTitle>
                <DialogDescription>Finalizar adjudicação com cenário selecionado</DialogDescription>
              </DialogHeader>
              <AwardCreator
                selectedScenario={selectedScenario}
                articuladoLines={articuladoLines}
                comparativeMatrix={comparativeMatrix}
                total={scenarioTotal}
                onClose={() => setShowAwardModal(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Linhas Comparadas</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articuladoLines.length}</div>
            <p className="text-xs text-muted-foreground">Total do articulado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fornecedores</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <p className="text-xs text-muted-foreground">Com propostas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cenário Atual</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">€{scenarioTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {selectedLinesCount}/{articuladoLines.length} linhas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isValidForAward() ? "text-green-600" : "text-yellow-600"}`}>
              {isValidForAward() ? "Pronto" : "Pendente"}
            </div>
            <p className="text-xs text-muted-foreground">
              {isValidForAward() ? "Para adjudicação" : "Selecionar todas as linhas"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resumo por Fornecedor */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo por Fornecedor</CardTitle>
          <CardDescription>Cobertura e valores totais por fornecedor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suppliers.map((supplier) => {
              const supplierData = supplierTotals[supplier]
              const isComplete = supplierData.coverage === 100

              return (
                <Card key={supplier} className={`relative ${isComplete ? "ring-2 ring-green-500" : ""}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{supplier}</CardTitle>
                      {isComplete && <Crown className="h-5 w-5 text-green-500" />}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Total:</span>
                      <span className="font-medium">€{supplierData.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cobertura:</span>
                      <span className="font-medium">{supplierData.coverage.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Linhas:</span>
                      <span className="font-medium">
                        {supplierData.lines.length}/{articuladoLines.length}
                      </span>
                    </div>
                    <Button
                      variant={isComplete ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                      onClick={() => handleSupplierProposal(supplier)}
                      disabled={supplierData.lines.length === 0}
                    >
                      {isComplete ? "Proposta Completa" : "Aplicar Parcial"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Matriz de Comparação */}
      <Card>
        <CardHeader>
          <CardTitle>Matriz de Comparação</CardTitle>
          <CardDescription>Comparação linha a linha com seleção manual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-80">Linha do Articulado</TableHead>
                  {suppliers.map((supplier) => (
                    <TableHead key={supplier} className="text-center min-w-32">
                      {supplier}
                    </TableHead>
                  ))}
                  <TableHead className="text-center">Melhor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articuladoLines.map((line) => {
                  const bestPrice = getBestPrice(line.id)

                  return (
                    <TableRow key={line.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{line.familyProduct}</Badge>
                            <span className="text-xs text-muted-foreground">{line.id}</span>
                          </div>
                          <p className="font-medium text-sm">{line.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {line.plannedQuantity} {line.unit}
                          </p>
                        </div>
                      </TableCell>
                      {suppliers.map((supplier) => {
                        const supplierData = comparativeMatrix[line.id]?.[supplier]
                        const isSelected = selectedScenario[line.id] === supplier
                        const isBest = bestPrice.supplier === supplier && bestPrice.price

                        return (
                          <TableCell key={supplier} className="text-center">
                            {supplierData?.available ? (
                              <div className="space-y-2">
                                <div
                                  className={`p-2 rounded border cursor-pointer transition-colors ${
                                    isSelected
                                      ? "bg-blue-50 border-blue-500"
                                      : isBest
                                        ? "bg-green-50 border-green-500"
                                        : "border-gray-200 hover:bg-gray-50"
                                  }`}
                                  onClick={() => handleLineSelection(line.id, supplier)}
                                >
                                  <div className="font-medium">€{supplierData.price?.toLocaleString()}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Total: €{((supplierData.price || 0) * line.plannedQuantity).toLocaleString()}
                                  </div>
                                  {supplierData.item && (
                                    <div className="text-xs text-muted-foreground truncate">
                                      {supplierData.item.brand} - {supplierData.item.supplierArticle}
                                    </div>
                                  )}
                                  {isBest && (
                                    <Badge variant="outline" className="text-xs mt-1">
                                      Melhor
                                    </Badge>
                                  )}
                                </div>
                                {isSelected && (
                                  <div className="flex justify-center">
                                    <CheckCircle className="h-4 w-4 text-blue-500" />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-center text-muted-foreground">
                                <AlertTriangle className="h-4 w-4 mx-auto mb-1" />
                                <div className="text-xs">N/A</div>
                              </div>
                            )}
                          </TableCell>
                        )
                      })}
                      <TableCell className="text-center">
                        {bestPrice.price && (
                          <div className="space-y-1">
                            <div className="font-medium text-green-600">€{bestPrice.price.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">{bestPrice.supplier}</div>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Resumo do Cenário */}
      {selectedLinesCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cenário Selecionado</CardTitle>
            <CardDescription>Resumo das seleções atuais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">€{scenarioTotal.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{selectedLinesCount}</div>
                  <div className="text-sm text-muted-foreground">Linhas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.round((selectedLinesCount / articuladoLines.length) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Completo</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{[...new Set(Object.values(selectedScenario))].length}</div>
                  <div className="text-sm text-muted-foreground">Fornecedores</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Detalhes por Fornecedor:</h4>
                {suppliers.map((supplier) => {
                  const supplierLines = Object.entries(selectedScenario).filter(([_, s]) => s === supplier)
                  if (supplierLines.length === 0) return null

                  const supplierTotal = supplierLines.reduce((total, [lineId]) => {
                    const line = articuladoLines.find((l) => l.id === lineId)
                    const supplierData = comparativeMatrix[lineId]?.[supplier]
                    if (line && supplierData?.price) {
                      return total + supplierData.price * line.plannedQuantity
                    }
                    return total
                  }, 0)

                  return (
                    <div key={supplier} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">{supplier}</span>
                        <span className="text-sm text-muted-foreground ml-2">({supplierLines.length} linhas)</span>
                      </div>
                      <div className="font-medium">€{supplierTotal.toLocaleString()}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function AwardCreator({
  selectedScenario,
  articuladoLines,
  comparativeMatrix,
  total,
  onClose,
}: {
  selectedScenario: { [lineId: string]: string }
  articuladoLines: ArticuladoLine[]
  comparativeMatrix: ComparativeMatrix
  total: number
  onClose: () => void
}) {
  const [awardDate, setAwardDate] = useState(new Date().toISOString().split("T")[0])
  const [observations, setObservations] = useState("")

  const createAward = () => {
    const awardLines = articuladoLines
      .filter((line) => selectedScenario[line.id])
      .map((line) => {
        const supplier = selectedScenario[line.id]
        const supplierData = comparativeMatrix[line.id]?.[supplier]

        return {
          id: `award-line-${line.id}`,
          articuladoId: line.id,
          supplier,
          responseItemId: supplierData?.item?.id || "",
          quantity: line.plannedQuantity,
          unitPrice: supplierData?.price || 0,
          totalPrice: (supplierData?.price || 0) * line.plannedQuantity,
        }
      })

    const award: AwardType = {
      id: `award-${Date.now()}`,
      projectId: "92114",
      awardDate,
      lines: awardLines,
      totalValue: total,
      status: "Criada",
    }

    console.log("Criar adjudicação:", award)
    onClose()
  }

  const supplierBreakdown = articuladoLines
    .filter((line) => selectedScenario[line.id])
    .reduce(
      (acc, line) => {
        const supplier = selectedScenario[line.id]
        const supplierData = comparativeMatrix[line.id]?.[supplier]

        if (!acc[supplier]) {
          acc[supplier] = { lines: 0, total: 0 }
        }

        acc[supplier].lines++
        acc[supplier].total += (supplierData?.price || 0) * line.plannedQuantity

        return acc
      },
      {} as { [supplier: string]: { lines: number; total: number } },
    )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Data de Adjudicação</label>
          <input
            type="date"
            value={awardDate}
            onChange={(e) => setAwardDate(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Valor Total</label>
          <div className="p-2 bg-gray-50 rounded-md font-medium">€{total.toLocaleString()}</div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Observações</label>
        <textarea
          className="w-full p-2 border rounded-md"
          rows={3}
          placeholder="Observações sobre a adjudicação..."
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Resumo por Fornecedor:</h4>
        {Object.entries(supplierBreakdown).map(([supplier, data]) => (
          <Card key={supplier}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">{supplier}</h5>
                  <p className="text-sm text-muted-foreground">{data.lines} linhas adjudicadas</p>
                </div>
                <div className="text-right">
                  <div className="font-medium">€{data.total.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">
                    {((data.total / total) * 100).toFixed(1)}% do total
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
        <Button onClick={createAward}>Criar Adjudicação</Button>
      </div>
    </div>
  )
}
