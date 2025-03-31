export enum ENavigateProtectionParameter {
  CONFIRMATION = 'confirmation_tpl',
  UPDATE = 'update_tpl',
  DELETE = 'delete_tpl',
  PAYMENT = 'payment_tpl',
  CONSULT = 'consult_tpl',
  PAYMENT_VOUCHER = 'payment_voucher',
  UPDATE_CONFIRMATION = 'update-confirmation',
  CREATE = 'create_tpl',
  DASHBOARD_HOME_TPL = 'dashboard-third-parties',
  VOUCHER_ST_TRANSACTION = 'voucherSignatureTrackingTransaction',
  VOUCHER_ST_TRANSACTION_DETAIL = 'voucherSignatureTrackingTransactionDetail',
  CONFIRMATION_ST_MODIFY_TRANSACTION = 'voucherSignatureTrackingTransactionModify',
  FORM_ST_MODIFY_PAYMENT = 'voucherSignatureTrackingTransactionModifyForm',
  VOUCHER_ST_MODIFY_TRANSACTION = 'voucherSignatureTrackingTransactionModifyVoucher',
  VOUCHER_ST_OPERATIONS = 'voucherSignatureTrackingOperations',
  VOUCHER_HISTORY_TRANSACTION = 'voucherHistoryTransaction'
}

export enum ETPLPaymentUrlNavigationCollection {
  HOME = '/loan/third-party-loans',
  HOME2 = '/loan/third-party-loans/all',
  DEFAULT_CONFIRMATION = '/loan/third-party-loans/confirmation',
  DEFAULT_VOUCHER = '/loan/third-party-loans/voucher',
  DEFAULT_PAYMENT_VOUCHER = '/loan/third-party-loans/payment-voucher',
  SIGNATURE_TRACKING_CONFIRMATION = '/loan/third-party-loans/stm-confirmation',
  SIGNATURE_TRACKING_VOUCHER = '/loan/third-party-loans/std-voucher',
  SIGNATURE_TRACKING_MODIFY_VOUCHER = '/loan/third-party-loans/stm-voucher',
  SIGNATURE_TRACKING_MODIFY_HOME = '/loan/third-party-loans/st-payment',
  SIGNATURE_TRACKING_OPERATION = '/loan/third-party-loans/operations',
  TRANSACTION_HISTORY_VOUCHER = '/loan/third-party-loans/th-voucher',
  HOME_TRANSACTION = '/loan/third-party-loans/payment',
}

export enum ETPLPaymentCRUDUrlNavigationCollection {
  CREATE_HOME = '/loan/third-party-loans/create',
  CONSULT = '/loan/third-party-loans/consult',
  UPDATE_HOME = '/loan/third-party-loans/update',
  UPDATE_CONFIRMATION = '/loan/third-party-loans/update-confirmation',
  DELETE = '/transfer/third/delete',
}
export enum EPaymentLoansFlowView {
  THIRD_PARTY_LOANS = 'thirdLoans',
  ALL_LOANS = 'allLoans',
}
