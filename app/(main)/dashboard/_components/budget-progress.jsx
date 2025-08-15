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
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";

export function BudgetProgress({ initialBudget, currentExpenses }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );

  const {
    loading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

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

  // Determine color classes based on usage
  const progressColor =
    percentUsed >= 90
      ? "bg-red-500"
      : percentUsed >= 75
      ? "bg-yellow-500"
      : "bg-green-500";
  const textColor =
    percentUsed >= 90
      ? "text-red-600"
      : percentUsed >= 75
      ? "text-yellow-600"
      : "text-green-600";

  return (
    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between p-4 space-y-3 sm:space-y-0">
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Monthly Budget
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {initialBudget
              ? `$${currentExpenses.toFixed(2)} of $${initialBudget.amount.toFixed(
                  2
                )} spent`
              : "No budget set"}
          </CardDescription>
        </div>

        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <Input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="w-24 sm:w-32 transition-all duration-300"
                placeholder="Amount"
                disabled={loading}
              />
              <Button
                size="icon"
                variant="outline"
                onClick={handleSave}
                disabled={loading}
                className="text-green-500 hover:bg-green-50"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
                className="text-red-500 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="space-x-1"
            >
              <Pencil className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          )}
        </div>
      </CardHeader>

      {initialBudget && (
        <CardContent className="px-4 pb-4 pt-2">
          <div className="space-y-2">
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-500 ease-out ${progressColor}`}
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
