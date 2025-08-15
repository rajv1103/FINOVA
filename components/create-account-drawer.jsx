"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { createAccount } from "@/actions/dashboard";
import { accountSchema } from "@/app/lib/schema";

export function CreateAccountDrawer({ children }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const { loading: createAccountLoading, fn: createAccountFn, error, data: newAccount } =
    useFetch(createAccount);

  const onSubmit = async (data) => {
    await createAccountFn(data);
  };

  useEffect(() => {
    if (newAccount) {
      toast.success("Account created successfully");
      reset();
      setOpen(false);
    }
  }, [newAccount, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create account");
    }
  }, [error]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full max-w-md rounded-xl shadow-xl p-6 bg-white dark:bg-gray-900">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Create New Account
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Account Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Account Name
            </label>
            <Input id="name" placeholder="e.g., Main Checking" {...register("name")} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          {/* Account Type */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Account Type
            </label>
            <Select
              onValueChange={(value) => setValue("type", value)}
              defaultValue={watch("type")}
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CURRENT">Current</SelectItem>
                <SelectItem value="SAVINGS">Savings</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
          </div>

          {/* Initial Balance */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Initial Balance
            </label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("balance")}
            />
            {errors.balance && <p className="text-sm text-red-500">{errors.balance.message}</p>}
          </div>

          {/* Default Switch */}
          <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800">
            <div className="space-y-0.5">
              <label className="text-base font-medium cursor-pointer">Set as Default</label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This account will be selected by default for transactions
              </p>
            </div>
            <Switch
              id="isDefault"
              checked={watch("isDefault")}
              onCheckedChange={(checked) => setValue("isDefault", checked)}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <SheetClose asChild>
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </SheetClose>

            <Button
              type="submit"
              className="flex-1"
              disabled={createAccountLoading}
            >
              {createAccountLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
