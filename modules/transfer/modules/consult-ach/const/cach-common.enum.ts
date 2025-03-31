export const CACH_TYPE_OPERATION = {
  EMPTY_VALUE: 'EMPTY',
} as const;

export const CACH_TYPE_MOVEMENTS = {
  DEBIT: 'debit',
  CREDIT: '',
} as const;
export type TCACH_MOVEMENTS = typeof CACH_TYPE_MOVEMENTS[keyof typeof CACH_TYPE_MOVEMENTS]
