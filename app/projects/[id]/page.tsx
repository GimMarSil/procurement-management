"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Edit,
  Send,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Euro,
  Package,
  Eye,
  Plus,
} from "lucide-react"
import Link from "next/link"

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showProposalModal, setShowProposalModal] = useState(false)

  // Dados baseados nas imagens fornecidas
  const project = {
    id: params.id,
    name: "Edifício Metrópolis",
    country: "Angola",
    client: "Ramos Ferreira",
    process: "92114",
    targetValue: 9270867.78,
    currentValue: 9247332.63,
    variance: -23535.15,
    variancePercent: -0.25,
    status: "Em Cotação",
    progress: 65,
    startDate: "2024-01-15",
    expectedEnd: "2024-03-30",
    director: "gilberto.silva",
    coordinator: "João Santos",
    description: "Projeto completo do Edifício Metrópolis incluindo todas as especialidades ÁGUAS, AVAC e IE.",
    specialties: ["ÁGUAS", "AVAC", "IE"],
  }

  // Estrutura de custos baseada na imagem
  const costStructure = [
    {
      id: 1,
      company: "RF-PT",
      process: "160073",
      specialty: "IE",
      type: "009-CCTV",
      nature: "1-Materiais",
      totalSale: 99342.29,
      baseSale: 99342.29,
      totalSeco: 78106.61,
      baseSeco: 78106.61,
      totalCost: 16700.0,
      baseCost: 16700.0,
      margin: 61406.61,
      marginPercent: 78.8,
    },
    {
      id: 2,
      company: "RF-PT",
      process: "160073",
      specialty: "IE",
      type: "023-GTC",
      nature: "1-Materiais",
      totalSale: 169724.26,
      baseSale: 169724.26,
      totalSeco: 133445.51,
      baseSeco: 133445.51,
      totalCost: 133445.51,
      baseCost: 133445.51,
      margin: 133445.51,
      marginPercent: 78.6,
    },
    {
      id: 3,
      company: "RF-PT",
      process: "160073",
      specialty: "IE",
      type: "039-Tubos",
      nature: "1-Materiais",
      totalSale: 18131.18,
      baseSale: 18131.18,
      totalSeco: 14149.16,
      baseSeco: 14149.16,
      totalCost: 14149.16,
      baseCost: 14149.16,
      margin: 14149.16,
      marginPercent: 78.0,
    },
    {
      id: 4,
      company: "RF-PT",
      process: "160073",
      specialty: "IE",
      type: "032-Quadros Eléct.",
      nature: "1-Materiais",
      totalSale: 276920.96,
      baseSale: 276920.96,
      totalSeco: 217728.83,
      baseSeco: 217728.83,
      totalCost: 217728.83,
      baseCost: 217728.83,
      margin: 217728.83,
      marginPercent: 78.6,
    },
    {
      id: 5,
      company: "RF-PT",
      process: "160073",
      specialty: "IE",
      type: "026-Ilum. Segurança",
      nature: "1-Materiais",
      totalSale: 45748.92,
      baseSale: 45748.92,
      totalSeco: 35967.94,
      baseSeco: 35967.94,
      totalCost: 35967.94,
      baseCost: 35967.94,
      margin: 35967.94,
      marginPercent: 78.6,
    },
  ]

  // RFQs baseados na imagem de propostas
  const rfqs = [
    {
      id: 1,
      supplier: "FrancAir",
      specialty: "026-Ilum. Segurança",
      items: 15,
      sent: "2024-02-01",
      due: "2024-02-15",
      status: "Respondido",
      value: 32497.22,
      responseDate: "2024-02-10",
    },
    {
      id: 2,
      supplier: "Rexel - Porto",
      specialty: "009-CCTV",
      items: 8,
      sent: "2024-02-01",
      due: "2024-02-15",
      status: "Respondido",
      value: 16700.0,
      responseDate: "2024-02-12",
    },
    {
      id: 3,
      supplier: "Sluz - Gaia",
      specialty: "025-Iluminação Norm",
      items: 12,
      sent: "2024-02-02",
      due: "2024-02-16",
      status: "Pendente",
      value: null,
      responseDate: null,
    },
  ]

  // Propostas detalhadas baseadas na imagem
  const proposals = [
    {
      id: 1,
      supplier: "FrancAir",
      item: "026-Ilum. Segurança",
      description: "Tipo S1",
      unit: "un",
      quantity: 263,
      unitPrice: 80.27,
      totalPrice: 21111.01,
      brand: "Inlhamos ETAP",
      observations: "mais com os K compens | OM, CE4G",
    },
    {
      id: 2,
      supplier: "Rexel - Porto",
      item: "009-CCTV",
      description: "Câmara IP policromática com capacidade de resolução",
      unit: "un",
      quantity: 3,
      unitPrice: 1317.11,
      totalPrice: 3951.33,
      brand: "Inlhamos ETAP",
      observations: "mais com os K compens | OM, CE4G",
    },
    {
      id: 3,
      supplier: "Sluz - Gaia",
      item: "025-Iluminação Norm",
      description: "GEN - Iluminação Normal Geral Vários",
      unit: "un",
      quantity: 45,
      unitPrice: 111.11,
      totalPrice: 4999.95,
      brand: "Inlhamos ETAP",
      observations: "mais com os K compens | OM, CE4G",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Respondido":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Pendente":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {project.process} - {project.name}
          </h1>
          <p className="text-muted-foreground">
            {project.country} • {project.client} • {project.director}
          </p>
          <div className="flex gap-2 mt-2">
            {project.specialties.map((spec) => (
              <Badge key={spec} variant="outline">
                {spec}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Enviar RFQs
          </Button>
        </div>
      </div>

      {/* KPIs do Projeto */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Objetivo DG</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{project.targetValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Valor objetivo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Situação Atual</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{project.currentValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Valor atual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Encargo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${project.variance < 0 ? "text-red-600" : "text-green-600"}`}>
              €{Math.abs(project.variance).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">{project.variancePercent}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.progress}%</div>
            <Progress value={project.progress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="structure">Estrutura Custos</TabsTrigger>
          <TabsTrigger value="rfqs">RFQs</TabsTrigger>
          <TabsTrigger value="proposals">Propostas</TabsTrigger>
          <TabsTrigger value="comparative">Comparativo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">País</label>
                    <p className="text-sm">{project.country}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Processo</label>
                    <p className="text-sm">{project.process}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Diretor de Obra</label>
                    <p className="text-sm">{project.director}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Coordenador</label>
                    <p className="text-sm">{project.coordinator}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data de Início</label>
                  <p className="text-sm">{new Date(project.startDate).toLocaleDateString("pt-PT")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Prazo Previsto</label>
                  <p className="text-sm">{new Date(project.expectedEnd).toLocaleDateString("pt-PT")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                  <p className="text-sm">{project.description}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Financeiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant="secondary">{project.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progresso</span>
                  <span className="text-sm">{project.progress}%</span>
                </div>
                <Progress value={project.progress} />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Valor Objetivo</span>
                  <span className="text-sm font-medium">€{project.targetValue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Situação Atual</span>
                  <span className="text-sm font-medium">€{project.currentValue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Encargo</span>
                  <span className={`text-sm font-medium ${project.variance < 0 ? "text-red-600" : "text-green-600"}`}>
                    €{Math.abs(project.variance).toLocaleString()} ({project.variancePercent}%)
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="structure" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estrutura de Custos</CardTitle>
              <CardDescription>Detalhamento dos custos por especialidade e tipo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Especialidade</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Natureza</TableHead>
                      <TableHead>Venda Total</TableHead>
                      <TableHead>Seco Total</TableHead>
                      <TableHead>Custo Total</TableHead>
                      <TableHead>Margem</TableHead>
                      <TableHead>%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {costStructure.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.company}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.specialty}</Badge>
                        </TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.nature}</TableCell>
                        <TableCell>€{item.totalSale.toLocaleString()}</TableCell>
                        <TableCell>€{item.totalSeco.toLocaleString()}</TableCell>
                        <TableCell>€{item.totalCost.toLocaleString()}</TableCell>
                        <TableCell className="font-medium text-green-600">€{item.margin.toLocaleString()}</TableCell>
                        <TableCell className="font-medium text-green-600">{item.marginPercent}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rfqs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos de Proposta (RFQs)</CardTitle>
              <CardDescription>Acompanhamento dos pedidos enviados aos fornecedores</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Especialidade</TableHead>
                    <TableHead>Itens</TableHead>
                    <TableHead>Data Envio</TableHead>
                    <TableHead>Prazo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valor Proposta</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rfqs.map((rfq) => (
                    <TableRow key={rfq.id}>
                      <TableCell className="font-medium">{rfq.supplier}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rfq.specialty}</Badge>
                      </TableCell>
                      <TableCell>{rfq.items}</TableCell>
                      <TableCell>{new Date(rfq.sent).toLocaleDateString("pt-PT")}</TableCell>
                      <TableCell>{new Date(rfq.due).toLocaleDateString("pt-PT")}</TableCell>
                      <TableCell>
                        <Badge
                          variant={rfq.status === "Respondido" ? "default" : "secondary"}
                          className="flex items-center gap-1 w-fit"
                        >
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
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proposals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Propostas Recebidas</CardTitle>
              <CardDescription>Detalhes das propostas dos fornecedores</CardDescription>
              <div className="flex gap-2">
                <Dialog open={showProposalModal} onOpenChange={setShowProposalModal}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Inserir Proposta
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Inserir Nova Proposta</DialogTitle>
                      <DialogDescription>Registar proposta recebida de fornecedor</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
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
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Valor Total da Proposta</label>
                        <input type="number" className="w-full p-2 border rounded" placeholder="0.00" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setShowProposalModal(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={() => setShowProposalModal(false)}>Inserir Proposta</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Preço Unit.</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Observações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposals.map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell className="font-medium">{proposal.supplier}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{proposal.item}</Badge>
                      </TableCell>
                      <TableCell>{proposal.description}</TableCell>
                      <TableCell>{proposal.unit}</TableCell>
                      <TableCell>{proposal.quantity}</TableCell>
                      <TableCell>€{proposal.unitPrice.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">€{proposal.totalPrice.toLocaleString()}</TableCell>
                      <TableCell>{proposal.brand}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-32 truncate">
                        {proposal.observations}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparative" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comparativo de Propostas</CardTitle>
              <CardDescription>Análise comparativa para apoio à decisão</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Comparativo de propostas será implementado</p>
                <p className="text-sm">Funcionalidade avançada de análise comparativa</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
