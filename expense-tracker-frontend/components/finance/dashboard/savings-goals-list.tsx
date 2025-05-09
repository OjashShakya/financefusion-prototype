"use client"

import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import type { SavingsGoal } from "@/types/finance"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"
import Cookies from "js-cookie"

interface SavingsGoalsListProps {
  goals: SavingsGoal[]
  updateSavingsGoal: (id: string, amount: number) => void
  setActiveView: (view: string) => void
  onDelete: (id: string) => void
}

export function SavingsGoalsList({ goals, updateSavingsGoal, setActiveView, onDelete }: SavingsGoalsListProps) {
  const [contributions, setContributions] = useState<Record<string, string>>({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDeleteClick = (goalId: string) => {
    setGoalToDelete(goalId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (goalToDelete) {
      onDelete(goalToDelete)
      setDeleteDialogOpen(false)
      setGoalToDelete(null)
    }
  }

  const handleContribution = async (goalId: string) => {
    const amount = contributions[goalId]
    const newAmount = Number(amount || "0")
    if (!amount || isNaN(newAmount) || newAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    const goal = goals.find((g) => g.id === goalId)
    if (!goal) return

    // Check if goal is already at 100%
    const currentPercentage = (goal.initial_amount / goal.target_amount) * 100
    if (currentPercentage >= 100) {
      toast({
        title: "Goal Completed",
        description: `Congratulations! You have already reached your savings goal for ${goal.name}.`,
        variant: "success",
        duration: 5000,
      })
      return
    }

    // Check if user has enough available income
    const availableIncome = Cookies.get('availableIncome')
    const availableIncomeNum = Number(availableIncome || "0")
    
    if (!availableIncome || availableIncomeNum <= 0) {
      toast({
        title: "Saving Failed",
        description: "You don't have enough available income to save. Please add income first.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Check if contribution amount is greater than available income
    if (newAmount > availableIncomeNum) {
      toast({
        title: "Saving Failed",
        description: `You can only save up to Rs. ${availableIncomeNum.toFixed(2)} as you cannot save more than your remaining income`,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Check if contribution amount exceeds remaining amount
    const remaining = goal.target_amount - goal.initial_amount;
    if (newAmount > remaining) {
      toast({
        title: "Saving Failed",
        description: `You cannot add more than the remaining amount (Rs. ${remaining.toFixed(2)}). Please enter a smaller amount.`,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      updateSavingsGoal(goalId, newAmount)
      setContributions(prev => ({
        ...prev,
        [goalId]: ""
      }))

      // Update available income in localStorage
      const newAvailableIncome = availableIncomeNum - newAmount
      Cookies.set('availableIncome', newAvailableIncome.toString())

      const newTotal = goal.initial_amount + newAmount
      const newPercentage = (newTotal / goal.target_amount) * 100
      const newRemaining = goal.target_amount - newTotal

      // Check if goal is now complete
      if (newPercentage >= 100) {
        toast({
          title: "Congratulations! 🎉",
          description: (
            <div className="mt-2">
              <p>You have successfully reached your savings goal for {goal.name}!</p>
              <p className="text-sm text-muted-foreground mt-2">
                Total Saved: Rs. {newTotal.toFixed(2)}
              </p>
            </div>
          ),
          variant: "success",
          duration: 7000,
        })
      } else {
        toast({
          title: "Amount Saved Successfully",
          description: (
            <div className="mt-2">
              <p>Added Rs. {newAmount.toFixed(2)} to {goal.name}</p>
              <p className="text-sm text-muted-foreground">
                Progress: {newPercentage.toFixed(1)}% ({newTotal.toFixed(2)} / {goal.target_amount.toFixed(2)})
              </p>
              <p className="text-sm text-muted-foreground">
                Remaining: Rs. {newRemaining.toFixed(2)}
              </p>
            </div>
          ),
          variant: "success",
          duration: 5000,
        })
      }
    } catch (error) {
      console.error('Error adding contribution:', error)
      toast({
        title: "Error",
        description: "Failed to update savings goal. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  if (goals.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">No savings goals set up yet</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={() => setActiveView("savings")}
        >
          Create Savings Goal
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your savings goal
              {goalToDelete && goals.find(g => g.id === goalToDelete) && ` "${goals.find(g => g.id === goalToDelete)?.name}"`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {goals.slice(0, 4).map((goal) => {
        const percentage = (goal.initial_amount / goal.target_amount) * 100
        const remaining = goal.target_amount - goal.initial_amount
        const targetDate = format(goal.date, "MMM d, yyyy")
        const isComplete = percentage >= 100

        return (
          <div key={goal.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{goal.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Target: Rs. {goal.target_amount.toFixed(2)} by {targetDate}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">Rs. {goal.initial_amount.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">
                  {isComplete ? "Goal Completed! 🎉" : `Rs. ${remaining.toFixed(2)} Remaining`}
                </p>
              </div>
            </div>
            <Progress 
              value={percentage} 
              className="h-2 bg-[#e8f5e9] dark:bg-green-900/20 [&>div]:!bg-[#27ae60]" 
            />
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Amount"
                className="h-8"
                value={contributions[goal.id] || ""}
                onChange={(e) =>
                  setContributions({
                    ...contributions,
                    [goal.id]: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleContribution(goal.id)
                  }
                }}
                disabled={isComplete}
              />
              <Button 
                size="sm" 
                onClick={() => handleContribution(goal.id)}
                disabled={isComplete || !contributions[goal.id] || Number(contributions[goal.id]) <= 0}
                className="rounded-xl bg-[#27ae60] hover:bg-[#2ecc71] dark:bg-[#27ae60] dark:hover:bg-[#2ecc71]"
              >
                {isComplete ? "Completed" : "Add"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteClick(goal.id)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        )
      })}
      {goals.length > 4 && (
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            onClick={() => setActiveView("savings")}
            className="w-full"
          >
            View More
          </Button>
        </div>
      )}
    </div>
  )
} 