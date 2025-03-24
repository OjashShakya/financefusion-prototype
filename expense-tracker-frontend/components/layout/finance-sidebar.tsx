"use client"

import { BarChart3, CreditCard, DollarSign, Home, PiggyBank, Menu, LogOut, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/components/auth/auth-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FinanceSidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

export function FinanceSidebar({ activeView, setActiveView }: FinanceSidebarProps) {
  const { toggleSidebar, state } = useSidebar()
  const { user, logout } = useAuth()

  return (
    <Sidebar collapsible="icon" className="hidden md:flex">
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <PiggyBank className="h-6 w-6 flex-shrink-0 text-primary" />
            <span className="font-semibold truncate">FinanceTracker</span>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8 flex-shrink-0">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setActiveView("dashboard")}
              isActive={activeView === "dashboard"}
              tooltip="Dashboard"
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setActiveView("expenses")}
              isActive={activeView === "expenses"}
              tooltip="Expenses"
            >
              <CreditCard className="h-4 w-4" />
              <span>Expenses</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setActiveView("income")}
              isActive={activeView === "income"}
              tooltip="Income"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Income</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setActiveView("budgeting")}
              isActive={activeView === "budgeting"}
              tooltip="Budgeting"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Budgeting</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setActiveView("savings")}
              isActive={activeView === "savings"}
              tooltip="Savings Goals"
            >
              <DollarSign className="h-4 w-4" />
              <span>Savings Goals</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className={`flex items-center gap-2 ${state === "collapsed" ? "justify-center" : ""}`}>
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt={user?.name || "User"} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          {state !== "collapsed" && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{user?.name}</span>
              <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
            </div>
          )}

          {state !== "collapsed" ? (
            <Button variant="ghost" size="icon" className="ml-auto flex-shrink-0" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-auto flex-shrink-0" onClick={logout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Logout</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

