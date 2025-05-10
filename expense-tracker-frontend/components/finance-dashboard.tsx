import { useToast } from "@/hooks/use-toast"
import type { SavingsGoal } from "@/types/finance"
import { FinanceSidebar } from "@/components/finance-sidebar"
import { FinanceHeader } from "@/components/finance-header"

interface FinanceDashboardProps {
  savingsGoals: SavingsGoal[]
  fetchSavingsGoals: () => Promise<void>
  updateSavingsGoal: (id: string, amount: number) => Promise<void>
  activeView: string
  setActiveView: (view: string) => void
  isSidebarCollapsed: boolean
  setIsSidebarCollapsed: (collapsed: boolean) => void
}

export function FinanceDashboard({ savingsGoals, fetchSavingsGoals, updateSavingsGoal, activeView, setActiveView, isSidebarCollapsed, setIsSidebarCollapsed }: FinanceDashboardProps) {
  const { toast } = useToast()
  
  const handleUpdateSavingsGoal = async (id: string, amount: number) => {
    try {
      if (amount <= 0) {
        toast({
          title: "Error",
          description: "Amount must be greater than 0",
          variant: "destructive"
        })
        return
      }

      // Get the current savings goal
      const goal = savingsGoals.find((g: SavingsGoal) => g.id === id)
      if (!goal) {
        toast({
          title: "Error",
          description: "Savings goal not found",
          variant: "destructive"
        })
        return
      }

      // Calculate the new total amount
      const newTotal = goal.initial_amount + amount

      // Update the savings goal
      await updateSavingsGoal(id, newTotal)

      // Refresh the savings goals
      await fetchSavingsGoals()
      toast({
        title: "Success",
        description: "Successfully added to savings goal",
        variant: "success"
      })
    } catch (error) {
      console.error('Error updating savings goal:', error)
      toast({
        title: "Error",
        description: "Failed to update savings goal",
        variant: "destructive"
      })
    }
  }

  return (
    <>
      <FinanceSidebar 
        activeView={activeView} 
        setActiveView={setActiveView}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <FinanceHeader 
        activeView={activeView} 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        setActiveView={setActiveView}
      />
    </>
  )
} 