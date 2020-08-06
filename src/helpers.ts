export type RequestStatus 
  = 'Success'
  | 'Error'
  | 'Loading'
  | 'NotAsked'

export const formatIdr = (moneyAmount: number) => {
  return Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(moneyAmount)
}