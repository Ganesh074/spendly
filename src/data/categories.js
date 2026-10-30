import { Utensils, Plane, Home, ShoppingBag, ReceiptText, HeartPulse, BadgeIndianRupee, BriefcaseBusiness, ChartNoAxesCombined, CircleEllipsis } from 'lucide-react'

export const incomeCategories = [
  { name: 'Salary', color: '#14B8A6', icon: BadgeIndianRupee },
  { name: 'Business', color: '#2563EB', icon: BriefcaseBusiness },
  { name: 'Trading', color: '#8B5CF6', icon: ChartNoAxesCombined },
  { name: 'Others', color: '#6B7280', icon: CircleEllipsis },
]
export const expenseCategories = [
  { name: 'Food', color: '#F97316', icon: Utensils }, { name: 'Travel', color: '#8B5CF6', icon: Plane },
  { name: 'Rent', color: '#2563EB', icon: Home }, { name: 'Shopping', color: '#EC4899', icon: ShoppingBag },
  { name: 'Bills', color: '#EAB308', icon: ReceiptText }, { name: 'Health', color: '#16A34A', icon: HeartPulse },
  { name: 'Other', color: '#6B7280', icon: CircleEllipsis },
]
export const categories = [...incomeCategories, ...expenseCategories]
export const getCategory = (name) => categories.find((category) => category.name === name) || expenseCategories.at(-1)
