"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import type { Income } from "./finance-dashboard"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const categories = [
  { label: "Employment", value: "Employment" },
  { label: "Business", value: "Business" },
  { label: "Investments", value: "Investments" },
  { label: "Dividends", value: "Dividends" },
  { label: "Rental", value: "Rental" },
  { label: "Side Hustle", value: "Side Hustle" },
  { label: "Gifts", value: "Gifts" },
  { label: "Other", value: "Other" },
]

const incomeFormSchema = z.object({
  source: z.string().min(1, "Source is required").max(100, "Source is too long"),
  amount: z.number().min(0.01, "Amount must be greater than 0").max(1000000, "Amount is too large"),
  category: z.string().min(1, "Category is required"),
  date: z.date({
    required_error: "Date is required",
  }),
})

type IncomeFormValues = z.infer<typeof incomeFormSchema>

interface IncomeFormProps {
  onSubmit: (data: IncomeFormValues) => void
}

export function IncomeForm({ onSubmit }: IncomeFormProps) {
  const [open, setOpen] = useState(false)

  const form = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: {
      source: "",
      amount: 0,
      category: "Employment",
      date: new Date(),
    },
  })

  function handleSubmit(data: IncomeFormValues) {
    try {
      // Validate the data
      const validatedData = incomeFormSchema.parse(data)
      
      // Submit the data
      onSubmit(validatedData)
      
      // Show success toast
      toast({
        title: "Income Added",
        description: `Added $${data.amount.toFixed(2)} from ${data.source}`,
      })

      // Reset form
      form.reset({
        source: "",
        amount: 0,
        category: "Employment",
        date: new Date(),
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Show validation errors
        const errors = error.errors.map(err => err.message).join(", ")
        toast({
          title: "Validation Error",
          description: errors,
          variant: "destructive",
        })
      } else {
        // Show generic error
        toast({
          title: "Error",
          description: "Failed to add income. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Salary, freelance work, etc." 
                    {...field} 
                    maxLength={100}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="1000000"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => {
                      const value = Number.parseFloat(e.target.value)
                      if (!isNaN(value)) {
                        field.onChange(value)
                      }
                    }}
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
            name="category"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Category</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button 
                        variant="outline" 
                        role="combobox" 
                        aria-expanded={open} 
                        className="justify-between"
                        type="button"
                      >
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

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        type="button"
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
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Adding..." : "Add Income"}
        </Button>
      </form>
    </Form>
  )
}

