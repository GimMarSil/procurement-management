"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Euro,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Download,
} from "lucide-react"

export default function AnalyticsPage() {
  const marginAnalysis = [
    {
      project: "Infraestrutura TI - ABC",
      targetMargin: 20,
      currentMargin: 22.5,
      value: 125000,
      status: "above",
      risk: "low",
    },
    {
      project: "Equipamento Industrial - XYZ",
      targetMargin: 18,
      currentMargin: 15.2,
      value: 89000,
      status: "below",
      risk: "medium",
    },
    {
      project: "Sistema HVAC - Central",
      targetMargin: 16,
      currentMargin: 19.8,
      value: 67500,
      status: "above",
      risk: "low",
    },
    {
      project: "Mobiliário - StartupXYZ",
      targetMargin: 15,
      currentMargin: 12.1,
      value: 23500,
      status: "below",
      risk: "high",
    },
  ]

  const supplierPerformance = [
    {
      name: "Dell Technologies",
      avgMargin: 18.5,
      responseTime: 2.3,
      projects: 15,
      reliability: 95,
    },
    {
      name: "Microsoft Portugal",
      avgMargin: 15.8,
      responseTime: 1.2,
      projects: 28,
      reliability: 98,
    },
    {
      name: "Cisco Systems",
      avgMargin: 22.1,
      responseTime: 1.8,
      projects: 12,
      reliability: 92,
    },
  ]

  const categoryAnalysis = [
    { category: "Hardware", margin: 18.2, volume: 45, trend: "up" },
    { category: "Software", margin: 15.8, volume: 30, trend: "down" },
    { category: "Serviços", margin: 25.3, volume: 15, trend: "up" },
    { category: "Rede", margin: 22.1, volume: 10, trend: "stable" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Análise e Relatórios</h1>
          <p className="text-muted-foreground">Dashboards financeiros e de performance</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="last30">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7">Últimos 7 dias</SelectItem>
              <SelectItem value="last30">Últimos 30 dias</SelectItem>
              <SelectItem value="last90">Últimos 90 dias</SelectItem>
              <SelectItem value="year">Este ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs Financeiros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margem Média Global</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">18.9%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+2.3%</span>
              <span className="ml-1">vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume Total</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€305.000</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+15.2%</span>
              <span className="ml-1">vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos em Risco</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">2</div>
            <p className="text-xs text-muted-foreground">Margem abaixo do mínimo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">RFQs respondidos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Análise de Margem por Projeto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Análise de Margem por Projeto
            </CardTitle>
            <CardDescription>Comparação entre margem alvo e atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marginAnalysis.map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{project.project}</p>
                      <p className="text-xs text-muted-foreground">€{project.value.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          project.risk === "high" ? "destructive" : project.risk === "medium" ? "secondary" : "default"
                        }
                      >
                        {project.risk === "high"
                          ? "Alto Risco"
                          : project.risk === "medium"
                            ? "Médio Risco"
                            : "Baixo Risco"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span>Meta: {project.targetMargin}%</span>
                        <span className={project.status === "above" ? "text-green-600" : "text-red-600"}>
                          Atual: {project.currentMargin}%
                        </span>
                      </div>
                      <Progress value={(project.currentMargin / project.targetMargin) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance de Fornecedores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Performance de Fornecedores
            </CardTitle>
            <CardDescription>Top fornecedores por margem e confiabilidade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {supplierPerformance.map((supplier, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{supplier.name}</h4>
                    <Badge variant="outline">{supplier.projects} projetos</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Margem Média</p>
                      <p className="font-medium text-green-600">{supplier.avgMargin}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tempo Resposta</p>
                      <p className="font-medium">{supplier.responseTime}d</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Confiabilidade</p>
                      <p className="font-medium">{supplier.reliability}%</p>
                    </div>
                  </div>
                  <Progress value={supplier.reliability} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análise por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Análise por Categoria de Produto</CardTitle>
          <CardDescription>Performance financeira por categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryAnalysis.map((category, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{category.category}</h4>
                  {category.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                  {category.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                  {category.trend === "stable" && <div className="h-4 w-4 bg-gray-300 rounded-full" />}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Margem</span>
                    <span className="font-medium text-green-600">{category.margin}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Volume</span>
                    <span className="font-medium">{category.volume}%</span>
                  </div>
                  <Progress value={category.volume} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
