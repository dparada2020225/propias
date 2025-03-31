export enum SPPView {
  LOAD_FILE = 'loadFile',
  MANUAL = 'manual',
}

export const SPPPaymentView = {
  DEFAULT: 'default',
  ST_DETAIL: 'stDetail',
  ST_OPERATION: 'stOperation',
  ST_VOUCHER: 'stVoucher',
  TH_VOUCHER: 'thVoucher',
} as const;

export type SP_PAYMENT_VIEW = typeof SPPPaymentView[keyof typeof SPPPaymentView];
