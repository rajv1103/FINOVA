// <-- NO "use client" here either; this can be async server-side
import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";

// our client-only component
import DashboardContent from "./DashboardContent";

export default async function DashboardPage() {
  // fetch everything on the server
  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);

  const defaultAccount = accounts.find((a) => a.isDefault);
  const budgetData = defaultAccount
    ? await getCurrentBudget(defaultAccount.id)
    : null;

  // hand off to a Client Component
  return (
    <DashboardContent
      accounts={accounts}
      transactions={transactions || []}
      budget={budgetData?.budget}
      currentExpenses={budgetData?.currentExpenses || 0}
    />
  );
}
