"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Budget } from "@/types/finance"

// Update categories to match the backend's expected values
const categories = [
  { label: "Food", value: "Food" },
  { label: "Transportation", value: "Transportation" },
  { label: "Entertainment", value: "Entertainment" },
  { label: "Utilities", value: "Utilities" },
  { label: "Housing", value: "Housing" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "Education", value: "Education" },
  { label: "Shopping", value: "Shopping" },
  { label: "Travel", value: "Travel" },
  { label: "Other", value: "Other" }
]

type BudgetFormValues = Omit<Budget, "id" | "spent">

interface BudgetFormProps {
  onSubmit: (data: BudgetFormValues) => void
}

export function BudgetForm({ onSubmit }: BudgetFormProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const form = useForm<BudgetFormValues>({
    defaultValues: {
      category: "",
      amount: 0,
      period: "weekly",
    },
  })

  function handleSubmit(data: BudgetFormValues) {
    if (!data.period) {
      toast({
        title: "Error",
        description: "Please select a period",
        variant: "destructive",
      })
      return
    }
    onSubmit(data)
    toast({
      title: "Budget created",
      description: `Rs. ${data.amount.toFixed(2)} for ${data.category} (${data.period})`,
      variant: "success",
    })
    // Reset the form with default values
    form.reset({
      category: "",
      amount: 0,
      period: "weekly",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Category</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
                      {field.value
                        ? categories.find((category) => category.value === field.value)?.label
                        : "Select category"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandList>
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {categories.map((category) => (
                          <CommandItem
                            value={category.label}
                            key={category.value}
                            onSelect={() => {
                              form.setValue("category", category.value)
                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                category.value === field.value ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {category.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Amount (Rs)</FormLabel>
                <FormControl>
                  <Input
                     type="number"
                     step="0.01"
                     min="0"
                     placeholder="0.00"
                     {...field}
                     value={field.value === 0 ? "" : field.value}
                     onChange={(e) => {
                       const value = e.target.value === "" ? 0 : Number(e.target.value);
                       field.onChange(value);
                     }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Period</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  defaultValue="weekly"
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full rounded-xl bg-[#27ae60] hover:bg-[#2ecc71] dark:bg-[#27ae60] dark:hover:bg-[#2ecc71]">
          Create Budget
        </Button>
      </form>
    </Form>
  )
}

