"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface ProjectSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectSelectionModal({ open, onOpenChange }: ProjectSelectionModalProps) {
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedProcess, setSelectedProcess] = useState("")
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const router = useRouter()

  const countries = [
    { code: "AO", name: "Angola" },
    { code: "PT", name: "Portugal" },
    { code: "MZ", name: "Moçambique" },
    { code: "GH", name: "Gana" },
  ]

  const processes = [
    { id: "92114", name: "Edifício Metrópolis", country: "AO" },
    { id: "92118", name: "Shoprite Saurimo", country: "AO" },
    { id: "92117", name: "Condomínio Saurimo", country: "AO" },
    { id: "92116", name: "Torre Cidadela", country: "MZ" },
    { id: "92115", name: "Edifício Matacuane", country: "MZ" },
    { id: "92112", name: "Shopping Nova Vida (M-O)", country: "AO" },
    { id: "92111", name: "Centro Treinos e Repouso do HCSPR", country: "AO" },
    { id: "92110", name: "Centro Médico e de Socorro da Total", country: "AO" },
  ]

  const specialties = [
    { code: "ÁGUAS", name: "Águas e Saneamento", color: "bg-blue-100 text-blue-800" },
    { code: "AVAC", name: "Aquecimento, Ventilação e Ar Condicionado", color: "bg-green-100 text-green-800" },
    { code: "IE", name: "Instalações Elétricas", color: "bg-yellow-100 text-yellow-800" },
  ]

  const filteredProcesses = processes.filter((p) => !selectedCountry || p.country === selectedCountry)

  const handleSpecialtyToggle = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty],
    )
  }

  const handleContinue = () => {
    if (selectedProcess) {
      router.push(`/projects/${selectedProcess}`)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configuração - Seleção de Projeto</DialogTitle>
          <DialogDescription>
            Selecione o país, processo e especialidades para visualizar o articulado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Seleção de País */}
          <div className="space-y-2">
            <label className="text-sm font-medium">País</label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o país" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Seleção de Processo */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Processo | Descrição</label>
            <Select value={selectedProcess} onValueChange={setSelectedProcess} disabled={!selectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o processo" />
              </SelectTrigger>
              <SelectContent>
                {filteredProcesses.map((process) => (
                  <SelectItem key={process.id} value={process.id}>
                    {process.id} - {process.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Especialidades */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Especialidades</label>
            <div className="grid grid-cols-1 gap-2">
              {specialties.map((specialty) => (
                <Card
                  key={specialty.code}
                  className={`cursor-pointer transition-colors ${
                    selectedSpecialties.includes(specialty.code) ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => handleSpecialtyToggle(specialty.code)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={specialty.color}>{specialty.code}</Badge>
                        <span className="text-sm">{specialty.name}</span>
                      </div>
                      {selectedSpecialties.includes(specialty.code) && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Resumo da Seleção */}
          {selectedCountry && selectedProcess && (
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Seleção Atual:</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>País:</strong> {countries.find((c) => c.code === selectedCountry)?.name}
                  </p>
                  <p>
                    <strong>Processo:</strong> {filteredProcesses.find((p) => p.id === selectedProcess)?.name}
                  </p>
                  {selectedSpecialties.length > 0 && (
                    <p>
                      <strong>Especialidades:</strong>{" "}
                      {selectedSpecialties.map((s) => specialties.find((spec) => spec.code === s)?.name).join(", ")}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleContinue} disabled={!selectedProcess}>
            Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
