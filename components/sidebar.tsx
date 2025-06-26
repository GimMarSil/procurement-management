"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  FileText,
  ShoppingCart,
  TrendingUp,
  Settings,
  Building2,
  FileStack,
  MessageSquare,
  BarChart3,
  Award,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Articulado", href: "/articulado", icon: FileStack },
  { name: "Pedidos", href: "/pedidos", icon: FileText },
  { name: "Respostas", href: "/respostas", icon: MessageSquare },
  { name: "Comparativo", href: "/comparativo", icon: BarChart3 },
  { name: "Adjudicações", href: "/adjudicacoes", icon: Award },
  { name: "Projetos", href: "/projects", icon: FolderOpen },
  { name: "RFQs", href: "/rfqs", icon: ShoppingCart },
  { name: "Fornecedores", href: "/suppliers", icon: Users },
  { name: "Análise", href: "/analytics", icon: TrendingUp },
  { name: "Logs", href: "/logs", icon: FileText },
  { name: "Configurações", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-lg font-semibold">Mapa GAP</h1>
            <p className="text-xs text-gray-500">Ramos Ferreira</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-gray-700 hover:bg-gray-50",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-700">GS</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">Gilberto Silva</p>
            <p className="text-xs text-gray-500">Director de Obra</p>
          </div>
        </div>
      </div>
    </div>
  )
}
