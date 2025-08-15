import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import  AddTransactionForm  from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";

export default async function AddTransactionPage({ searchParams }) {
  const accounts = await getUserAccounts();
  const editId = searchParams?.edit;

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl sm:text-5xl font-bold gradient-title tracking-tight animate-fade-in">
          {editId ? "Edit Transaction" : "Add Transaction"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {editId
            ? "Update the details of your transaction."
            : "Record a new income or expense."}
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-6 sm:p-8 transition-all">
        <AddTransactionForm
          accounts={accounts}
          categories={defaultCategories}
          editMode={!!editId}
          initialData={initialData}
        />
      </div>
    </div>
  );
}
