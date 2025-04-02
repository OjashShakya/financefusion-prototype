"use client"

import { PiggyBank, Settings, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { useAuth } from "@/app/context/AuthContext"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FinanceHeaderProps {
  activeView: string
  isSidebarCollapsed: boolean
  setIsSidebarCollapsed: (collapsed: boolean) => void
}

export function FinanceHeader({ activeView, isSidebarCollapsed, setIsSidebarCollapsed }: FinanceHeaderProps) {
  const { user, logout } = useAuth()

  const getTitle = () => {
    switch (activeView) {
      case "dashboard":
        return "Dashboard"
      case "expenses":
        return "Expense Management"
      case "income":
        return "Income Tracking"
      case "budgeting":
        return "Budget Planning"
      case "savings":
        return "Savings Goals"
      default:
        return "FinanceTracker"
    }
  }

  return (
    <header className={`fixed top-0 right-0 z-10 flex h-[100px] items-center gap-4 border-b bg-[#f9f9f9] px-4 sm:px-6 transition-all duration-300 ${isSidebarCollapsed ? 'left-[80px]' : 'left-[320px]'}`}>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      >
        <Menu className="h-6 w-6" />
      </Button>
      <div className="md:hidden flex items-center gap-2">
        <PiggyBank className="h-6 w-6" />
        <span className="font-semibold">FinanceTracker</span>
      </div>
      <div className="hidden md:block">
        <h1 className="text-[28px] font-semibold">{getTitle()}</h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="rounded-[16px] border border-[1.5px] p-[12px] flex items-center gap-[12px] h-[56px] w-[56px]">
          <ModeToggle />
        </div>
        <h1 className="text-[20px] font-400 tracking-tight">
          {user?.fullname || "Username"}
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild> 
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.fullname || "User"} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.fullname?.split(" ").map((n) => n[0]).join("") || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.fullname}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

