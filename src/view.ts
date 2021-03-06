import { Project, Transaction, ItemTransaction, Item, StockIn } from './model';

export interface ProjectsView {
  projects: ProjectView[],
  totalIncome: number
}

export interface ProjectView {
  project: Project,
  income: number,
  totalManufacturingPrice: number
}

export interface ProjectTransactionsView {
  project: Project,
  transactions: TransactionView[]
}

export interface TransactionView {
  transaction: Transaction,
  itemTransactions: ItemTransactionView[],
  totalPrice: number
}

export interface ItemTransactionView {
  itemTransaction: ItemTransaction,
  item: Item
}

export interface ItemStockView {
  item: Item,
  inStock: number,
}

export interface ItemStockInsView {
  item: Item,
  stockIns: StockInView[]
}

export interface StockInView {
  stockIn: StockIn,
  project: Project | null
}