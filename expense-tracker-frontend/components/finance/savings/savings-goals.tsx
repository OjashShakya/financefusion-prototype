"use client"

import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { CalendarIcon, Check, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import type { SavingsGoal } from "@/components/finance-dashboard"

interface SavingsGoalsProps {
  goals: SavingsGoal[]
  onAdd: (goal: Omit<SavingsGoal, "id">) => void
  onUpdate: (id: string, amount: number) => void
  onDelete: (id: string) => void
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#5DADE2", "#48C9B0", "#F4D03F", "#EC7063"]

export function SavingsGoals({ goals, onAdd, onUpdate, onDelete }: SavingsGoalsProps) {
  const form = useForm<Omit<SavingsGoal, "id">>({
    defaultValues: {
      name: "",
      targetAmount: 0,
      currentAmount: 0,
      targetDate: new Date(),
      color: COLORS[0],
    },
  })

  function handleSubmit(data: Omit<SavingsGoal, "id">) {
    onAdd(data)
    toast({
      title: "Savings goal created",
      description: `${data.name}: $${data.targetAmount.toFixed(2)} by ${format(data.targetDate, "MMM d, yyyy")}`,
    })
    form.reset({
      name: "",
      targetAmount: 0,
      currentAmount: 0,
      targetDate: new Date(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    })
  }

  const handleContribution = (goalId: string, amount: string) => {
    const goal = goals.find((g) => g.id === goalId)
    if (!goal) return

    const newAmount = goal.currentAmount + Number.parseFloat(amount || "0")
    if (isNaN(newAmount)) return

    onUpdate(goalId, Math.min(newAmount, goal.targetAmount))

    const input = document.getElementById(`contribution-${goalId}`) as HTMLInputElement
    if (input) input.value = ""

    toast({
      title: "Contribution added",
      description: `$${amount} added to ${goal.name}`,
    })
  }

  return (
    <Tabs defaultValue="list" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="list">Your Goals</TabsTrigger>
        <TabsTrigger value="add">Create Goal</TabsTrigger>
      </TabsList>

      <TabsContent value="list" className="space-y-4 pt-4">
        {goals.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => {
              const percentage = (goal.currentAmount / goal.targetAmount) * 100
              const remaining = goal.targetAmount - goal.currentAmount
              const targetDate = format(goal.targetDate, "MMM d, yyyy")

              return (
                <Card key={goal.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{goal.name}</CardTitle>
                        <CardDescription>
                          Target: ${goal.targetAmount.toFixed(2)} by {targetDate}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(goal.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">${goal.currentAmount.toFixed(2)} saved</span>
                        <span className="text-sm font-medium">{percentage.toFixed(0)}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" indicatorClassName={`bg-[${goal.color}]`} />
                      <p className="text-xs text-muted-foreground">${remaining.toFixed(2)} remaining</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex w-full items-center gap-2">
                      <Input id={`contribution-${goal.id}`} type="number" placeholder="Amount" className="h-8" />
                      <Button
                        size="sm"
                        onClick={() => {
                          const input = document.getElementById(`contribution-${goal.id}`) as HTMLInputElement
                          handleContribution(goal.id, input.value)
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">No savings goals yet</p>
              <p className="text-xs text-muted-foreground mt-1">Create a goal to start saving</p>
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="add" className="space-y-4 pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Create a Savings Goal</CardTitle>
            <CardDescription>Set a target amount and date to track your progress</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Vacation, Emergency Fund, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="targetAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Amount ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currentAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Amount ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="targetDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Target Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {COLORS.map((color) => (
                            <Button
                              key={color}
                              type="button"
                              variant="outline"
                              className={cn(
                                "h-8 w-8 rounded-full p-0",
                                field.value === color && "ring-2 ring-primary ring-offset-2",
                              )}
                              style={{ backgroundColor: color }}
                              onClick={() => form.setValue("color", color)}
                            >
                              {field.value === color && <Check className="h-4 w-4 text-white" />}
                              <span className="sr-only">Select color</span>
                            </Button>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Create Goal
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

