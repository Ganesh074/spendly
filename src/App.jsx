import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import TransactionModal from './components/TransactionModal'
import Toast from './components/Toast'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import { useTransactions } from './hooks/useTransactions'
import { getCategoryTotals, getDailyAverageSpend, getDailyBalance, getLastSixMonths, getMonthlyTotals, getPreviousMonthTotals, getTopExpenses } from './utils/aggregations'
import { monthKey } from './utils/formatters'

export default function App() {
  const { transactions, budgets, setBudgets, addTransaction, updateTransaction, deleteTransaction, clearData } = useTransactions()
  const [page, setPage] = useState('dashboard'); const [month, setMonth] = useState(monthKey()); const [category, setCategory] = useState('All'); const [modal, setModal] = useState(null); const [toast, setToast] = useState({ message: '', type: 'success' })
  const monthlyTransactions = useMemo(() => transactions.filter((item) => item.date.startsWith(month)), [transactions, month])
  const categoryTransactions = useMemo(() => monthlyTransactions.filter((item) => category === 'All' || item.category === category), [monthlyTransactions, category])
  const dashboardTransactions = useMemo(() => [...categoryTransactions].sort((a, b) => b.date.localeCompare(a.date)), [categoryTransactions])
  const totals = useMemo(() => getMonthlyTotals(dashboardTransactions), [dashboardTransactions]); const previousTotals = useMemo(() => getPreviousMonthTotals(transactions, month), [transactions, month]); const categoryTotals = useMemo(() => getCategoryTotals(dashboardTransactions), [dashboardTransactions]); const monthlyCategoryTotals = useMemo(() => getCategoryTotals(monthlyTransactions), [monthlyTransactions]); const dailyData = useMemo(() => getDailyBalance(dashboardTransactions, month), [dashboardTransactions, month]); const sixMonths = useMemo(() => getLastSixMonths(transactions, month), [transactions, month]); const topExpenses = useMemo(() => getTopExpenses(dashboardTransactions), [dashboardTransactions]); const dailyAverageSpend = useMemo(() => getDailyAverageSpend(dashboardTransactions, month), [dashboardTransactions, month])
  const showToast = (message, type = 'success') => { setToast({ message, type }); setTimeout(() => setToast({ message: '', type: 'success' }), 2600) }
  useEffect(() => { const shown = JSON.parse(localStorage.getItem('spendly-budget-alerts') || '[]'); const alerts = Object.entries(monthlyCategoryTotals).map(([name, spent]) => ({ name, spent, budget: budgets.categories[name] || 0 })).filter((item) => item.budget > 0 && item.spent / item.budget >= 0.8).sort((a, b) => b.spent / b.budget - a.spent / a.budget); const alert = alerts.find((item) => !shown.includes(`${month}-${item.name}`)); if (alert) { const over = alert.spent / alert.budget >= 1; const key = `${month}-${alert.name}`; localStorage.setItem('spendly-budget-alerts', JSON.stringify([...shown, key])); showToast(over ? `${alert.name} is over budget` : `${alert.name} has reached 80% of its budget`, over ? 'danger' : 'warning') } }, [monthlyCategoryTotals, budgets, month])
  const save = (item) => { if (item.id) { updateTransaction(item); showToast('Transaction updated') } else { addTransaction(item); showToast('Transaction added') } setModal(null) }
  const remove = (id) => { deleteTransaction(id); showToast('Transaction deleted') }
  return <div className="min-h-screen"><Sidebar page={page} setPage={setPage} clearData={() => { clearData(); showToast('All data cleared') }} /><main className="mx-auto max-w-[1500px] p-4 pb-24 md:ml-[230px] md:p-7"><TopBar page={page} month={month} setMonth={setMonth} category={category} setCategory={setCategory} onAdd={() => setModal({})} />{page === 'dashboard' && <Dashboard totals={totals} previousTotals={previousTotals} dailyData={dailyData} dailyAverageSpend={dailyAverageSpend} topExpenses={topExpenses} sixMonths={sixMonths} categoryTotals={categoryTotals} transactions={dashboardTransactions} budgets={budgets} onAdd={(type) => setModal({ type })} setPage={setPage} />}{page === 'transactions' && <Transactions transactions={categoryTransactions} month={month} onEdit={(item) => setModal({ transaction: item })} onDelete={remove} onExport={() => showToast('CSV downloaded')} />}{page === 'budgets' && <Budgets budgets={budgets} categoryTotals={categoryTotals} onUpdate={(value) => { setBudgets(value); showToast('Budget saved') }} />}</main><button onClick={() => setModal({})} className="fixed bottom-20 right-4 z-20 grid h-12 w-12 place-items-center rounded-full bg-blue-600 text-white shadow-lg md:hidden"><Plus size={22} /></button>{modal && <TransactionModal transaction={modal.transaction} type={modal.type} onClose={() => setModal(null)} onSave={save} />}<Toast message={toast.message} type={toast.type} /></div>
}
