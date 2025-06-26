"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Search, Filter, Plus, Eye, Edit, Download, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const projects = [
    {
      id: 1,
      name: "Infraestrutura TI - Cliente ABC",
      client: "ABC Tecnologia",
      value: 125000,
      margin: 22.5,
      targetMargin: 20,
      status: "Em Cotação",
      progress: 65,
      rfqsSent: 12,
      rfqsReceived: 8,
      startDate: "2024-01-15",
      expectedEnd: "2024-03-30",
      risk: "low",
    },
    {
      id: 2,
      name: "Equipamento Industrial - XYZ Corp",
      client: "XYZ Corporation",
      value: 89000,
      margin: 15.2,
      targetMargin: 18,
      status: "Adjudicado",
      progress: 100,
      rfqsSent: 8,
      rfqsReceived: 8,
      startDate: "2024-01-10",
      expectedEnd: "2024-02-28",
      risk: "medium",
    },
    {
      id: 3,
      name: "Sistema HVAC - Edifício Central",
      client: "Imobiliária Central",
      value: 67500,
      margin: 19.8,
      targetMargin: 16,
      status: "Análise",
      progress: 45,
      rfqsSent: 15,
      rfqsReceived: 9,
      startDate: "2024-02-01",
      expectedEnd: "2024-04-15",
      risk: "low",
    },
    {
      id: 4,
      name: "Mobiliário de Escritório - StartupXYZ",
      client: "StartupXYZ",
      value: 23500,
      margin: 12.1,
      targetMargin: 15,
      status: "Pendente",
      progress: 25,
      rfqsSent: 6,
      rfqsReceived: 2,
      startDate: "2024-02-10",
      expectedEnd: "2024-03-15",
      risk: "high",
    },
    {
      id: 5,
      name: "Equipamento Médico - Hospital Central",
      client: "Hospital Central",
      value: 156000,
      margin: 24.3,
      targetMargin: 22,
      status: "Em Cotação",
      progress: 80,
      rfqsSent: 10,
      rfqsReceived: 9,
      startDate: "2024-01-20",
      expectedEnd: "2024-03-25",
      risk: "low",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Adjudicado":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Em Cotação":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "Análise":
        return <Eye className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Adjudicado":
        return "default"
      case "Em Cotação":
        return "secondary"
      case "Análise":
        return "outline"
      default:
        return "destructive"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projetos</h1>
          <p className="text-muted-foreground">Gestão de todos os projetos e articulados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pesquisar projetos..."
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
                <SelectItem value="Em Cotação">Em Cotação</SelectItem>
                <SelectItem value="Análise">Análise</SelectItem>
                <SelectItem value="Adjudicado">Adjudicado</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Mais Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Projetos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Projetos ({filteredProjects.length})</CardTitle>
          <CardDescription>Acompanhe o progresso e status de todos os projetos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Margem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>RFQs</TableHead>
                  <TableHead>Risco</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div>
                        <Link href={`/projects/${project.id}`} className="font-medium hover:underline">
                          {project.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          Início: {new Date(project.startDate).toLocaleDateString("pt-PT")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{project.client}</TableCell>
                    <TableCell>€{project.value.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div
                          className={`font-medium ${
                            project.margin < project.targetMargin ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {project.margin}%
                        </div>
                        <div className="text-xs text-muted-foreground">Meta: {project.targetMargin}%</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(project.status)} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(project.status)}
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={project.progress} className="w-16" />
                        <span className="text-xs text-muted-foreground">{project.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium">{project.rfqsReceived}</span>
                        <span className="text-muted-foreground">/{project.rfqsSent}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${getRiskColor(project.risk)}`}>
                        {project.risk === "low" ? "Baixo" : project.risk === "medium" ? "Médio" : "Alto"}
                      </span>
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
