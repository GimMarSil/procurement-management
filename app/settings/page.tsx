"use client"

import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Settings, Mail, Bell, Database, Shield, Palette, Save, RefreshCw, AlertTriangle } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Configurações Gerais
    companyName: "Ramos Ferreira",
    defaultCountry: "AO",
    defaultCurrency: "EUR",
    minMargin: 15,
    maxRFQDays: 30,

    // Configurações de Email
    smtpServer: "smtp.office365.com",
    smtpPort: 587,
    emailSender: "compras@ramosferreira.com",
    emailTemplate: "template_default",

    // Notificações
    emailNotifications: true,
    rfqReminders: true,
    marginAlerts: true,
    overdueAlerts: true,

    // Integração PHC
    phcApiUrl: "https://api.phc.pt/v1",
    phcApiKey: "****-****-****-****",
    autoSync: true,
    syncInterval: 60,

    // Interface
    theme: "light",
    language: "pt",
    dateFormat: "dd/MM/yyyy",
    numberFormat: "european",
  })

  const handleSave = () => {
    // Simular salvamento
    toast({ title: "Configurações salvas" })
  }

  const handleReset = () => {
    // Simular reset
    toast({ title: "Configurações restauradas" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Gerir parâmetros globais do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Restaurar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="phc">Integração PHC</TabsTrigger>
          <TabsTrigger value="interface">Interface</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>Parâmetros básicos do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input
                    id="companyName"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultCountry">País Padrão</Label>
                  <Select
                    value={settings.defaultCountry}
                    onValueChange={(value) => setSettings({ ...settings, defaultCountry: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AO">Angola</SelectItem>
                      <SelectItem value="PT">Portugal</SelectItem>
                      <SelectItem value="MZ">Moçambique</SelectItem>
                      <SelectItem value="GH">Gana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency">Moeda Padrão</Label>
                  <Select
                    value={settings.defaultCurrency}
                    onValueChange={(value) => setSettings({ ...settings, defaultCurrency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="USD">Dólar ($)</SelectItem>
                      <SelectItem value="AOA">Kwanza (Kz)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minMargin">Margem Mínima (%)</Label>
                  <Input
                    id="minMargin"
                    type="number"
                    value={settings.minMargin}
                    onChange={(e) => setSettings({ ...settings, minMargin: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxRFQDays">Prazo Máximo RFQ (dias)</Label>
                <Input
                  id="maxRFQDays"
                  type="number"
                  value={settings.maxRFQDays}
                  onChange={(e) => setSettings({ ...settings, maxRFQDays: Number(e.target.value) })}
                  className="w-48"
                />
                <p className="text-sm text-muted-foreground">Prazo padrão para resposta de fornecedores</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Configurações de Email
              </CardTitle>
              <CardDescription>Configurar servidor SMTP e templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpServer">Servidor SMTP</Label>
                  <Input
                    id="smtpServer"
                    value={settings.smtpServer}
                    onChange={(e) => setSettings({ ...settings, smtpServer: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">Porta SMTP</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={settings.smtpPort}
                    onChange={(e) => setSettings({ ...settings, smtpPort: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailSender">Email Remetente</Label>
                <Input
                  id="emailSender"
                  type="email"
                  value={settings.emailSender}
                  onChange={(e) => setSettings({ ...settings, emailSender: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailTemplate">Template Padrão</Label>
                <Select
                  value={settings.emailTemplate}
                  onValueChange={(value) => setSettings({ ...settings, emailTemplate: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="template_default">Template Padrão</SelectItem>
                    <SelectItem value="template_formal">Template Formal</SelectItem>
                    <SelectItem value="template_simple">Template Simples</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Teste de Configuração</Label>
                <div className="flex gap-2">
                  <Button variant="outline">Testar Conexão</Button>
                  <Button variant="outline">Enviar Email Teste</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
              </CardTitle>
              <CardDescription>Configurar alertas e lembretes automáticos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">Receber notificações gerais por email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Lembretes de RFQ</Label>
                  <p className="text-sm text-muted-foreground">Alertas sobre prazos de RFQs pendentes</p>
                </div>
                <Switch
                  checked={settings.rfqReminders}
                  onCheckedChange={(checked) => setSettings({ ...settings, rfqReminders: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertas de Margem</Label>
                  <p className="text-sm text-muted-foreground">Notificar quando margem estiver abaixo do mínimo</p>
                </div>
                <Switch
                  checked={settings.marginAlerts}
                  onCheckedChange={(checked) => setSettings({ ...settings, marginAlerts: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertas de Vencimento</Label>
                  <p className="text-sm text-muted-foreground">Notificar sobre RFQs vencidos</p>
                </div>
                <Switch
                  checked={settings.overdueAlerts}
                  onCheckedChange={(checked) => setSettings({ ...settings, overdueAlerts: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Integração PHC
              </CardTitle>
              <CardDescription>Configurar conexão com ERP PHC</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phcApiUrl">URL da API PHC</Label>
                <Input
                  id="phcApiUrl"
                  value={settings.phcApiUrl}
                  onChange={(e) => setSettings({ ...settings, phcApiUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phcApiKey">Chave da API</Label>
                <Input
                  id="phcApiKey"
                  type="password"
                  value={settings.phcApiKey}
                  onChange={(e) => setSettings({ ...settings, phcApiKey: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sincronização Automática</Label>
                  <p className="text-sm text-muted-foreground">Sincronizar dados automaticamente com PHC</p>
                </div>
                <Switch
                  checked={settings.autoSync}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoSync: checked })}
                />
              </div>

              {settings.autoSync && (
                <div className="space-y-2">
                  <Label htmlFor="syncInterval">Intervalo de Sincronização (minutos)</Label>
                  <Input
                    id="syncInterval"
                    type="number"
                    value={settings.syncInterval}
                    onChange={(e) => setSettings({ ...settings, syncInterval: Number(e.target.value) })}
                    className="w-48"
                  />
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <Label>Estado da Conexão</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Conectado
                  </Badge>
                  <Button variant="outline" size="sm">
                    Testar Conexão
                  </Button>
                  <Button variant="outline" size="sm">
                    Sincronizar Agora
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interface" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Interface
              </CardTitle>
              <CardDescription>Personalizar aparência e formato</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tema</Label>
                  <Select value={settings.theme} onValueChange={(value) => setSettings({ ...settings, theme: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="auto">Automático</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => setSettings({ ...settings, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt">Português</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Formato de Data</Label>
                  <Select
                    value={settings.dateFormat}
                    onValueChange={(value) => setSettings({ ...settings, dateFormat: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                      <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                      <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Formato de Números</Label>
                  <Select
                    value={settings.numberFormat}
                    onValueChange={(value) => setSettings({ ...settings, numberFormat: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="european">Europeu (1.234,56)</SelectItem>
                      <SelectItem value="american">Americano (1,234.56)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança
              </CardTitle>
              <CardDescription>Configurações de segurança e auditoria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticação de Dois Fatores</Label>
                    <p className="text-sm text-muted-foreground">Ativar 2FA para maior segurança</p>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Log de Auditoria</Label>
                    <p className="text-sm text-muted-foreground">Registar todas as ações dos utilizadores</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sessão Automática</Label>
                    <p className="text-sm text-muted-foreground">Terminar sessão após inatividade</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Backup de Dados</Label>
                <div className="flex gap-2">
                  <Button variant="outline">Criar Backup</Button>
                  <Button variant="outline">Restaurar Backup</Button>
                  <Button variant="outline">Agendar Backup</Button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Aviso de Segurança</h4>
                    <p className="text-sm text-yellow-700">
                      Certifique-se de que todas as configurações de segurança estão ativas antes de usar o sistema em
                      produção.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
