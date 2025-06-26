"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Edit, Send, Clock, CheckCircle, AlertTriangle, FileText, Plus, Search } from "lucide-react"
import type { RFQ } from "@/types/procurement"
import Link from "next/link"

export default function PedidosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [supplierFilter, setSupplierFilter] = useState("all")
  const [rfqs, setRfqs] = useState<RFQ[]>([])

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/rfqs')
      if (res.ok) {
        const data: RFQ[] = await res.json()
        setRfqs(data)
      }
    }
    load()
  }, [])

  const suppliers = [...new Set(rfqs.map((rfq) => rfq.supplier))]

  const filteredRFQs = rfqs.filter((rfq) => {
    const matchesSearch =
      rfq.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || rfq.status === statusFilter
    const matchesSupplier = supplierFilter === "all" || rfq.supplier === supplierFilter
    return matchesSearch && matchesStatus && matchesSupplier
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Respondido":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Pendente":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "Adjudicado":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Respondido":
        return "default"
      case "Pendente":
        return "secondary"
      case "Adjudicado":
        return "outline"
      default:
        return "destructive"
    }
  }

  const pendingRFQs = rfqs.filter((rfq) => rfq.status === "Pendente")
  const respondedRFQs = rfqs.filter((rfq) => rfq.status === "Respondido")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pedidos Enviados</h1>
          <p className="text-muted-foreground">Gestão de RFQs enviados a fornecedores</p>
        </div>
        <div className="flex gap-2">
          <Link href="/articulado">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Novo Pedido
            </Button>
          </Link>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Enviar Lembretes
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
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
            <CardTitle className="text-sm font-medium">Respondidos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{respondedRFQs.length}</div>
            <p className="text-xs text-muted-foreground">Com propostas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Resposta</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((respondedRFQs.length / rfqs.length) * 100)}%</div>
            <p className="text-xs text-muted-foreground">Eficácia dos pedidos</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="responded">Respondidos</TabsTrigger>
          <TabsTrigger value="awarded">Adjudicados</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Pesquisar pedidos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Respondido">Respondido</SelectItem>
                    <SelectItem value="Adjudicado">Adjudicado</SelectItem>
                  </SelectContent>
                </Select>
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

          {/* Tabela de Pedidos */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Pedidos ({filteredRFQs.length})</CardTitle>
              <CardDescription>Todos os pedidos enviados aos fornecedores</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Pedido</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Linhas</TableHead>
                    <TableHead>Enviado</TableHead>
                    <TableHead>Prazo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Projeto</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRFQs.map((rfq) => (
                    <TableRow key={rfq.id}>
                      <TableCell className="font-medium">{rfq.id}</TableCell>
                      <TableCell>{rfq.supplier}</TableCell>
                      <TableCell>{rfq.lines.length}</TableCell>
                      <TableCell>{new Date(rfq.sentDate).toLocaleDateString("pt-PT")}</TableCell>
                      <TableCell>{new Date(rfq.dueDate).toLocaleDateString("pt-PT")}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(rfq.status)} className="flex items-center gap-1 w-fit">
                          {getStatusIcon(rfq.status)}
                          {rfq.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{rfq.projectId}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Link href={`/pedidos/${rfq.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
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
              <CardTitle>Pedidos Pendentes</CardTitle>
              <CardDescription>Pedidos aguardando resposta dos fornecedores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRFQs.map((rfq) => (
                  <div key={rfq.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{rfq.id}</h4>
                        <p className="text-sm text-muted-foreground">{rfq.supplier}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          Prazo: {new Date(rfq.dueDate).toLocaleDateString("pt-PT")}
                        </p>
                        <Badge variant="secondary">Pendente</Badge>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {rfq.lines.length} linhas • Projeto {rfq.projectId}
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
              <CardTitle>Pedidos Respondidos</CardTitle>
              <CardDescription>Pedidos com propostas recebidas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {respondedRFQs.map((rfq) => (
                  <div key={rfq.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{rfq.id}</h4>
                        <p className="text-sm text-muted-foreground">{rfq.supplier}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="default">Respondido</Badge>
                        <div className="mt-1">
                          <Link href={`/respostas/${rfq.id}`}>
                            <Button variant="outline" size="sm">
                              Ver Resposta
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {rfq.lines.length} linhas • Projeto {rfq.projectId}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="awarded">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Adjudicados</CardTitle>
              <CardDescription>Pedidos com adjudicação finalizada</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum pedido adjudicado ainda</p>
                <p className="text-sm">Os pedidos aparecerão aqui após adjudicação</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
