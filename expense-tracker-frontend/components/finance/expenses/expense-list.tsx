"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ArrowUpDown, Calendar, DollarSign, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Expense } from "@/types/finance"
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

interface ExpenseListProps {
  expenses: Expense[]
  onDelete: (id: string) => void
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "amount">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null)

  const categories = Array.from(new Set(expenses.map((expense) => expense.category)))

  const filteredExpenses = expenses
    .filter(
      (expense) =>
        (expense.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (expense.category?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
    )
    .filter((expense) => (categoryFilter === "all" ? true : expense.category === categoryFilter))
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc" ? a.date.getTime() - b.date.getTime() : b.date.getTime() - a.date.getTime()
      } else {
        return sortOrder === "asc" ? Number(a.amount) - Number(b.amount) : Number(b.amount) - Number(a.amount)
      }
    })

  const toggleSort = (field: "date" | "amount") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id)
      await onDelete(id)
    } catch (error) {
      console.error("Error deleting expense:", error)
    } finally {
      setIsDeleting(null)
      setExpenseToDelete(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by description or category..."
            className="h-10 pl-9 pr-4 rounded-lg border-gray-200 bg-white dark:border-gray-800 dark:bg-[#1c1c1c]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
          <SelectTrigger className="h-10 w-full md:w-[180px] rounded-lg border-gray-200 bg-white dark:border-gray-800 dark:bg-[#1c1c1c]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AlertDialog open={!!expenseToDelete} onOpenChange={(open) => !open && setExpenseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the expense.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => expenseToDelete && handleDelete(expenseToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {filteredExpenses.length > 0 ? (
        <div className="rounded-lg border border-gray-100 bg-white dark:border-gray-800 dark:bg-[#1c1c1c] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                <TableHead className="w-[30%] py-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Description</span>
                </TableHead>
                <TableHead className="w-[20%] py-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Category</span>
                </TableHead>
                <TableHead className="w-[20%] py-3">
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("date")}
                    className="p-0 h-auto text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    Date
                    <ArrowUpDown className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </TableHead>
                <TableHead className="w-[20%] py-3">
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("amount")}
                    className="p-0 h-auto text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 ml-auto flex"
                  >
                    Amount
                    <ArrowUpDown className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </TableHead>
                <TableHead className="w-[10%] py-3 text-right">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Action</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow 
                  key={expense.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                >
                  <TableCell className="py-3 text-sm">{expense.description}</TableCell>
                  <TableCell className="py-3">
                    <span className="inline-flex items-center rounded-full bg-gray-100/80 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {expense.category}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-sm text-gray-600 dark:text-gray-300">
                    {format(expense.date, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="py-3 text-sm text-right font-medium">
                    Rs. {Number(expense.amount).toFixed(2)}
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setExpenseToDelete(expense.id)}
                      disabled={isDeleting === expense.id}
                      className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed border-gray-200 dark:border-gray-800">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">No expenses found</p>
            {searchTerm && <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filter</p>}
          </div>
        </div>
      )}
    </div>
  )
}

