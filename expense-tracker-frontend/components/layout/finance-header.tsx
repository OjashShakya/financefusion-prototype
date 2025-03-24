"use client"

import { PiggyBank, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { useAuth } from "@/components/auth/auth-context"
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
}

export function FinanceHeader({ activeView }: FinanceHeaderProps) {
  const { user, logout } = useAuth()

  const getTitle = () => {
    switch (activeView) {
      case "dashboard":
        return "Financial Dashboard"
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
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 px-4 sm:px-6 lg:h-[60px] backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="md:hidden" />
      <div className="md:hidden flex items-center gap-2">
        <PiggyBank className="h-6 w-6" />
        <span className="font-semibold">FinanceTracker</span>
      </div>
      <div className="hidden md:block">
        <h1 className="text-xl font-semibold">{getTitle()}</h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
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

