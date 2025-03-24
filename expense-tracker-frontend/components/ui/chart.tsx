"use client"
import {
  Bar as RechartsBar,
  BarChart as RechartsBarChart,
  CartesianGrid as RechartsCartesianGrid,
  Cell as RechartsCell,
  ComposedChart as RechartsComposedChart,
  Legend as RechartsLegend,
  Line as RechartsLine,
  LineChart as RechartsLineChart,
  Pie as RechartsPie,
  PieChart as RechartsPieChart,
  ResponsiveContainer as RechartsResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  Area as RechartsArea,
} from "recharts"

// Re-export components with proper types
export const Bar = RechartsBar
export const BarChart = RechartsBarChart
export const CartesianGrid = RechartsCartesianGrid
export const Cell = RechartsCell
export const ComposedChart = RechartsComposedChart
export const Legend = RechartsLegend
export const Line = RechartsLine
export const LineChart = RechartsLineChart
export const Pie = RechartsPie
export const PieChart = RechartsPieChart
export const ResponsiveContainer = RechartsResponsiveContainer
export const Tooltip = RechartsTooltip
export const XAxis = RechartsXAxis
export const YAxis = RechartsYAxis
export const Area = RechartsArea

// Export all from recharts for convenience
export * from "recharts"

