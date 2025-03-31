export enum SPRoutes {
  HOME = '/payments/suppliers',
  BATCH = '/payments/suppliers/batch',
  FILE_MANAGMENT = '/payments/suppliers/batch/upload',
  PAYMENT_CONFIRMATION = '/payments/suppliers/batch/file/confirmation',
  FILE_VOUCHER = '/payments/suppliers/batch/file/voucher',
  FILE_CONFIRMATION = '/payments/suppliers/batch/file/voucher',
  MANUAL_MANAGER = '/payments/suppliers/batch/manual',
  CONFIRMATION_LOAD_MANUAL = '/payments/suppliers/batch/manual/confirmation',
  VOUCHER_LOAD_MANUAL = '/payments/suppliers/batch/voucher',
  VOUCHER_LOAD_FILE = '/payments/suppliers/batch/file/voucher',
  PAYMENT = '/payments/suppliers/payment',
  VOUCHER_PAYMENT = '/payments/suppliers/payment/voucher',
  ST_PAYMENT_SUPPLIER_VOUCHER = '/payments/suppliers/payment/st-voucher',
  ST_PAYMENT_SUPPLIER_OPERATION = '/payments/suppliers/payment/st-operation',
  ST_PAYMENT_SUPPLIER_DETAIL = '/payments/suppliers/payment/st-detail',
}