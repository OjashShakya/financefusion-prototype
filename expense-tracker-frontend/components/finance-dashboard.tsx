import { useToast } from "@/hooks/use-toast"
import type { SavingsGoal } from "@/types/finance"

interface FinanceDashboardProps {
  savingsGoals: SavingsGoal[]
  fetchSavingsGoals: () => Promise<void>
  updateSavingsGoal: (id: string, amount: number) => Promise<void>
}

export function FinanceDashboard({ savingsGoals, fetchSavingsGoals, updateSavingsGoal }: FinanceDashboardProps) {
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

  return null // Add your dashboard UI here
} 