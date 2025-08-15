"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
import { Switch } from "@/components/ui/switch";

// Presets
const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

const GRANULARITY = {
  DAILY: { label: "Daily" },
  WEEKLY: { label: "Weekly" },
  MONTHLY: { label: "Monthly" },
};

const currencyFormatter = (v) =>
  typeof v === "number"
    ? `₹ ${new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2 }).format(v)}`
    : String(v);

export function AccountChart({ transactions = [] }) {
  const [dateRangeKey, setDateRangeKey] = useState("1M");
  const [granularity, setGranularity] = useState("DAILY");
  const [stacked, setStacked] = useState(false);
  const [showIncome, setShowIncome] = useState(true);
  const [showExpense, setShowExpense] = useState(true);

  const range = DATE_RANGES[dateRangeKey];
  const now = new Date();
  const startDate = range.days ? startOfDay(subDays(now, range.days - 1)) : startOfDay(new Date(0));
  const endDate = endOfDay(now);

  const processed = useMemo(() => {
    if (!transactions.length)
      return { data: [], totals: { income: 0, expense: 0 }, avg: { income: 0, expense: 0 } };

    const buckets = new Map();
    const getBucketKey = (date) => {
      if (granularity === "MONTHLY") return format(startOfMonth(date), "yyyy-MM");
      if (granularity === "WEEKLY") return format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-'W'II");
      return format(startOfDay(date), "yyyy-MM-dd");
    };

    transactions.forEach((t) => {
      const rawDate = typeof t.date === "string" ? parseISO(t.date) : new Date(t.date);
      if (rawDate < startDate || rawDate > endDate) return;
      const key = getBucketKey(rawDate);
      if (!buckets.has(key))
        buckets.set(key, { ts: rawDate.getTime(), income: 0, expense: 0, labelTs: rawDate.getTime() });
      const bucket = buckets.get(key);
      if (t.type === "INCOME") bucket.income += Number(t.amount || 0);
      else bucket.expense += Number(t.amount || 0);
    });

    const arr = Array.from(buckets.entries()).map(([key, val]) => {
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

  const totals = processed.totals;
  const net = totals.income - totals.expense;
  const isEmpty = chartData.length === 0;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle className="text-base font-medium">Transaction Overview</CardTitle>
          <p className="text-sm text-muted-foreground">A quick look at income vs expenses</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="text-muted-foreground text-xs">Range</div>
            <Select value={dateRangeKey} onValueChange={setDateRangeKey}>
              <SelectTrigger className="w-[140px] min-w-[120px]">
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
            <Select value={granularity} onValueChange={setGranularity}>
              <SelectTrigger className="w-[120px] min-w-[110px]">
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

        <div className="flex flex-wrap items-center gap-3 mb-3">
          <button
            type="button"
            onClick={() => setShowIncome((s) => !s)}
            className={`px-3 py-1 rounded-full text-sm border ${showIncome ? "bg-emerald-50 border-emerald-200" : "bg-transparent border-muted/30"}`}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => setShowExpense((s) => !s)}
            className={`px-3 py-1 rounded-full text-sm border ${showExpense ? "bg-red-50 border-red-200" : "bg-transparent border-muted/30"}`}
          >
            Expense
          </button>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
            <div className="mb-4 opacity-80">No transactions for the selected range.</div>
            <div className="text-sm">Try changing the date range or granularity.</div>
          </div>
        ) : (
          <div className="h-[300px] sm:h-[360px] overflow-x-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 16, left: 6, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.06} />
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
                {showIncome && (
                  <Bar dataKey="income" name="Income" fill="url(#gIncome)" radius={[6, 6, 0, 0]} stackId={stacked ? "stack" : undefined} />
                )}
                {showExpense && (
                  <Bar dataKey="expense" name="Expense" fill="url(#gExpense)" radius={[6, 6, 0, 0]} stackId={stacked ? "stack" : undefined} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
