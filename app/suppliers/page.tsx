"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Eye, Edit, Mail, Phone, Star, TrendingUp, TrendingDown, Users } from "lucide-react"

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const suppliers = [
    {
      id: 1,
      name: "Dell Technologies",
      email: "vendas@dell.pt",
      phone: "+351 21 123 4567",
      category: "Hardware",
      rating: 4.8,
      totalProjects: 15,
      avgResponseTime: 2.3,
      avgMargin: 18.5,
      lastProject: "2024-02-15",
      status: "Ativo",
      performance: "excellent",
    },
    {
      id: 2,
      name: "Cisco Systems",
      email: "portugal@cisco.com",
      phone: "+351 21 234 5678",
      category: "Rede",
      rating: 4.6,
      totalProjects: 12,
      avgResponseTime: 1.8,
      avgMargin: 22.1,
      lastProject: "2024-02-10",
      status: "Ativo",
      performance: "excellent",
    },
    {
      id: 3,
      name: "Microsoft Portugal",
      email: "licensing@microsoft.pt",
      phone: "+351 21 345 6789",
      category: "Software",
      rating: 4.9,
      totalProjects: 28,
      avgResponseTime: 1.2,
      avgMargin: 15.8,
      lastProject: "2024-02-20",
      status: "Ativo",
      performance: "excellent",
    },
    {
      id: 4,
      name: "TechSolutions Lda",
      email: "comercial@techsolutions.pt",
      phone: "+351 21 456 7890",
      category: "Serviços",
      rating: 4.2,
      totalProjects: 8,
      avgResponseTime: 3.1,
      avgMargin: 25.3,
      lastProject: "2024-01-28",
      status: "Ativo",
      performance: "good",
    },
    {
      id: 5,
      name: "Office Supplies SA",
      email: "vendas@officesupplies.pt",
      phone: "+351 21 567 8901",
      category: "Mobiliário",
      rating: 3.8,
      totalProjects: 5,
      avgResponseTime: 4.2,
      avgMargin: 12.7,
      lastProject: "2024-01-15",
      status: "Inativo",
      performance: "average",
    },
  ]

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "excellent":
        return "text-green-600"
      case "good":
        return "text-blue-600"
      case "average":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case "excellent":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "good":
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      case "average":
        return <TrendingDown className="h-4 w-4 text-yellow-500" />
      default:
        return <TrendingDown className="h-4 w-4 text-red-500" />
    }
  }

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || supplier.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(suppliers.map((s) => s.category))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fornecedores</h1>
          <p className="text-muted-foreground">Gestão da base de fornecedores e histórico</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Fornecedor
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fornecedores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <p className="text-xs text-muted-foreground">
              {suppliers.filter((s) => s.status === "Ativo").length} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating Médio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(suppliers.reduce((acc, s) => acc + s.rating, 0) / suppliers.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">De 5.0 estrelas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Resposta</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(suppliers.reduce((acc, s) => acc + s.avgResponseTime, 0) / suppliers.length).toFixed(1)}d
            </div>
            <p className="text-xs text-muted-foreground">Média de resposta</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margem Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(suppliers.reduce((acc, s) => acc + s.avgMargin, 0) / suppliers.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Margem obtida</p>
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
                placeholder="Pesquisar fornecedores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Fornecedores */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Fornecedores ({filteredSuppliers.length})</CardTitle>
          <CardDescription>Informações detalhadas e histórico de performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Projetos</TableHead>
                  <TableHead>Tempo Resposta</TableHead>
                  <TableHead>Margem Média</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{supplier.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Último projeto: {new Date(supplier.lastProject).toLocaleDateString("pt-PT")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {supplier.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {supplier.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{supplier.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{supplier.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>{supplier.totalProjects}</TableCell>
                    <TableCell>{supplier.avgResponseTime}d</TableCell>
                    <TableCell className="font-medium text-green-600">{supplier.avgMargin}%</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getPerformanceIcon(supplier.performance)}
                        <span className={`text-sm font-medium ${getPerformanceColor(supplier.performance)}`}>
                          {supplier.performance === "excellent"
                            ? "Excelente"
                            : supplier.performance === "good"
                              ? "Bom"
                              : "Médio"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={supplier.status === "Ativo" ? "default" : "secondary"}>{supplier.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
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
