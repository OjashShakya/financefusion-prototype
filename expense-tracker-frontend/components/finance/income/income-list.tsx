"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ArrowUpDown, Calendar, DollarSign, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Income } from "@/components/finance-dashboard"

interface IncomeListProps {
  incomes: Income[]
  onDelete: (id: string) => void
}

export function IncomeList({ incomes, onDelete }: IncomeListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "amount">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const categories = Array.from(new Set(incomes.map((income) => income.category)))

  const filteredIncomes = incomes
    .filter(
      (income) =>
        income.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        income.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((income) => (categoryFilter === "all" ? true : income.category === categoryFilter))
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search income..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
          <SelectTrigger className="w-full md:w-[180px]">
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

      {filteredIncomes.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("date")}
                    className="flex items-center gap-1 p-0 font-medium"
                  >
                    Date
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("amount")}
                    className="flex items-center gap-1 p-0 font-medium"
                  >
                    Amount
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncomes.map((income) => (
                <TableRow key={income.id}>
                  <TableCell className="font-medium">{income.source}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{income.category}</Badge>
                  </TableCell>
                  <TableCell className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {format(income.date, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                    {Number(income.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(income.id)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">No income found</p>
            {searchTerm && <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filter</p>}
          </div>
        </div>
      )}
    </div>
  )
}

