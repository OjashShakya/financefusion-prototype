"use client"

import { BarChart, Wallet, Banknote, Home, PiggyBank, PanelLeft, ChartPie, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/app/context/AuthContext"
import Image from "next/image"
import mainLogo from "../../app/assets/mainLogo.png"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"


interface FinanceSidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

export function FinanceSidebar({ activeView, setActiveView }: FinanceSidebarProps) {
  const { user, logout } = useAuth()

  return (
    <div className="flex h-screen w-[320px] flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex h-14 items-center px-4 mt-[40px]">
        <div className="flex items-center">
          <Image 
            src={mainLogo} 
            alt="Finance Fusion Logo" 
            width={198} 
            height={100} 
            className="object-contain"
          />
        <PanelLeft className="h-21 w-21 ml-[40px]" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2 mt-[53px]">
        <Button
          variant={activeView === "dashboard" ? "secondary" : "ghost"}
          className="w-[290px] h-[48px] rounded-lg hover:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] active:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] gap-3 text-[22px] font-normal justify-start"
          onClick={() => setActiveView("dashboard")}
        >
          <Home className="h-[21px] w-[21px] !min-w-[21px] !min-h-[21px] !max-w-[21px] !max-h-[21px]" />
          Dashboard
        </Button>
        <Button
          variant={activeView === "expenses" ? "secondary" : "ghost"}
          className="w-[290px] h-[48px] rounded-lg hover:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] active:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] gap-3 text-[22px] font-normal justify-start"
          onClick={() => setActiveView("expenses")}
        >
          <Banknote className="h-[25px] w-[28px] !min-w-[28px] !min-h-[25px] !max-w-[30px] !max-h-[25px]" />
          Expenses
        </Button>
        <Button
          variant={activeView === "income" ? "secondary" : "ghost"}
          className="w-[290px] h-[48px] rounded-lg hover:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] active:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] gap-3 text-[22px] font-normal justify-start"
          onClick={() => setActiveView("income")}
        >
          <BarChart className="h-[21px] w-[21px] !min-w-[21px] !min-h-[21px] !max-w-[21px] !max-h-[21px]" />
          Income
        </Button>
        <Button
          variant={activeView === "budgeting" ? "secondary" : "ghost"}
          className="w-[290px] h-[48px] rounded-lg hover:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] active:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] gap-3 text-[22px] font-normal justify-start"
          onClick={() => setActiveView("budgeting")}
        >
          <ChartPie className="h-[21px] w-[21px] !min-w-[21px] !min-h-[21px] !max-w-[21px] !max-h-[21px]" />
          Budget
        </Button>
        <Button
          variant={activeView === "savings" ? "secondary" : "ghost"}
          className="w-[290px] h-[48px] rounded-lg hover:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] active:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] gap-3 text-[22px] font-normal justify-start"
          onClick={() => setActiveView("savings")}
        >
          <Wallet className="h-[21px] w-[21px] !min-w-[21px] !min-h-[21px] !max-w-[21px] !max-h-[21px]" />
          Savings Goals
        </Button>
      </nav>

      {/* User */}
      <div className="border-t p-4">
        <div className="flex items-center gap-[12px] bg-gray-50 rounded-[16px] p-[12px] border-[1.5px]">
          <Avatar className="h-[44px] w-[44px]">
            <AvatarFallback>
              {user?.fullname?.split(" ").map((n) => n[0]).join("") || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <div className="flex items-center gap-2">
              <div className="truncate text-[20px] font-medium text-gray-700">{user?.fullname || "Username"}</div>
            </div>
            <div className="truncate text-[14px] text-gray-500">{user?.email || "Email"}</div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center justify-center rounded-lg border p-2 hover:bg-gray-100 cursor-pointer">
                <Settings className="h-5 w-5 text-gray-500" />
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

