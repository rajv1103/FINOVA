"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";

export function BudgetProgress({ initialBudget, currentExpenses }) {
  // for fade-in
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );

  const { loading, fn: updateBudgetFn, data: updatedBudget, error } =
    useFetch(updateBudget);

  const percentUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

  const handleSave = async () => {
    const amount = parseFloat(newBudget);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    await updateBudgetFn(amount);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      toast.success("Budget updated successfully");
      setIsEditing(false);
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  // color thresholds
  const barGradient =
    percentUsed >= 90
      ? "from-red-400 to-red-600"
      : percentUsed >= 75
      ? "from-yellow-400 to-yellow-600"
      : "from-green-400 to-green-600";
  const textColor =
    percentUsed >= 90
      ? "text-red-600"
      : percentUsed >= 75
      ? "text-yellow-600"
      : "text-green-600";

  // mount-triggered fade classes
  const fadeClass = mounted
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-3";

  return (
    <Card
      className={`
        relative overflow-hidden 
        bg-white dark:bg-gray-900 
        border border-gray-200 dark:border-gray-700 
        rounded-xl shadow-md hover:shadow-lg 
        transform hover:-translate-y-1 
        transition-all duration-500 ease-out
        ${fadeClass}
      `}
    >
      <CardHeader className="
        flex flex-col sm:flex-row sm:items-center justify-between 
        p-6 bg-gray-50 dark:bg-gray-800 
        border-b border-gray-200 dark:border-gray-700
      ">
        <div className="flex-1">
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Monthly Budget
          </CardTitle>
          <CardDescription className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {initialBudget
              ? `₹${currentExpenses.toFixed(2)} of ₹${initialBudget.amount.toFixed(
                  2
                )} spent`


                    
              : "No budget set"}
          </CardDescription>
        </div>

        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          {isEditing ? (
            <>
              <Input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="
                  w-24 sm:w-32 
                  focus:ring-2 focus:ring-indigo-500 
                  focus:border-indigo-500 
                  transition-all duration-300
                "
                placeholder="Amount"
                disabled={loading}
              />
              <Button
                size="icon"
                variant="outline"
                onClick={handleSave}
                disabled={loading}
                className="text-green-600 hover:bg-green-50"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
                className="text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="solid"
              onClick={() => setIsEditing(true)}
              className="
                flex items-center space-x-1 
                bg-indigo-600 text-white 
                hover:bg-indigo-700 
                focus:ring-2 focus:ring-indigo-500
              "
            >
              <Pencil className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          )}
        </div>
      </CardHeader>

      {initialBudget && (
        <CardContent className="px-6 py-4">
          <div className="space-y-2">
            <div className="relative w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
              <div
                className={`
                  absolute inset-0 
                  bg-gradient-to-r ${barGradient} 
                  rounded-full 
                  transition-[width] duration-800 ease-out
                `}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
            </div>
            <p className={`text-xs text-right font-medium ${textColor}`}>
              {percentUsed.toFixed(1)}% used
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
