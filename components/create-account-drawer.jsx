"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Button } from "@/components/ui/button";
import { SkeletonDemo } from "@/components/ui/skeleton-demo";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import useFetch from "@/hooks/use-fetch";
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
    trigger,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const {
    loading: createAccountLoading,
    fn: createAccountFn,
    error,
    data: newAccount,
  } = useFetch(createAccount);

  const [isPending, startTransition] = useTransition();

  const onSubmit = (data) => {
    startTransition(() => {
      createAccountFn(data);
    });
  };

  useEffect(() => {
    if (newAccount) {
      toast.success("Account created successfully", { "aria-live": "polite" });
      reset();
      setOpen(false);
    }
  }, [newAccount, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create account", {
        "aria-live": "assertive",
      });
    }
  }, [error]);

  const isLoading = createAccountLoading || isPending;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        className="flex flex-col justify-between w-full max-w-md md:max-w-lg"
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        autoFocus
      >
        <SheetHeader>
          <SheetTitle className="text-base lg:text-lg">
            Create New Account
          </SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          {/* Account Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-label">
              Account Name
            </label>
            {isLoading ? (
              <SkeletonDemo className="h-10 w-full rounded-md" />
            ) : (
              <Input
                id="name"
                placeholder="e.g., Main Checking"
                aria-invalid={!!errors.name}
                aria-errormessage="name-error"
                className="focus:ring-2 focus:ring-indigo-500"
                {...register("name", { onBlur: () => trigger("name") })}
              />
            )}
            {errors.name && (
              <p id="name-error" className="text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Type & Balance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account Type */}
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium text-label">
                Account Type
              </label>
              {isLoading ? (
                <SkeletonDemo className="h-10 w-full rounded-md" />
              ) : (
                <Select
                  onValueChange={(val) => setValue("type", val)}
                  defaultValue={watch("type")}
                >
                  <SelectTrigger
                    id="type"
                    className="focus:ring-2 focus:ring-indigo-500"
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CURRENT">Current</SelectItem>
                    <SelectItem value="SAVINGS">Savings</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            {/* Initial Balance */}
            <div className="space-y-2">
              <label
                htmlFor="balance"
                className="text-sm font-medium text-label"
              >
                Initial Balance
              </label>
              {isLoading ? (
                <SkeletonDemo className="h-10 w-full rounded-md" />
              ) : (
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  aria-invalid={!!errors.balance}
                  aria-errormessage="balance-error"
                  className="focus:ring-2 focus:ring-indigo-500"
                  {...register("balance", {
                    onBlur: () => trigger("balance"),
                  })}
                />
              )}
              {errors.balance && (
                <p id="balance-error" className="text-sm text-red-500">
                  {errors.balance.message}
                </p>
              )}
            </div>
          </div>

          {/* Default Switch */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <label
                htmlFor="isDefault"
                className="text-base font-medium cursor-pointer"
              >
                Set as Default
              </label>
              <p className="text-sm text-muted-foreground">
                This account will be selected by default for transactions
              </p>
            </div>
            {isLoading ? (
              <SkeletonDemo className="h-6 w-12 rounded-full" />
            ) : (
              <Switch
                id="isDefault"
                checked={watch("isDefault")}
                onCheckedChange={(checked) => setValue("isDefault", checked)}
              />
            )}
          </div>

          {/* Actions */}
          <div className="mt-auto flex gap-4">
            <SheetClose asChild>
              <Button
                type="button"
                variant="outline"
                className="flex-1 hover:shadow-md active:scale-95 transition"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </SheetClose>
            <Button
              type="submit"
              className="flex-1 hover:shadow-md active:scale-95 transition"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
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
