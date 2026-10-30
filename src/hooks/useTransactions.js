import { useLocalStorage } from './useLocalStorage'
import { sampleTransactions, sampleBudgets } from '../data/sampleData'

export function useTransactions() {
  const [storedTransactions, setTransactions] = useLocalStorage('spendly-transactions', sampleTransactions)
  const [budgets, setBudgets] = useLocalStorage('spendly-budgets', sampleBudgets)
  // Legacy records predate payment methods and tags, so provide safe display defaults.
  const transactions = storedTransactions.map((transaction) => ({ ...transaction, paymentMethod: transaction.paymentMethod || 'UPI', tags: Array.isArray(transaction.tags) ? transaction.tags : [] }))
  const addTransaction = (transaction) => setTransactions((items) => [{ ...transaction, id: crypto.randomUUID() }, ...items])
  const updateTransaction = (transaction) => setTransactions((items) => items.map((item) => item.id === transaction.id ? transaction : item))
  const deleteTransaction = (id) => setTransactions((items) => items.filter((item) => item.id !== id))
  const clearData = () => { setTransactions([]); setBudgets({ overall: 0, categories: {} }) }
  return { transactions, budgets, setBudgets, addTransaction, updateTransaction, deleteTransaction, clearData }
}
