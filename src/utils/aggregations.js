import { monthKey } from './formatters'

// Returns income, expense, and net balance for a transaction collection.
export const getMonthlyTotals = (transactions) => transactions.reduce((totals, transaction) => ({ ...totals, [transaction.type]: totals[transaction.type] + Number(transaction.amount) }), { income: 0, expense: 0 })
// Groups expense transactions into totals keyed by their category.
export const getCategoryTotals = (transactions) => transactions.filter((transaction) => transaction.type === 'expense').reduce((totals, transaction) => ({ ...totals, [transaction.category]: (totals[transaction.category] || 0) + Number(transaction.amount) }), {})
// Builds a day-by-day cumulative balance series for a selected month.
export const getDailyBalance = (transactions, month) => { const days = new Date(`${month}-01T12:00:00`).getMonth() === 11 ? 31 : new Date(Number(month.slice(0, 4)), Number(month.slice(5)), 0).getDate(); const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date)); let running = 0; return Array.from({ length: days }, (_, index) => { const day = index + 1; sorted.filter((transaction) => Number(transaction.date.slice(8, 10)) === day).forEach((transaction) => { running += transaction.type === 'income' ? Number(transaction.amount) : -Number(transaction.amount) }); return { day, balance: running } }) }
// Calculates income and expense totals for the selected month and preceding five months.
export const getLastSixMonths = (transactions, selectedMonth) => Array.from({ length: 6 }, (_, index) => { const date = new Date(`${selectedMonth}-01T12:00:00`); date.setMonth(date.getMonth() - (5 - index)); const key = monthKey(date); const totals = getMonthlyTotals(transactions.filter((transaction) => transaction.date.startsWith(key))); return { month: new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(date), ...totals } })
// Returns totals for the month immediately before the selected month.
export const getPreviousMonthTotals = (transactions, selectedMonth) => { const date = new Date(`${selectedMonth}-01T12:00:00`); date.setMonth(date.getMonth() - 1); return getMonthlyTotals(transactions.filter((transaction) => transaction.date.startsWith(monthKey(date)))) }
// Returns the five largest expense transactions for a compact dashboard list.
export const getTopExpenses = (transactions) => [...transactions].filter((transaction) => transaction.type === 'expense').sort((a, b) => Number(b.amount) - Number(a.amount)).slice(0, 5)
// Divides total spend by elapsed days for the selected month.
export const getDailyAverageSpend = (transactions, selectedMonth) => { const total = getMonthlyTotals(transactions).expense; const now = new Date(); const current = monthKey(now) === selectedMonth; const days = current ? now.getDate() : new Date(Number(selectedMonth.slice(0, 4)), Number(selectedMonth.slice(5)), 0).getDate(); return days ? total / days : 0 }
