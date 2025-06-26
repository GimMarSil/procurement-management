"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"

interface RFQLine {
  id: number
  description: string
  quantity: number
}

interface RFQ {
  id: number
  project: string
  supplier: string
  dueDate: string
  createdAt: string
  lines: RFQLine[]
}

export default function RFQsPage() {
  const [rfqs, setRfqs] = useState<RFQ[]>([])
  const [showNewRFQModal, setShowNewRFQModal] = useState(false)
  const [project, setProject] = useState("")
  const [supplier, setSupplier] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [lines, setLines] = useState([{ description: "", quantity: 1 }])

  const fetchRfqs = async () => {
    const res = await fetch("/api/rfqs")
    const data = await res.json()
    setRfqs(data)
  }

  useEffect(() => {
    fetchRfqs()
  }, [])

  const addLine = () => setLines([...lines, { description: "", quantity: 1 }])

  const updateLine = (idx: number, field: string, value: string) => {
    setLines(
      lines.map((l, i) =>
        i === idx ? { ...l, [field]: field === "quantity" ? Number(value) : value } : l
      )
    )
  }

  const createRfq = async () => {
    await fetch("/api/rfqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project, supplier, dueDate, lines }),
    })
    setProject("")
    setSupplier("")
    setDueDate("")
    setLines([{ description: "", quantity: 1 }])
    setShowNewRFQModal(false)
    fetchRfqs()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">RFQs</h1>
        <Dialog open={showNewRFQModal} onOpenChange={setShowNewRFQModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />Novo RFQ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo RFQ</DialogTitle>
              <DialogDescription>Criar pedido de proposta</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Projeto" value={project} onChange={(e) => setProject(e.target.value)} />
              <Input placeholder="Fornecedor" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              <div className="space-y-2">
                {lines.map((line, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      placeholder="Descrição"
                      value={line.description}
                      onChange={(e) => updateLine(i, "description", e.target.value)}
                    />
                    <Input
                      type="number"
                      className="w-24"
                      value={line.quantity}
                      onChange={(e) => updateLine(i, "quantity", e.target.value)}
                    />
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addLine}>
                  Adicionar Linha
                </Button>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowNewRFQModal(false)}>
                Cancelar
              </Button>
              <Button onClick={createRfq} disabled={!project || !supplier || !dueDate}>
                Criar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>RFQs Criados</CardTitle>
          <CardDescription>Lista de pedidos</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Projeto</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Linhas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfqs.map((rfq) => (
                <TableRow key={rfq.id}>
                  <TableCell>{rfq.id}</TableCell>
                  <TableCell>{rfq.project}</TableCell>
                  <TableCell>{rfq.supplier}</TableCell>
                  <TableCell>{new Date(rfq.dueDate).toLocaleDateString("pt-PT")}</TableCell>
                  <TableCell>{rfq.lines.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
