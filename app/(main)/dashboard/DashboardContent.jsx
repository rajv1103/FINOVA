"use client";   // <-- Now this file is a Client Component

import { Plus } from "lucide-react";
import { Suspense } from "react";

import { AccountCard } from "./_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progress";
import { DashboardOverview } from "./_components/transaction-overview";

import { Card, CardContent } from "@/components/ui/card";

export default function DashboardContent({
  accounts,
  transactions,
  budget,
  currentExpenses,
}) {
  return (
    <div className="space-y-12">
      {/* Budget Progress */}
      <section>
        <BudgetProgress
          initialBudget={budget}
          currentExpenses={currentExpenses}
        />
      </section>

      {/* Transactions Overview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Overview
          </h2>
        </div>
        <DashboardOverview accounts={accounts} transactions={transactions} />
      </section>

      {/* Your Accounts */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Your Accounts
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Add new */}
          <CreateAccountDrawer>
            <Card className="flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer transition-all duration-300 hover:border-indigo-500 hover:shadow-lg">
              <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-muted-foreground">
                <Plus className="h-10 w-10 mb-2 text-indigo-500 animate-bounce" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Add New Account
                </p>
              </CardContent>
            </Card>
          </CreateAccountDrawer>

          {/* Existing */}
          {accounts.map((acct) => (
            <AccountCard key={acct.id} account={acct} />
          ))}
        </div>
      </section>
    </div>
  );
}
