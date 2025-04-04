// "use client"

// import { useState } from "react"
// import { format } from "date-fns"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Progress } from "@/components/ui/progress"
// import { useToast } from "@/components/ui/use-toast"
// import type { SavingsGoal } from "@/types/finance"

// interface SavingsGoalsWidgetProps {
//   goals: SavingsGoal[]
//   updateSavingsGoal: (id: string, amount: number) => void
//   setActiveView: (view: string) => void
// }

// export function SavingsGoalsWidget({ goals, updateSavingsGoal, setActiveView }: SavingsGoalsWidgetProps) {
//   const [contributions, setContributions] = useState<Record<string, string>>({})
//   const { toast } = useToast()

//   const handleContribution = async (goalId: string) => {
//     const amount = contributions[goalId]
//     if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
//       toast({
//         title: "Error",
//         description: "Please enter a valid amount greater than 0",
//         variant: "destructive",
//       })
//       return
//     }

//     try {
//       await updateSavingsGoal(goalId, Number(amount))
//       setContributions(prev => ({
//         ...prev,
//         [goalId]: ""
//       }))
//     } catch (error) {
//       console.error('Error adding contribution:', error)
//     }
//   }

//   if (goals.length === 0) {
//     return (
//       <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed">
//         <div className="text-center">
//           <p className="text-sm text-muted-foreground">No savings goals set up yet</p>
//           <Button className="mt-2" variant="outline" onClick={() => setActiveView("savings")}>
//             Create a Savings Goal
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {goals.map((goal) => {
//         const percentage = (goal.initial_amount / goal.target_amount) * 100
//         const remaining = goal.target_amount - goal.initial_amount
//         const targetDate = format(goal.date, "MMM d, yyyy")

//         return (
//           <div key={goal.id} className="space-y-2">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h4 className="font-medium">{goal.name}</h4>
//                 <p className="text-xs text-muted-foreground">
//                   Target: Rs. {goal.target_amount.toFixed(2)} by {targetDate}
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="font-medium">Rs. {goal.initial_amount.toFixed(2)}</p>
//                 <p className="text-xs text-muted-foreground">Rs. {remaining.toFixed(2)} remaining</p>
//               </div>
//             </div>
//             <Progress 
//               value={percentage} 
//               className="h-2" 
//               style={{ 
//                 "--progress-background": `${goal.color}20`,
//                 "--progress-foreground": goal.color,
//               } as React.CSSProperties}
//             />
//             <div className="flex items-center gap-2 pt-1">
//               <Input
//                 type="number"
//                 placeholder="Amount"
//                 className="h-8"
//                 value={contributions[goal.id] || ""}
//                 onChange={(e) =>
//                   setContributions({
//                     ...contributions,
//                     [goal.id]: e.target.value,
//                   })
//                 }
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     handleContribution(goal.id)
//                   }
//                 }}
//               />
//               <Button 
//                 size="sm" 
//                 onClick={() => handleContribution(goal.id)}
//                 disabled={!contributions[goal.id] || Number(contributions[goal.id]) <= 0}
//                 className="rounded-xl bg-[#27ae60] hover:bg-[#2ecc71] dark:bg-[#27ae60] dark:hover:bg-[#2ecc71]"
//               >
//                 Add
//               </Button>
//             </div>
//           </div>
//         )
//       })}

//       <Button variant="outline" className="w-full" onClick={() => setActiveView("savings")}>
//         View All Goals
//       </Button>
//     </div>
//   )
// }

