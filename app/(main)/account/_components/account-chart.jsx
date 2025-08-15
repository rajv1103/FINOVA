"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  format,
  subDays,
  startOfDay,
  endOfDay,
  startOfWeek,
  startOfMonth,
  parseISO,
} from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { IconStack, IconGrouped, IconCalendar } from "lucide-react"; // optional icons; replace if not available

// Date range presets (keeps your prior choices)
const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

// Granularity options
const GRANULARITY = {
  DAILY: { label: "Daily" },
  WEEKLY: { label: "Weekly" },
  MONTHLY: { label: "Monthly" },
};

const currencyFormatter = (v) =>
  typeof v === "number"
    ? `₹ ${new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2 }).format(v)}`
    : String(v);


/**
 * AccountChart
 * Named export to match your existing imports.
 */
export function AccountChart({ transactions = [] }) {
  const [dateRangeKey, setDateRangeKey] = useState("1M");
  const [granularity, setGranularity] = useState("DAILY");
  const [stacked, setStacked] = useState(false);
  const [showIncome, setShowIncome] = useState(true);
  const [showExpense, setShowExpense] = useState(true);

  // Prepare start date for filter
  const range = DATE_RANGES[dateRangeKey];
  const now = new Date();
  const startDate = range.days ? startOfDay(subDays(now, range.days - 1)) : startOfDay(new Date(0));
  const endDate = endOfDay(now);

  // Group transactions by date bucket (based on granularity)
  const processed = useMemo(() => {
    if (!transactions || transactions.length === 0) return { data: [], totals: { income: 0, expense: 0 }, avg: { income: 0, expense: 0 } };

    const buckets = new Map();

    const getBucketKey = (date) => {
      if (granularity === "MONTHLY") return format(startOfMonth(date), "yyyy-MM");
      if (granularity === "WEEKLY") return format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-'W'II"); // using ISO-ish week label
      return format(startOfDay(date), "yyyy-MM-dd");
    };

    // Filter and bucket
    transactions.forEach((t) => {
      // t.date might be ISO string or Date object
      const rawDate = typeof t.date === "string" ? parseISO(t.date) : new Date(t.date);
      if (rawDate < startDate || rawDate > endDate) return;

      const key = getBucketKey(rawDate);
      if (!buckets.has(key)) buckets.set(key, { ts: rawDate.getTime(), income: 0, expense: 0, labelTs: rawDate.getTime() });
      const bucket = buckets.get(key);

      if (t.type === "INCOME") bucket.income += Number(t.amount || 0);
      else bucket.expense += Number(t.amount || 0);
    });

    // Convert map -> sorted array
    const arr = Array.from(buckets.entries()).map(([key, val]) => {
      // choose readable label per granularity
      let label;
      if (granularity === "MONTHLY") label = format(new Date(val.labelTs), "MMM yyyy");
      else if (granularity === "WEEKLY") {
        const d = new Date(val.labelTs);
        const startWeek = format(startOfWeek(d, { weekStartsOn: 1 }), "MMM dd");
        const endWeek = format(new Date(startOfWeek(d, { weekStartsOn: 1 }).getTime() + 6 * 24 * 3600 * 1000), "MMM dd");
        label = `${startWeek} — ${endWeek}`;
      } else label = format(new Date(val.labelTs), "MMM dd");

      return { key, label, ts: val.ts, income: Number(val.income), expense: Number(val.expense) };
    });

    arr.sort((a, b) => a.ts - b.ts);

    // Totals & averages
    const totals = arr.reduce((acc, cur) => ({ income: acc.income + cur.income, expense: acc.expense + cur.expense }), { income: 0, expense: 0 });
    const days = Math.max(1, arr.length);
    const avg = { income: totals.income / days, expense: totals.expense / days };

    return { data: arr, totals, avg };
  }, [transactions, dateRangeKey, granularity, startDate, endDate]);

  const chartData = processed.data.map((d) => ({
    dateLabel: d.label,
    income: d.income,
    expense: d.expense,
  }));

  // Totals for header
  const totals = processed.totals;
  const net = totals.income - totals.expense;

  // If empty: show subtle empty state
  const isEmpty = chartData.length === 0;

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle className="text-base font-medium">Transaction Overview</CardTitle>
          <p className="text-sm text-muted-foreground">A quick look at income vs expenses</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="text-muted-foreground text-xs">Range</div>
            <Select value={dateRangeKey} onValueChange={(v) => setDateRangeKey(v)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DATE_RANGES).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="text-muted-foreground text-xs">Granularity</div>
            <Select value={granularity} onValueChange={(v) => setGranularity(v)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Granularity" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(GRANULARITY).map(([k, { label }]) => (
                  <SelectItem key={k} value={k}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-muted-foreground text-xs">Stacked</div>
            <Switch checked={stacked} onCheckedChange={setStacked} />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="p-3 rounded-lg border bg-muted/40 text-center">
            <div className="text-xs text-muted-foreground">Total Income</div>
            <div className="text-lg font-semibold text-emerald-600">{currencyFormatter(totals.income)}</div>
            <div className="text-xs text-muted-foreground">Avg ({granularity.toLowerCase()}) {currencyFormatter(processed.avg.income)}</div>
          </div>

          <div className="p-3 rounded-lg border bg-muted/40 text-center">
            <div className="text-xs text-muted-foreground">Total Expense</div>
            <div className="text-lg font-semibold text-red-600">{currencyFormatter(totals.expense)}</div>
            <div className="text-xs text-muted-foreground">Avg ({granularity.toLowerCase()}) {currencyFormatter(processed.avg.expense)}</div>
          </div>

          <div className="p-3 rounded-lg border bg-muted/40 text-center">
            <div className="text-xs text-muted-foreground">Net</div>
            <div className={`text-lg font-semibold ${net >= 0 ? "text-emerald-600" : "text-red-600"}`}>{currencyFormatter(net)}</div>
            <div className="text-xs text-muted-foreground">Range: {DATE_RANGES[dateRangeKey].label}</div>
          </div>
        </div>

        {/* Legend toggles */}
        <div className="flex items-center gap-3 mb-3">
          <button
            type="button"
            onClick={() => setShowIncome((s) => !s)}
            className={`px-3 py-1 rounded-full text-sm border ${showIncome ? "bg-emerald-50 border-emerald-200" : "bg-transparent border-muted/30"}`}
            aria-pressed={showIncome}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => setShowExpense((s) => !s)}
            className={`px-3 py-1 rounded-full text-sm border ${showExpense ? "bg-red-50 border-red-200" : "bg-transparent border-muted/30"}`}
            aria-pressed={showExpense}
          >
            Expense
          </button>
        </div>

        {/* Empty state */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
            <div className="mb-4 opacity-80">No transactions for the selected range.</div>
            <div className="text-sm">Try changing the date range or granularity.</div>
          </div>
        ) : (
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 16, left: 6, bottom: 6 }}
              >
                {/* nice subtle grid */}
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--muted-foreground)" opacity={0.06} />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  interval={Math.max(0, Math.floor(chartData.length / 8))}
                  angle={chartData.length > 10 ? -20 : 0}
                  textAnchor={chartData.length > 10 ? "end" : "middle"}
                />
                <YAxis
                  tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value) => currencyFormatter(value)}
                  labelFormatter={(label) => label}
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />

                {/* gradient defs */}
                <defs>
                  <linearGradient id="gIncome" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity={0.25} />
                  </linearGradient>
                  <linearGradient id="gExpense" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.25} />
                  </linearGradient>
                </defs>

                {/* Bars: show/hide via legend toggles, stacked via `stackId` */}
                {showIncome && (
                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="url(#gIncome)"
                    radius={[6, 6, 0, 0]}
                    stackId={stacked ? "stack" : undefined}
                    isAnimationActive
                  />
                )}

                {showExpense && (
                  <Bar
                    dataKey="expense"
                    name="Expense"
                    fill="url(#gExpense)"
                    radius={[6, 6, 0, 0]}
                    stackId={stacked ? "stack" : undefined}
                    isAnimationActive
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
