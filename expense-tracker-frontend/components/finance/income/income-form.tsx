"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import type { Income } from "@/components/finance-dashboard"

const incomeFormSchema = z.object({
  source: z.string().min(1, "Source is required"),
  amount: z.string().min(1, "Amount is required"),
  category: z.string().min(1, "Category is required"),
  date: z.date(),
})

const categories = [
  "Salary",
  "Freelance",
  "Business",
  "Investments",
  "Rental",
  "Others",
]

export function IncomeForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const form = useForm<z.infer<typeof incomeFormSchema>>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: {
      source: "",
      amount: "",
      category: "",
      date: new Date(),
    },
  })

  function handleSubmit(data: Income) {
    onSubmit(data)
    toast({
      title: "Income added",
      description: `$${data.amount} from ${data.source}`,
    })
    form.reset({
      source: "",
      amount: "",
      category: "",
      date: new Date(),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Source</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Salary, Freelance, etc" 
                  {...field} 
                  className="h-12 rounded-xl border-gray-200 bg-white dark:border-gray-800 dark:bg-[#1c1c1c]"
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
              <FormLabel className="text-base">Amount</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0" 
                  {...field} 
                  className="h-12 rounded-xl border-gray-200 bg-white dark:border-gray-800 dark:bg-[#1c1c1c]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Categories</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-white dark:border-gray-800 dark:bg-[#1c1c1c]">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="dark:bg-[#1c1c1c]">
                  {categories.map((category) => (
                    <SelectItem 
                      key={category} 
                      value={category}
                      className="dark:focus:bg-gray-800"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "h-12 w-full rounded-xl border-gray-200 bg-white pl-3 text-left font-normal dark:border-gray-800 dark:bg-[#1c1c1c]",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    className="dark:bg-[#1c1c1c]"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="h-12 w-full rounded-xl bg-[#27ae60] hover:bg-[#2ecc71] dark:bg-[#27ae60] dark:hover:bg-[#2ecc71]"
        >
          Add Income
        </Button>
      </form>
    </Form>
  )
}

