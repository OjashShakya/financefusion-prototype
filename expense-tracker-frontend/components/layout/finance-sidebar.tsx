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
    <div className={`fixed top-0 left-0 h-screen flex flex-col border-r border-[#e2e8f0] dark:border-[#4e4e4e] bg-[#f9f9f9] dark:bg-[#131313] text-gray-900 dark:text-white transition-all duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[320px]'}`}>
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
          className="p-2 hover:bg-gray-100 dark:hover:bg-[#4e4e4e] rounded-lg transition-colors text-gray-900 dark:text-white"
        >
          {isCollapsed ? <PanelRightClose size={24} /> : <PanelRightOpen size={24} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 px-4 mt-16">
        <Button
          variant={activeView === "dashboard" ? "secondary" : "ghost"}
          className={`h-[48px] rounded-lg hover:bg-gray-100 dark:hover:bg-[#4e4e4e] gap-3 text-[22px] font-normal justify-start text-gray-900 dark:text-white ${isCollapsed ? 'w-[48px] px-2' : 'w-[290px]'} ${activeView === "dashboard" ? 'border border-[#e2e8f0] dark:border-[#4e4e4e]' : ''}`}
          onClick={() => setActiveView("dashboard")}
        >
          <Home className="h-[21px] w-[21px] !min-w-[21px] !min-h-[21px] !max-w-[21px] !max-h-[21px]" />
          {!isCollapsed && "Dashboard"}
        </Button>
        <Button
          variant={activeView === "expenses" ? "secondary" : "ghost"}
          className={`h-[48px] rounded-lg hover:bg-gray-100 dark:hover:bg-[#4e4e4e] gap-3 text-[22px] font-normal justify-start text-gray-900 dark:text-white ${isCollapsed ? 'w-[48px] px-2' : 'w-[290px]'} ${activeView === "expenses" ? 'border border-[#e2e8f0] dark:border-[#4e4e4e]' : ''}`}
          onClick={() => setActiveView("expenses")}
        >
          <Banknote className="h-[25px] w-[28px] !min-w-[28px] !min-h-[25px] !max-w-[30px] !max-h-[25px]" />
          {!isCollapsed && "Expenses"}
        </Button>
        <Button
          variant={activeView === "income" ? "secondary" : "ghost"}
          className={`h-[48px] rounded-lg hover:bg-gray-100 dark:hover:bg-[#4e4e4e] gap-3 text-[22px] font-normal justify-start text-gray-900 dark:text-white ${isCollapsed ? 'w-[48px] px-2' : 'w-[290px]'} ${activeView === "income" ? 'border border-[#e2e8f0] dark:border-[#4e4e4e]' : ''}`}
          onClick={() => setActiveView("income")}
        >
          <BarChart className="h-[21px] w-[21px] !min-w-[21px] !min-h-[21px] !max-w-[21px] !max-h-[21px]" />
          {!isCollapsed && "Income"}
        </Button>
        <Button
          variant={activeView === "budgeting" ? "secondary" : "ghost"}
          className={`h-[48px] rounded-lg hover:bg-gray-100 dark:hover:bg-[#4e4e4e] gap-3 text-[22px] font-normal justify-start text-gray-900 dark:text-white ${isCollapsed ? 'w-[48px] px-2' : 'w-[290px]'} ${activeView === "budgeting" ? 'border border-[#e2e8f0] dark:border-[#4e4e4e]' : ''}`}
          onClick={() => setActiveView("budgeting")}
        >
          <ChartPie className="h-[21px] w-[21px] !min-w-[21px] !min-h-[21px] !max-w-[21px] !max-h-[21px]" />
          {!isCollapsed && "Budget"}
        </Button>
        <Button
          variant={activeView === "savings" ? "secondary" : "ghost"}
          className={`h-[48px] rounded-lg hover:bg-gray-100 dark:hover:bg-[#4e4e4e] gap-3 text-[22px] font-normal justify-start text-gray-900 dark:text-white ${isCollapsed ? 'w-[48px] px-2' : 'w-[290px]'} ${activeView === "savings" ? 'border border-[#e2e8f0] dark:border-[#4e4e4e]' : ''}`}
          onClick={() => setActiveView("savings")}
        >
          <Wallet className="h-[21px] w-[21px] !min-w-[21px] !min-h-[21px] !max-w-[21px] !max-h-[21px]" />
          {!isCollapsed && "Savings Goals"}
        </Button>
      </nav>

      {/* User */}
      <div className="border-t border-[#e2e8f0] dark:border-[#4e4e4e] p-4 mt-auto">
        <div className={`flex items-center gap-[12px] bg-gray-100 dark:bg-[#131313] text-gray-900 dark:text-white rounded-[16px] p-[12px] border border-[#e2e8f0] dark:border-[#4e4e4e] ${isCollapsed ? 'justify-center p-2' : ''}`}>
          <Avatar className={`${isCollapsed ? 'h-[36px] w-[36px]' : 'h-[44px] w-[44px]'}`}>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.fullname?.split(" ").map((n) => n[0]).join("") || "U"}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 truncate">
              <div className="flex items-center gap-2">
                <div className="truncate text-[20px] font-medium text-gray-900 dark:text-white">{user?.fullname || "Username"}</div>
              </div>
              <div className="truncate text-[14px] text-gray-500 dark:text-[#4e4e4e]">{user?.email || "Email"}</div>
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className={`flex items-center justify-center rounded-lg border border-[#e2e8f0] dark:border-[#4e4e4e] p-2 hover:bg-gray-100 dark:hover:bg-[#4e4e4e] cursor-pointer ${isCollapsed ? 'p-1.5' : ''}`}>
                <Settings className={`${isCollapsed ? 'h-4 w-4' : 'h-5 w-5'} text-gray-500 dark:text-[#4e4e4e]`} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white dark:bg-[#131313] border-[#e2e8f0] dark:border-[#4e4e4e]" align="end" forceMount>
              <DropdownMenuItem className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#4e4e4e]" onClick={logout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

