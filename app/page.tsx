"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ProjectSelectionModal } from "@/components/project-selection-modal"
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Euro,
  Plus,
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const [showProjectModal, setShowProjectModal] = useState(false)

  const kpis = [
    {
      title: "Projetos Ativos",
      value: "24",
      change: "+12%",
      trend: "up",
      icon: FileText,
    },
    {
      title: "RFQs Pendentes",
      value: "8",
      change: "-3",
      trend: "down",
      icon: Clock,
    },
    {
      title: "Margem Média",
      value: "18.5%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Fornecedores Ativos",
      value: "156",
      change: "+8",
      trend: "up",
      icon: Users,
    },
  ]

  const recentProjects = [
    {
      id: "92114",
      name: "Edifício Metrópolis",
      country: "Angola",
      client: "Ramos Ferreira",
      value: 9270867.78,
      currentValue: 9247332.63,
      margin: 25,
      status: "Em Cotação",
      progress: 65,
      rfqs: 12,
      responses: 8,
      specialties: ["ÁGUAS", "AVAC", "IE"],
    },
    {
      id: "92118",
      name: "Shoprite Saurimo",
      country: "Angola",
      client: "Shoprite",
      value: 2474516.29,
      currentValue: 2400000,
      margin: 18.2,
      status: "Adjudicado",
      progress: 100,
      rfqs: 8,
      responses: 8,
      specialties: ["AVAC"],
    },
    {
      id: "92116",
      name: "Torre Cidadela",
      country: "Moçambique",
      client: "Cidadela Invest",
      value: 568383.18,
      currentValue: 550000,
      margin: 19.8,
      status: "Análise",
      progress: 45,
      rfqs: 15,
      responses: 9,
      specialties: ["ÁGUAS"],
    },
  ]

  const alerts = [
    {
      type: "warning",
      message: "Projeto 92114 - Margem abaixo do esperado",
      time: "2h atrás",
    },
    {
      type: "info",
      message: "5 novas propostas recebidas para Edifício Metrópolis",
      time: "4h atrás",
    },
    {
      type: "error",
      message: "RFQ vencido - Fornecedor FrancAir não respondeu",
      time: "1d atrás",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Mapa GAP - Gestão de Processos de Compras</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Exportar Relatório</Button>
          <Button onClick={() => setShowProjectModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Selecionar Projeto
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {kpi.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={kpi.trend === "up" ? "text-green-500" : "text-red-500"}>{kpi.change}</span>
                  <span className="ml-1">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projetos Recentes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Projetos Recentes</CardTitle>
              <CardDescription>Acompanhamento dos projetos em andamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <Link href={`/projects/${project.id}`} className="font-medium hover:underline">
                          {project.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {project.country} • {project.client}
                        </p>
                        <div className="flex gap-1">
                          {project.specialties.map((spec) => (
                            <Badge key={spec} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Badge
                        variant={
                          project.status === "Adjudicado"
                            ? "default"
                            : project.status === "Em Cotação"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Valor Objetivo</p>
                        <p className="font-medium">€{project.value.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Situação Atual</p>
                        <p className="font-medium">€{project.currentValue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">RFQs</p>
                        <p className="font-medium">
                          {project.responses}/{project.rfqs}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Progresso</p>
                        <div className="flex items-center gap-2">
                          <Progress value={project.progress} className="flex-1" />
                          <span className="text-xs">{project.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/projects">
                  <Button variant="outline" className="w-full">
                    Ver Todos os Projetos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas e Ações */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alertas</CardTitle>
              <CardDescription>Notificações importantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                    {alert.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />}
                    {alert.type === "info" && <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />}
                    {alert.type === "error" && <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />}
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => setShowProjectModal(true)}>
                <FileText className="h-4 w-4 mr-2" />
                Selecionar Articulado
              </Button>
              <Link href="/rfqs">
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Gerir RFQs
                </Button>
              </Link>
              <Link href="/suppliers">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Gerir Fornecedores
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="outline" className="w-full justify-start">
                  <Euro className="h-4 w-4 mr-2" />
                  Análise de Margem
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <ProjectSelectionModal open={showProjectModal} onOpenChange={setShowProjectModal} />
    </div>
  )
}
