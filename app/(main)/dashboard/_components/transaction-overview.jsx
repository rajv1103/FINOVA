"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9FA8DA",
];

export function DashboardOverview({ accounts, transactions }) {
  // mount for fade-in
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );

  // filter & sort
  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId
  );
  const recentTransactions = accountTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // this month’s expenses
  const now = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const d = new Date(t.date);
    return (
      t.type === "EXPENSE" &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });

  // group for pie
  const expensesByCategory = currentMonthExpenses.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});
  const pieChartData = Object.entries(expensesByCategory).map(
    ([name, value]) => ({ name, value })
  );

  // fade-in + hover styles
  const cardBase =
    "transform transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl";
  const fadeInClass = mounted
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-4";

  // total expense this month
  const totalExpense = currentMonthExpenses.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="grid gap-6 md:grid-cols-2 p-4">
      {/* Recent Transactions */}
      <Card className={cn(cardBase, fadeInClass)}>
        <CardHeader className="flex items-center justify-between pb-4 px-6">
          <CardTitle className="text-base font-medium">Recent Transactions</CardTitle>
          <Select
            value={selectedAccountId}
            onValueChange={setSelectedAccountId}
          >
            <SelectTrigger className="w-44 transition ring-1 ring-amber-400 focus:ring-2 focus:ring-amber-500">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="px-6 space-y-4">
          {recentTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              No recent transactions
            </p>
          ) : (
            recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{tx.description || "Untitled"}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(tx.date), "PP")}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex items-center font-medium",
                    tx.type === "EXPENSE" ? "text-red-500" : "text-green-500"
                  )}
                >
                  {tx.type === "EXPENSE" ? (
                    <ArrowDownRight className="mr-1 h-4 w-4 animate-pulse group-hover:animate-none" />
                  ) : (
                    <ArrowUpRight className="mr-1 h-4 w-4 animate-pulse group-hover:animate-none" />
                  )}
                  ₹{tx.amount.toFixed(2)}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Monthly Expense Breakdown */}
      <Card className={cn(cardBase, fadeInClass)}>
        <CardHeader className="px-6 pb-0">
          <CardTitle className="text-base font-medium">
            Monthly Expense Breakdown
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {pieChartData.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              No expenses this month
            </p>
          ) : (
            <div className="relative h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    paddingAngle={4}
                  >
                    {pieChartData.map((entry, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => `₹${v.toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    wrapperStyle={{ paddingTop: 8, fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* center total */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  ₹{totalExpense.toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
