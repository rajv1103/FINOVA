"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar as CalendarIcon,
  Loader2,
  DollarSign,
  Tag,
  CreditCard,
} from "lucide-react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { cn } from "@/lib/utils";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import { ReceiptScanner } from "./recipt-scanner";

export default function AddTransactionForm({
  accounts,
  categories,
  editMode = false,
  initialData = null,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
            }),
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((ac) => ac.isDefault)?.id,
            date: new Date(),
            isRecurring: false,
          },
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const onSubmit = (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };

    if (editMode) {
      transactionFn(editId, formData);
    } else {
      transactionFn(formData);
    }
  };

  const handleScanComplete = (scannedData) => {
    if (scannedData) {
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));
      if (scannedData.description) {
        setValue("description", scannedData.description);
      }
      if (scannedData.category) {
        setValue("category", scannedData.category);
      }
      toast.success("Receipt scanned successfully");
    }
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(
        editMode
          ? "Transaction updated successfully"
          : "Transaction created successfully"
      );
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, editMode, reset, router]);

  // UI state watchers
  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  // Helpers
  const formatAmountOnBlur = (val) => {
    if (!val) return;
    const n = parseFloat(val);
    if (isNaN(n)) return;
    setValue("amount", n.toFixed(2));
  };

  // Ensure account default is selected on mount
  useEffect(() => {
    const current = getValues("accountId");
    if (!current) {
      const def = accounts.find((ac) => ac.isDefault)?.id;
      if (def) setValue("accountId", def);
    }
  }, [accounts, getValues, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-2xl  bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
         

          <div>
            <h3 className="text-lg font-semibold">
              {editMode ? "Edit Transaction" : "Add Transaction"}
            </h3>
          </div>
        </div>

        {/* Receipt Scanner */}
        {!editMode && (
          <div className="mt-4">
            <ReceiptScanner onScanComplete={handleScanComplete} />
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {/* Type */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium">Type</label>
            <Select
              onValueChange={(value) => setValue("type", value)}
              defaultValue={type}
            >
              <SelectTrigger className="w-full pl-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXPENSE">Expense</SelectItem>
                <SelectItem value="INCOME">Income</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="mt-1 text-sm text-destructive">
                {errors.type.message}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="relative flex flex-col">
            <label className="mb-2 text-sm font-medium">Amount</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-2 flex h-8 items-center">
                <DollarSign className="h-4 w-4 opacity-60" />
              </span>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pl-10"
                {...register("amount")}
                onBlur={(e) => formatAmountOnBlur(e.target.value)}
                aria-label="Amount"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-destructive">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Account */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium">Account</label>
            <Select
              onValueChange={(value) => setValue("accountId", value)}
              defaultValue={getValues("accountId")}
            >
              <SelectTrigger className="w-full pl-3">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-sm border p-1">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {account.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {account.type || "Account"}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm">
                        ${parseFloat(account.balance).toFixed(2)}
                      </div>
                    </div>
                  </SelectItem>
                ))}
                <div className="px-2 py-1">
                  <CreateAccountDrawer>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm"
                    >
                      + Create Account
                    </Button>
                  </CreateAccountDrawer>
                </div>
              </SelectContent>
            </Select>
            {errors.accountId && (
              <p className="mt-1 text-sm text-destructive">
                {errors.accountId.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium">Category</label>
            <Select
              onValueChange={(value) => setValue("category", value)}
              defaultValue={getValues("category")}
            >
              <SelectTrigger className="w-full pl-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-3">
                      <Tag className="h-4 w-4 opacity-70" />
                      <div className="text-sm">{category.name}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="mt-1 text-sm text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <div className="flex w-full items-center gap-3">
                    <CalendarIcon className="h-4 w-4 opacity-60" />
                    <span className="flex-1">
                      {date ? format(date, "PPP") : "Pick a date"}
                    </span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => setValue("date", date)}
                  disabled={(d) => d > new Date() || d < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="mt-1 text-sm text-destructive">
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="mb-2 text-sm font-medium">Description</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-2 flex h-8 items-center">
                <Tag className="h-4 w-4 opacity-60" />
              </span>
              <Input
                className="pl-10"
                placeholder="Enter description"
                {...register("description")}
              />
            </div>
            {errors.description && (
              <p className="mt-1 text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Recurring Toggle */}
          <div className="sm:col-span-2 flex items-center justify-between rounded-lg border p-4">
            <div>
              <div className="text-base font-medium">Recurring Transaction</div>
              <div className="text-sm text-muted-foreground">
                Set up an automated schedule for this transaction
              </div>
            </div>
            <Switch
              checked={isRecurring}
              onCheckedChange={(checked) => setValue("isRecurring", checked)}
            />
          </div>

          {/* Recurring Interval */}
          {isRecurring && (
            <div className="space-y-2">
              <label className="mb-2 text-sm font-medium">
                Recurring Interval
              </label>
              <Select
                onValueChange={(value) => setValue("recurringInterval", value)}
                defaultValue={getValues("recurringInterval")}
              >
                <SelectTrigger className="w-full pl-3">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAILY">Daily</SelectItem>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                </SelectContent>
              </Select>
              {errors.recurringInterval && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.recurringInterval.message}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => router.back()}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="w-full"
            disabled={transactionLoading}
          >
            {transactionLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {editMode ? "Updating..." : "Creating..."}
              </>
            ) : editMode ? (
              "Update Transaction"
            ) : (
              "Create Transaction"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
