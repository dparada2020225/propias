export enum EOwnTransferProtectedNavigation {
  HOME = 'own_transfer_form',
  VOUCHER = 'own_transfer_voucher',
  CONFIRMATION = 'own-_transfer_confirmation',
  SIGNATURE_OPERATION = 'own_transfer_signature_operation',
  HOME_ST_UPDATE_MODE = 'own_transfer_home_update_mode',
  CONFIRMATION_ST_UPDATE_MODE = 'own_transfer_confirmation_update_mode',
  VOUCHER_ST_UPDATE_MODE = 'own_transfer_voucher_update_mode'
}


export enum EOwnTransferUrlNavigationCollection {
  HOME = '/transfer/own',
  DEFAULT_CONFIRMATION = '/transfer/own/confirmation',
  DEFAULT_VOUCHER = '/transfer/own/voucher',
  SIGNATURE_TRACKING_HOME = '/transfer/own/st-home',
  SIGNATURE_TRACKING_CONFIRMATION = '/transfer/own/st-confirmation',
  SIGNATURE_TRACKING_VOUCHER = '/transfer/own/st-voucher',
  SIGNATURE_TRACKING_MODIFY_VOUCHER = '/transfer/own/stm-voucher',
  SIGNATURE_TRACKING_OPERATION = '/transfer/own/st-operation',
  TRANSACTION_HISTORY_VOUCHER = '/transfer/own/th-voucher',
}
