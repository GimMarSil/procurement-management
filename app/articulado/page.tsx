"use client"

import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Filter, ShoppingCart, FileText, Plus, CheckSquare } from "lucide-react"
import type { ArticuladoLine } from "@/types/procurement"

export default function ArticuladoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [familyFilter, setFamilyFilter] = useState("all")
  const [selectedLines, setSelectedLines] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [showRFQModal, setShowRFQModal] = useState(false)

  const [articuladoLines, setArticuladoLines] = useState<ArticuladoLine[]>([])

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/articulado')
      if (res.ok) {
        const data: ArticuladoLine[] = await res.json()
        setArticuladoLines(data)
      }
    }
    load()
  }, [])

  const families = [...new Set(articuladoLines.map((line) => line.familyProduct))]

  const filteredLines = articuladoLines.filter((line) => {
    const matchesSearch =
      line.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      line.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      line.familyProduct.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFamily = familyFilter === "all" || line.familyProduct === familyFilter
    return matchesSearch && matchesFamily
  })

  const handleSelectLine = (lineId: string, checked: boolean) => {
    if (checked) {
      setSelectedLines([...selectedLines, lineId])
    } else {
      setSelectedLines(selectedLines.filter((id) => id !== lineId))
      setSelectAll(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedLines(filteredLines.map((line) => line.id))
    } else {
      setSelectedLines([])
    }
  }

  const getSelectedLinesData = () => {
    return articuladoLines.filter((line) => selectedLines.includes(line.id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Articulado Técnico</h1>
          <p className="text-muted-foreground">Caderno de encargos estruturado por famílias de produto</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={selectedLines.length === 0}>
            <FileText className="h-4 w-4 mr-2" />
            Exportar Seleção
          </Button>
          <Dialog open={showRFQModal} onOpenChange={setShowRFQModal}>
            <DialogTrigger asChild>
              <Button disabled={selectedLines.length === 0}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Criar Pedido ({selectedLines.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Criar Pedido para Fornecedor</DialogTitle>
                <DialogDescription>Gerar RFQ com {selectedLines.length} linhas selecionadas</DialogDescription>
              </DialogHeader>
              <CreateRFQForm selectedLines={getSelectedLinesData()} onClose={() => setShowRFQModal(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Linhas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articuladoLines.length}</div>
            <p className="text-xs text-muted-foreground">Linhas no articulado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Famílias</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{families.length}</div>
            <p className="text-xs text-muted-foreground">Famílias de produto</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selecionadas</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{selectedLines.length}</div>
            <p className="text-xs text-muted-foreground">Linhas marcadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Estimado</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€125.4K</div>
            <p className="text-xs text-muted-foreground">Valor selecionado</p>
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
                placeholder="Pesquisar por descrição, código ou família..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={familyFilter} onValueChange={setFamilyFilter}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Filtrar por família" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Famílias</SelectItem>
                {families.map((family) => (
                  <SelectItem key={family} value={family}>
                    {family}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela do Articulado */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Linhas do Articulado ({filteredLines.length})</CardTitle>
              <CardDescription>Caderno de encargos técnico do projeto</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} id="select-all" />
              <label htmlFor="select-all" className="text-sm font-medium">
                Selecionar tudo
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Sel.</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Família</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Qtd. Prevista</TableHead>
                  <TableHead>Observações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedLines.includes(line.id)}
                        onCheckedChange={(checked) => handleSelectLine(line.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{line.code}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{line.familyProduct}</Badge>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="truncate" title={line.description}>
                        {line.description}
                      </div>
                    </TableCell>
                    <TableCell>{line.unit}</TableCell>
                    <TableCell className="text-right font-medium">{line.plannedQuantity.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-32 truncate">
                      {line.observations}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CreateRFQForm({ selectedLines, onClose }: { selectedLines: ArticuladoLine[]; onClose: () => void }) {
  const [supplier, setSupplier] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [observations, setObservations] = useState("")

  const suppliers = [
    "FrancAir",
    "Rexel - Porto",
    "Sluz - Gaia",
    "Nortécnica",
    "Dell Technologies",
    "Cisco Systems",
    "Microsoft Portugal",
  ]

  const handleCreateRFQ = () => {
    // Lógica para criar RFQ
    toast({
      title: "RFQ criado",
      description: `Fornecedor: ${supplier}`,
    })
    onClose()
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Fornecedor</label>
          <Select value={supplier} onValueChange={setSupplier}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar fornecedor" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((sup) => (
                <SelectItem key={sup} value={sup}>
                  {sup}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Prazo de Resposta</label>
          <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Observações</label>
        <textarea
          className="w-full p-2 border rounded-md"
          rows={3}
          placeholder="Observações para o fornecedor..."
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
        />
      </div>

      {/* Preview das linhas selecionadas */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Linhas Selecionadas ({selectedLines.length})</label>
        <div className="max-h-60 overflow-y-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Família</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Qtd.</TableHead>
                <TableHead>Unidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedLines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {line.familyProduct}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm truncate max-w-xs">{line.description}</TableCell>
                  <TableCell className="text-right">{line.plannedQuantity}</TableCell>
                  <TableCell>{line.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleCreateRFQ} disabled={!supplier || !dueDate}>
          Criar Pedido
        </Button>
      </div>
    </div>
  )
}
