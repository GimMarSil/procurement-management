"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Filter, Plus, Eye, Edit, Send, Clock, CheckCircle, AlertTriangle, FileText, Mail } from "lucide-react"

export default function RFQsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showNewRFQModal, setShowNewRFQModal] = useState(false)

  const rfqs = [
    {
      id: "RFQ-001",
      project: "92114 - Edifício Metrópolis",
      supplier: "FrancAir",
      items: 15,
      sentDate: "2024-02-01",
      dueDate: "2024-02-15",
      status: "Respondido",
      value: 32497.22,
      specialty: "026-Ilum. Segurança",
      responseDate: "2024-02-10",
    },
    {
      id: "RFQ-002",
      project: "92114 - Edifício Metrópolis",
      supplier: "Rexel - Porto",
      items: 8,
      sentDate: "2024-02-01",
      dueDate: "2024-02-15",
      status: "Respondido",
      value: 16700.0,
      specialty: "009-CCTV",
      responseDate: "2024-02-12",
    },
    {
      id: "RFQ-003",
      project: "92114 - Edifício Metrópolis",
      supplier: "Sluz - Gaia",
      items: 12,
      sentDate: "2024-02-02",
      dueDate: "2024-02-16",
      status: "Pendente",
      value: null,
      specialty: "025-Iluminação Norm",
      responseDate: null,
    },
    {
      id: "RFQ-004",
      project: "92118 - Shoprite Saurimo",
      supplier: "Nortécnica",
      items: 6,
      sentDate: "2024-01-28",
      dueDate: "2024-02-11",
      status: "Vencido",
      value: null,
      specialty: "AVAC",
      responseDate: null,
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Respondido":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Pendente":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "Vencido":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Respondido":
        return "default"
      case "Pendente":
        return "secondary"
      case "Vencido":
        return "destructive"
      default:
        return "outline"
    }
  }

  const filteredRFQs = rfqs.filter((rfq) => {
    const matchesSearch =
      rfq.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || rfq.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingRFQs = rfqs.filter((rfq) => rfq.status === "Pendente")
  const overdueRFQs = rfqs.filter((rfq) => rfq.status === "Vencido")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">RFQs - Pedidos de Proposta</h1>
          <p className="text-muted-foreground">Gestão de pedidos de proposta a fornecedores</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Enviar Pendentes
          </Button>
          <Dialog open={showNewRFQModal} onOpenChange={setShowNewRFQModal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo RFQ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Novo RFQ</DialogTitle>
                <DialogDescription>Criar pedido de proposta para fornecedores</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Projeto</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar projeto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="92114">92114 - Edifício Metrópolis</SelectItem>
                        <SelectItem value="92118">92118 - Shoprite Saurimo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Fornecedor</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar fornecedor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="francair">FrancAir</SelectItem>
                        <SelectItem value="rexel">Rexel - Porto</SelectItem>
                        <SelectItem value="sluz">Sluz - Gaia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Especialidade</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar especialidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cctv">009-CCTV</SelectItem>
                      <SelectItem value="ilum">026-Ilum. Segurança</SelectItem>
                      <SelectItem value="norm">025-Iluminação Norm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prazo de Resposta</label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Observações</label>
                  <Textarea placeholder="Observações adicionais..." />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowNewRFQModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setShowNewRFQModal(false)}>Criar RFQ</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total RFQs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rfqs.length}</div>
            <p className="text-xs text-muted-foreground">Pedidos criados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingRFQs.length}</div>
            <p className="text-xs text-muted-foreground">Aguardando resposta</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueRFQs.length}</div>
            <p className="text-xs text-muted-foreground">Prazo expirado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Resposta</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((rfqs.filter((r) => r.status === "Respondido").length / rfqs.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Respostas recebidas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="responded">Respondidos</TabsTrigger>
          <TabsTrigger value="overdue">Vencidos</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Pesquisar RFQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Respondido">Respondido</SelectItem>
                    <SelectItem value="Vencido">Vencido</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Mais Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabela de RFQs */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de RFQs ({filteredRFQs.length})</CardTitle>
              <CardDescription>Acompanhamento de todos os pedidos de proposta</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Projeto</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Especialidade</TableHead>
                    <TableHead>Itens</TableHead>
                    <TableHead>Enviado</TableHead>
                    <TableHead>Prazo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRFQs.map((rfq) => (
                    <TableRow key={rfq.id}>
                      <TableCell className="font-medium">{rfq.id}</TableCell>
                      <TableCell>{rfq.project}</TableCell>
                      <TableCell>{rfq.supplier}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rfq.specialty}</Badge>
                      </TableCell>
                      <TableCell>{rfq.items}</TableCell>
                      <TableCell>{new Date(rfq.sentDate).toLocaleDateString("pt-PT")}</TableCell>
                      <TableCell>{new Date(rfq.dueDate).toLocaleDateString("pt-PT")}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(rfq.status)} className="flex items-center gap-1 w-fit">
                          {getStatusIcon(rfq.status)}
                          {rfq.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{rfq.value ? `€${rfq.value.toLocaleString()}` : "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>RFQs Pendentes</CardTitle>
              <CardDescription>Pedidos aguardando resposta dos fornecedores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRFQs.map((rfq) => (
                  <div key={rfq.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{rfq.id}</h4>
                        <p className="text-sm text-muted-foreground">
                          {rfq.project} • {rfq.supplier}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          Prazo: {new Date(rfq.dueDate).toLocaleDateString("pt-PT")}
                        </p>
                        <Badge variant="secondary">Pendente</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responded">
          <Card>
            <CardHeader>
              <CardTitle>RFQs Respondidos</CardTitle>
              <CardDescription>Pedidos com resposta dos fornecedores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rfqs
                  .filter((rfq) => rfq.status === "Respondido")
                  .map((rfq) => (
                    <div key={rfq.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{rfq.id}</h4>
                          <p className="text-sm text-muted-foreground">
                            {rfq.project} • {rfq.supplier}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">€{rfq.value?.toLocaleString()}</p>
                          <Badge variant="default">Respondido</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card>
            <CardHeader>
              <CardTitle>RFQs Vencidos</CardTitle>
              <CardDescription>Pedidos com prazo expirado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overdueRFQs.map((rfq) => (
                  <div key={rfq.id} className="border rounded-lg p-4 border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{rfq.id}</h4>
                        <p className="text-sm text-muted-foreground">
                          {rfq.project} • {rfq.supplier}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-red-600">
                          Vencido: {new Date(rfq.dueDate).toLocaleDateString("pt-PT")}
                        </p>
                        <Badge variant="destructive">Vencido</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
