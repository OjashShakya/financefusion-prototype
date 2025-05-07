"use client"

import { PiggyBank, Settings, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { useAuth } from "@/src/context/AuthContext"
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
    <header className={`fixed top-0 right-0 z-10 flex h-[100px] items-center gap-4 border-b border-[#e2e8f0] dark:border-[#4e4e4e] bg-[#f9f9f9] dark:bg-[#131313] px-4 sm:px-6 transition-all duration-300 ${isSidebarCollapsed ? 'left-[80px]' : 'left-[320px]'}`}>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-gray-900 dark:text-white"
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      >
        <Menu className="h-6 w-6" />
      </Button>
      <div className="hidden md:block">
        <h1 className="ml-[24px] text-[28px] font-medium text-gray-900 dark:text-white">{getTitle()}</h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="rounded-[16px] border border-[#e2e8f0] dark:border-[#4e4e4e] p-[12px] flex items-center gap-[12px] h-[56px] w-[56px] bg-[#f9f9f9] dark:bg-[#131313]">
          <ModeToggle />
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-[#e2e8f0] dark:border-[#4e4e4e]">
            <AvatarImage src={user?.avatar} alt={user?.fullname || "User"} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.fullname?.split(" ").map((n) => n[0]).join("") || "U"}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-[20px] font-400 tracking-tight text-gray-900 dark:text-white">
            {user?.fullname || "Username"}
          </h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild> 
            <Button variant="ghost" className="relative h-8 w-8 rounded-full text-gray-900 dark:text-white">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-[#f9f9f9] dark:bg-[#131313] border-[#e2e8f0] dark:border-[#4e4e4e]" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-gray-900 dark:text-white">{user?.fullname}</p>
                <p className="text-xs leading-none text-gray-500 dark:text-[#4e4e4e]">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#e2e8f0] dark:bg-[#4e4e4e]" />
            <DropdownMenuItem className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#4e4e4e]">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#e2e8f0] dark:bg-[#4e4e4e]" />
            <DropdownMenuItem className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#4e4e4e]" onClick={logout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

