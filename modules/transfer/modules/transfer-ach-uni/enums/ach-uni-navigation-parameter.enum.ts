export enum AchUniTransferProtectedNavigation {
  HOME = 'ach_home',
  TRANSACTION = 'ach_uni_transfer_transaction',
  TERMS_CONDITIONS = 'ach_uni_terms_conditions',
  CONFIRMATION = 'ach_uni_transfer_confirmation',
  VOUCHER = 'ach_uni_transfer_voucher',
  ST_UPDATE_HOME = 'ach_uni_transfer_st_home',
  ST_UPDATE_CONFIRM = 'ach_uni_transfer_st_confirm',
  ST_UPDATE_VOUCHER = 'ach_uni_transfer_st_voucher',
}


export enum AchUniTransferUrlNavigationCollection {
  HOME_APP = '/home',
  HOME = '/transfer/ach-uni',
  DEFAULT_TRANSACTION = '/transfer/ach-uni/transaction',
  TERMS_CONDITIONS = '/transfer/ach-uni/terms-conditions',
  DEFAULT_CONFIRMATION = '/transfer/ach-uni/confirmation',
  DEFAULT_VOUCHER = '/transfer/ach-uni/voucher',
  ST_DETAIL = '/transfer/ach-uni/st-detail',
  ST_OPERATION = '/transfer/ach-uni/st-operation',
  ST_MODIFY_HOME = '/transfer/ach-uni/st/transaction',
  ST_MODIFY_CONFIRM = '/transfer/ach-uni/st/confirmation',
  ST_MODIFY_VOUCHER = '/transfer/ach-uni/st/voucher',
}
