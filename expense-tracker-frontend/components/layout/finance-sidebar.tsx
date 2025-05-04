"use client"

import { BarChart, Wallet, Banknote, Home, PiggyBank, PanelLeft, ChartPie, Settings, PanelRightClose, PanelRightOpen} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/src/context/AuthContext"
import Image from "next/image"
import mainLogo from "../../app/assets/mainLogo.png"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface FinanceSidebarProps {
  activeView: string
  setActiveView: (view: string) => void
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

export function FinanceSidebar({ activeView, setActiveView, isCollapsed, setIsCollapsed }: FinanceSidebarProps) {
  const { user, logout } = useAuth()

  return (
    <div className={`fixed top-0 left-0 h-screen flex flex-col border-r bg-[#f9f9f9] transition-all duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[320px]'}`}>
      {/* Logo */}
      <div className="flex mt-[32px] h-[60px] items-center px-4 justify-between">
        <div className={`flex items-center ${isCollapsed ? 'hidden' : ''}`}>
          <Image 
            src={mainLogo} 
            alt="Finance Fusion Logo" 
            width={isCollapsed ? 40 : 198} 
            height={isCollapsed ? 40 : 100} 
            className="object-contain"
          />
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isCollapsed ? <PanelRightClose size={24} /> : <PanelRightOpen size={24} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2 mt-[53px]">
        <Button
          variant={activeView === "dashboard" ? "secondary" : "ghost"}
          className={`h-[48px] rounded-lg hover:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] active:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] gap-3 text-[22px] font-normal justify-start ${isCollapsed ? 'w-[48px] px-2' : 'w-[290px]'}`}
          onClick={() => setActiveView("dashboard")}
        >
          <Home className="h-[21px] w-[21px] !min-w-[21px] !min-h-[21px] !max-w-[21px] !max-h-[21px]" />
          {!isCollapsed && "Dashboard"}
        </Button>
        <Button
          variant={activeView === "expenses" ? "secondary" : "ghost"}
          className={`h-[48px] rounded-lg hover:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] active:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] gap-3 text-[22px] font-normal justify-start ${isCollapsed ? 'w-[48px] px-2' : 'w-[290px]'}`}
          onClick={() => setActiveView("expenses")}
        >
          <Banknote className="h-[25px] w-[28px] !min-w-[28px] !min-h-[25px] !max-w-[30px] !max-h-[25px]" />
          {!isCollapsed && "Expenses"}
        </Button>
        <Button
          variant={activeView === "income" ? "secondary" : "ghost"}
          className={`h-[48px] rounded-lg hover:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] active:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] gap-3 text-[22px] font-normal justify-start ${isCollapsed ? 'w-[48px] px-2' : 'w-[290px]'}`}
          onClick={() => setActiveView("income")}
        >
          <BarChart className="h-[21px] w-[21px] !min-w-[21px] !min-h-[21px] !max-w-[21px] !max-h-[21px]" />
          {!isCollapsed && "Income"}
        </Button>
        <Button
          variant={activeView === "budgeting" ? "secondary" : "ghost"}
          className={`h-[48px] rounded-lg hover:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] active:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] gap-3 text-[22px] font-normal justify-start ${isCollapsed ? 'w-[48px] px-2' : 'w-[290px]'}`}
          onClick={() => setActiveView("budgeting")}
        >
          <ChartPie className="h-[21px] w-[21px] !min-w-[21px] !min-h-[21px] !max-w-[21px] !max-h-[21px]" />
          {!isCollapsed && "Budget"}
        </Button>
        <Button
          variant={activeView === "savings" ? "secondary" : "ghost"}
          className={`h-[48px] rounded-lg hover:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] active:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] gap-3 text-[22px] font-normal justify-start ${isCollapsed ? 'w-[48px] px-2' : 'w-[290px]'}`}
          onClick={() => setActiveView("savings")}
        >
          <Wallet className="h-[21px] w-[21px] !min-w-[21px] !min-h-[21px] !max-w-[21px] !max-h-[21px]" />
          {!isCollapsed && "Savings Goals"}
        </Button>
      </nav>

      {/* User */}
      <div className="border-t p-4 mt-auto">
        <div className={`flex items-center gap-[12px] bg-gray-50 rounded-[16px] p-[12px] border-[1.5px] ${isCollapsed ? 'justify-center p-2' : ''}`}>
          <Avatar className={`${isCollapsed ? 'h-[36px] w-[36px]' : 'h-[44px] w-[44px]'}`}>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.fullname?.split(" ").map((n) => n[0]).join("") || "U"}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 truncate">
              <div className="flex items-center gap-2">
                <div className="truncate text-[20px] font-medium text-gray-700">{user?.fullname || "Username"}</div>
              </div>
              <div className="truncate text-[14px] text-gray-500">{user?.email || "Email"}</div>
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className={`flex items-center justify-center rounded-lg border p-2 hover:bg-gray-100 cursor-pointer ${isCollapsed ? 'p-1.5' : ''}`}>
                <Settings className={`${isCollapsed ? 'h-4 w-4' : 'h-5 w-5'} text-gray-500`} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

