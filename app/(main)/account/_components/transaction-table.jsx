"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Trash,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { categoryColors } from "@/data/categories";
import { bulkDeleteTransactions } from "@/actions/account";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { useRouter, useSearchParams } from "next/navigation";

// Small helpers
const ITEMS_PER_PAGE = 10;
const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

function useDebounce(value, ms = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

// Safely format money if currency provided on transaction
export function formatMoney(amount) {
  try {
    return `₹${new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)}`;
  } catch (e) {
    return `Rs${Number(amount || 0).toFixed(2)}`;
  }
}
export default function TransactionTable({ transactions = [] }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAllMatching, setSelectAllMatching] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 450);
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [localTransactions, setLocalTransactions] = useState(transactions);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Keep local copy in sync with incoming prop (useful after upstream fetches)
  useEffect(() => setLocalTransactions(transactions), [transactions]);

  // Restore some UI state from URL (non-blocking; best-effort)
  useEffect(() => {
    try {
      const sp = Object.fromEntries(searchParams?.entries?.() ?? []);
      if (sp.page) setCurrentPage(Number(sp.page));
      if (sp.sortField)
        setSortConfig({ field: sp.sortField, direction: sp.sortDir || "desc" });
      if (sp.type) setTypeFilter(sp.type);
      if (sp.recurring) setRecurringFilter(sp.recurring);
      if (sp.q) setSearchTerm(sp.q);
    } catch (e) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Write selected UI state into URL so users can share links
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage && currentPage > 1) params.set("page", String(currentPage));
    if (sortConfig.field && sortConfig.direction) {
      params.set("sortField", sortConfig.field);
      params.set("sortDir", sortConfig.direction);
    }
    if (typeFilter) params.set("type", typeFilter);
    if (recurringFilter) params.set("recurring", recurringFilter);
    if (searchTerm) params.set("q", searchTerm);

    const query = params.toString();
    router.replace(query ? `?${query}` : "/", { scroll: false });
  }, [
    currentPage,
    sortConfig,
    typeFilter,
    recurringFilter,
    searchTerm,
    router,
  ]);

  // useFetch wrapper for delete
  const { loading: deleteLoading, fn: deleteFn } = useFetch(
    bulkDeleteTransactions
  );

  // Filter + sort (memoized)
  const filteredAndSortedTransactions = useMemo(() => {
    const base = localTransactions.filter((t) => !t._deleted);
    let result = [...base];

    if (debouncedSearch) {
      const s = debouncedSearch.toLowerCase();
      result = result.filter((t) =>
        (t.description || "").toLowerCase().includes(s)
      );
    }

    if (typeFilter) result = result.filter((t) => t.type === typeFilter);

    if (recurringFilter) {
      result = result.filter((t) =>
        recurringFilter === "recurring" ? t.isRecurring : !t.isRecurring
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortConfig.field) {
        case "date":
          cmp = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          cmp = a.amount - b.amount;
          break;
        case "category":
          cmp = (a.category || "").localeCompare(b.category || "");
          break;
        default:
          cmp = 0;
      }
      return sortConfig.direction === "asc" ? cmp : -cmp;
    });

    return result;
  }, [
    localTransactions,
    debouncedSearch,
    typeFilter,
    recurringFilter,
    sortConfig,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedTransactions.length / ITEMS_PER_PAGE)
  );

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedTransactions, currentPage]);

  // Select handlers
  const handleSelect = useCallback((id) => {
    setSelectedIds((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
    );
    setSelectAllMatching(false);
  }, []);

  const handleSelectAllPage = useCallback(() => {
    setSelectedIds((cur) =>
      cur.length === paginatedTransactions.length
        ? []
        : paginatedTransactions.map((t) => t.id)
    );
    setSelectAllMatching(false);
  }, [paginatedTransactions]);

  const handleSelectAllMatching = useCallback(() => {
    // select every filtered transaction (across pages)
    if (selectAllMatching) {
      setSelectedIds([]);
      setSelectAllMatching(false);
    } else {
      setSelectedIds(filteredAndSortedTransactions.map((t) => t.id));
      setSelectAllMatching(true);
    }
  }, [filteredAndSortedTransactions, selectAllMatching]);

  const handleClearSelection = () => {
    setSelectedIds([]);
    setSelectAllMatching(false);
  };

  const handleSort = (field) => {
    setSortConfig((cur) => ({
      field,
      direction:
        cur.field === field && cur.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Delete (optimistic UI) - supports single or many ids
  const handleDelete = async (ids) => {
    if (!ids || ids.length === 0) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete ${ids.length} transaction(s)?`
    );
    if (!confirmed) return;

    // optimistic: mark local transactions with _deleted so they disappear immediately
    setLocalTransactions((prev) =>
      prev.map((t) => (ids.includes(t.id) ? { ...t, _deleted: true } : t))
    );
    setSelectedIds((s) => s.filter((id) => !ids.includes(id)));
    setSelectAllMatching(false);

    try {
      await deleteFn(ids);
      toast.success(`Deleted ${ids.length} transaction(s)`);
    } catch (e) {
      // rollback on error
      setLocalTransactions((prev) =>
        prev.map((t) => (ids.includes(t.id) ? { ...t, _deleted: false } : t))
      );
      toast.error("Failed to delete transactions");
    }
  };

  const handleBulkDelete = async () => {
    await handleDelete(selectedIds);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // keep selection by default but clear page selection specifics
    setSelectedIds([]);
    setSelectAllMatching(false);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setCurrentPage(1);
    setSelectedIds([]);
    setSelectAllMatching(false);
  };

  return (
    <div className="space-y-4">
      {deleteLoading && <BarLoader className="mt-4" width={"100%"} />}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            aria-label="Search transactions"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Select
            value={typeFilter}
            onValueChange={(v) => {
              setTypeFilter(v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={recurringFilter}
            onValueChange={(v) => {
              setRecurringFilter(v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">Non-recurring Only</SelectItem>
            </SelectContent>
          </Select>

          {(selectedIds.length > 0 || selectAllMatching) && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSelection}
                title="Clear selection"
              >
                Clear Selection
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={deleteLoading}
              >
                <Trash className="h-4 w-4 mr-2" /> Delete Selected (
                {selectedIds.length})
              </Button>
            </div>
          )}

          {(searchTerm || typeFilter || recurringFilter) && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleClearFilters}
              title="Clear filters"
            >
              <X className="h-4 w-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={
                        selectedIds.length === paginatedTransactions.length &&
                        paginatedTransactions.length > 0
                      }
                      onCheckedChange={handleSelectAllPage}
                      aria-label="Select page transactions"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSelectAllMatching}
                      title="Select all matching results"
                    >
                      {selectAllMatching ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {selectedIds.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {selectedIds.length} selected
                    </div>
                  )}
                </div>
              </TableHead>

              <TableHead
                role="button"
                className="cursor-pointer"
                onClick={() => handleSort("date")}
                aria-sort={
                  sortConfig.field === "date" ? sortConfig.direction : "none"
                }
              >
                <div className="flex items-center">
                  Date
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>

              <TableHead>Description</TableHead>

              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}
                role="button"
                aria-sort={
                  sortConfig.field === "category"
                    ? sortConfig.direction
                    : "none"
                }
              >
                <div className="flex items-center">
                  Category
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>

              <TableHead
                className="cursor-pointer text-right"
                onClick={() => handleSort("amount")}
                role="button"
                aria-sort={
                  sortConfig.field === "amount" ? sortConfig.direction : "none"
                }
              >
                <div className="flex items-center justify-end">
                  Amount
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>

              <TableHead>Recurring</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                >
                  <div className="space-y-2">
                    <div>No transactions found</div>
                    <div className="text-sm text-muted-foreground">
                      Try clearing filters or add a new transaction.
                    </div>
                    <div className="pt-2">
                      <Button
                        onClick={() => router.push("/transaction/create")}
                      >
                        Add transaction
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-muted">
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(transaction.id)}
                      onCheckedChange={() => handleSelect(transaction.id)}
                    />
                  </TableCell>

                  <TableCell>
                    {format(new Date(transaction.date), "PP")}
                  </TableCell>

                  <TableCell className="max-w-[300px]">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="truncate">
                            {transaction.description || "-"}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="max-w-xs whitespace-normal">
                            {transaction.description}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>

                  <TableCell className="capitalize">
                    <span
                      style={{
                        background:
                          categoryColors[transaction.category] || "#999",
                      }}
                      className={cn(
                        "px-2 py-1 rounded text-sm inline-block",
                        "text-white"
                      )}
                    >
                      {transaction.category || "Uncategorized"}
                    </span>
                  </TableCell>

                  <TableCell
                    className={cn(
                      "text-right font-medium",
                      transaction.type === "EXPENSE"
                        ? "text-red-500"
                        : "text-green-500"
                    )}
                  >
                    {transaction.type === "EXPENSE" ? "-" : "+"}
                    {formatMoney(transaction.amount)}
                  </TableCell>

                  <TableCell>
                    {transaction.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant="secondary"
                              className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
                            >
                              <RefreshCw className="h-3 w-3" />
                              {RECURRING_INTERVALS[
                                transaction.recurringInterval
                              ] || "Recurring"}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div className="font-medium">Next Date:</div>
                              <div>
                                {transaction.nextRecurringDate
                                  ? format(
                                      new Date(transaction.nextRecurringDate),
                                      "PPP"
                                    )
                                  : "—"}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" /> One-time
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          aria-label="More actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/transaction/create?edit=${transaction.id}`
                            )
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete([transaction.id])}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
