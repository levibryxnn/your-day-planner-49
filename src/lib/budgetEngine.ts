import { TripExpense, TripStop } from "./types";

export function calculateStopsTotal(stops: TripStop[]) {
  return stops.reduce((total, stop) => total + Math.max(0, stop.cost || 0), 0);
}

export function calculateExpensesTotal(expenses: TripExpense[]) {
  return expenses.reduce(
    (total, expense) => total + Math.max(0, expense.estimatedCost || 0),
    0
  );
}

export function calculateTotalPlanned(stops: TripStop[], expenses: TripExpense[]) {
  return calculateStopsTotal(stops) + calculateExpensesTotal(expenses);
}

export function calculateRemainingBudget(
  budget: number,
  stops: TripStop[],
  expenses: TripExpense[]
) {
  return budget - calculateTotalPlanned(stops, expenses);
}
