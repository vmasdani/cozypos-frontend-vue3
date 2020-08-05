export interface ApiKey {
  id: number,
  apiKey: string,
  created_at: string,
  updated_at: string
} 

export interface Item {
  id: number,
  uid: string,
  name: string,
  description: string,
  price: number,
  manufacturingPrice: number,
  created_at: string,
  updated_at: string
}

export interface Project {
  id: number,
  uid: string,
  name: string,
  startDate: string,
  created_at: string,
  updated_at: string
}

export interface Transaction {
  id: number,
  uid: string,
  cashier: string,
  priceIsCustom: boolean,
  customPrice: number,
  projectId: number,
  created_at: string,
  updated_at: string
}

export interface StockIn {
  id: number,
  uid: string,
  pic: string,
  itemId: number,
  projectId: number,
  qty: number,
  created_at: string,
  updated_at: string
}

export interface ItemTransaction {
  id: number,
  uid: string,
  itemId: number,
  transactionId: number,
  qty: number,
  created_at: string,
  updated_at: string
}

export interface ItemStockIn {
  id: number,
  uid: string,
  itemId: number,
  stockInId: number,
  qty: number,
  created_at: string,
  updated_at: string
}

export interface ItemProject {
  id: number,
  uid: string,
  itemId: number,
  projectId: number,
  qty: number,
  created_at: string,
  updated_at: string
}