"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Award, CheckCircle, Clock, FileCheck, Euro, Building2, Search, Eye, Download } from "lucide-react"
import type { Award as AwardType } from "@/types/procurement"
import Link from "next/link"

export default function AdjudicacoesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [supplierFilter, setSupplierFilter] = useState("all")

  // Mock data de adjudicações
  const awards: AwardType[] = [
    {
      id: "award-001",
      projectId: "92114",
      awardDate: "2024-02-20",
      totalValue: 49197.22,
      status: "Criada",
      lines: [
        {
          id: "award-line-001",
          articuladoId: "art-001",
          supplier: "Rexel - Porto",
          responseItemId: "item-003",
          quantity: 3,
          unitPrice: 1317.11,
          totalPrice: 3951.33,
        },
        {
          id: "award-line-002",
          articuladoId: "art-002",
          supplier: "FrancAir",
          responseItemId: "item-001",
          quantity: 263,
          unitPrice: 80.27,
          totalPrice: 21111.01,
        },
        {
          id: "award-line-003",
          articuladoId: "art-003",
          supplier: "Sluz - Gaia",
          responseItemId: "item-005",
          quantity: 45,
          unitPrice: 105.0,
          totalPrice: 4725.0,
        },
      ],
    },
    {
      id: "award-002",
      projectId: "92118",
      awardDate: "2024-02-15",
      totalValue: 125000.0,
      status: "Aprovada",
      lines: [
        {
          id: "award-line-004",
          articuladoId: "art-004",
          supplier: "Nortécnica",
          responseItemId: "item-006",
          quantity: 100,
          unitPrice: 1250.0,
          totalPrice: 125000.0,
        },
      ],
    },
  ]

  const suppliers = [...new Set(awards.flatMap((award) => award.lines.map((line) => line.supplier)))]

  const filteredAwards = awards.filter((award) => {
    const matchesSearch =
      award.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      award.projectId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || award.status === statusFilter
    const matchesSupplier = supplierFilter === "all" || award.lines.some((line) => line.supplier === supplierFilter)
    return matchesSearch && matchesStatus && matchesSupplier
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Criada":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "Aprovada":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Executada":
        return <FileCheck className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Criada":
        return "secondary"
      case "Aprovada":
        return "default"
      case "Executada":
        return "outline"
      default:
        return "destructive"
    }
  }

  const totalValue = awards.reduce((sum, award) => sum + award.totalValue, 0)
  const createdAwards = awards.filter((award) => award.status === "Criada")
  const approvedAwards = awards.filter((award) => award.status === "Aprovada")
  const executedAwards = awards.filter((award) => award.status === "Executada")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Adjudicações</h1>
          <p className="text-muted-foreground">Histórico e gestão de adjudicações</p>
        </div>
        <div className="flex gap-2">
          <Link href="/comparativo">
            <Button variant="outline">
              <Award className="h-4 w-4 mr-2" />
              Nova Adjudicação
            </Button>
          </Link>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Adjudicações</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{awards.length}</div>
            <p className="text-xs text-muted-foreground">Adjudicações criadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Valor adjudicado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedAwards.length}</div>
            <p className="text-xs text-muted-foreground">Prontas para execução</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fornecedores</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <p className="text-xs text-muted-foreground">Fornecedores adjudicados</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="created">Criadas</TabsTrigger>
          <TabsTrigger value="approved">Aprovadas</TabsTrigger>
          <TabsTrigger value="executed">Executadas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Pesquisar adjudicações..."
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
                    <SelectItem value="Criada">Criada</SelectItem>
                    <SelectItem value="Aprovada">Aprovada</SelectItem>
                    <SelectItem value="Executada">Executada</SelectItem>
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

          {/* Lista de Adjudicações */}
          <div className="space-y-4">
            {filteredAwards.map((award) => (
              <Card key={award.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {award.id}
                        <Badge variant={getStatusVariant(award.status)} className="flex items-center gap-1">
                          {getStatusIcon(award.status)}
                          {award.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Projeto {award.projectId} • {new Date(award.awardDate).toLocaleDateString("pt-PT")} • €
                        {award.totalValue.toLocaleString()}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Detalhe
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Linhas:</span>
                        <div className="font-medium">{award.lines.length}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Fornecedores:</span>
                        <div className="font-medium">
                          {[...new Set(award.lines.map((line) => line.supplier))].length}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Data:</span>
                        <div className="font-medium">{new Date(award.awardDate).toLocaleDateString("pt-PT")}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={getStatusVariant(award.status)} className="mt-1">
                          {award.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Breakdown por Fornecedor:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {[...new Set(award.lines.map((line) => line.supplier))].map((supplier) => {
                          const supplierLines = award.lines.filter((line) => line.supplier === supplier)
                          const supplierTotal = supplierLines.reduce((sum, line) => sum + line.totalPrice, 0)

                          return (
                            <div
                              key={supplier}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                            >
                              <span className="font-medium">{supplier}</span>
                              <div className="text-right">
                                <div>€{supplierTotal.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground">{supplierLines.length} linhas</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="created">
          <Card>
            <CardHeader>
              <CardTitle>Adjudicações Criadas</CardTitle>
              <CardDescription>Adjudicações aguardando aprovação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {createdAwards.map((award) => (
                  <div key={award.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{award.id}</h4>
                        <p className="text-sm text-muted-foreground">
                          Projeto {award.projectId} • €{award.totalValue.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">Criada</Badge>
                        <div className="mt-1">
                          <Button size="sm">Aprovar</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Adjudicações Aprovadas</CardTitle>
              <CardDescription>Adjudicações prontas para execução</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {approvedAwards.map((award) => (
                  <div key={award.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{award.id}</h4>
                        <p className="text-sm text-muted-foreground">
                          Projeto {award.projectId} • €{award.totalValue.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="default">Aprovada</Badge>
                        <div className="mt-1">
                          <Button size="sm">Executar</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="executed">
          <Card>
            <CardHeader>
              <CardTitle>Adjudicações Executadas</CardTitle>
              <CardDescription>Adjudicações finalizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma adjudicação executada ainda</p>
                <p className="text-sm">As adjudicações executadas aparecerão aqui</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
