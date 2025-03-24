"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "@/components/ui/chart"

interface IncomeData {
  name: string
  value: number
}

interface IncomeSourcesChartProps {
  data: IncomeData[]
}

// Colors for the pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#5DADE2", "#48C9B0", "#F4D03F", "#EC7063"]

// Update the IncomeSourcesChart component to improve responsiveness
export function IncomeSourcesChart({ data }: IncomeSourcesChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">No income data available</p>
      </div>
    )
  }

  // Limit to top 5 categories for better visualization, combine the rest as "Other"
  const processedData = [...data]
  if (processedData.length > 5) {
    const topCategories = processedData.slice(0, 4)
    const otherCategories = processedData.slice(4)
    const otherSum = otherCategories.reduce((sum, item) => sum + item.value, 0)
    topCategories.push({ name: "Other", value: otherSum })
    processedData.length = 0
    processedData.push(...topCategories)
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <Pie
          data={processedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={({ cx }) => Math.min(cx * 0.8, 100)}
          fill="#8884d8"
          dataKey="value"
          animationBegin={0}
          animationDuration={1000}
        >
          {processedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            borderRadius: "var(--radius)",
            fontSize: "12px",
          }}
        />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
      </PieChart>
    </ResponsiveContainer>
  )
}

