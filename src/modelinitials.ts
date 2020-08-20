import { Item, Transaction, Project } from "./model";
import { TransactionView } from './view';
import { makeDateString } from './helpers';

export const initialItem: Item = {
  id: 0,
  uid: "",
  name: "",
  description: "",
  price: 0,
  manufacturingPrice: 0,
  created_at: null,
  updated_at: null
}

export const initialTransaction: Transaction = {
  id: 0,
  uid: "",
  cashier: "",
  priceIsCustom: false,
  customPrice: 0,
  projectId: 0,
  created_at: null,
  updated_at: null
}

export const initialProject: Project = {
  id: 0,
  uid: "",
  name: "",
  startDate: makeDateString(new Date()),
  created_at: null,
  updated_at: null
}

export const initialTransactionView: TransactionView = {
  transaction: { ...initialTransaction },
  itemTransactions: [],
  totalPrice: 0
}