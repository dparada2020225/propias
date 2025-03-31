export enum EThirdTransferNavigateParameters {
  TRANSFER_HOME = 'third_transfer_home',
  TRANSFER_CONFIRM = 'third_transfer_confirmation',
  TRANSFER_VOUCHER = 'third_transfer_voucher',
  CRUD_CREATE_FORM = 'third_transfer_crud_create_form',
  CRUD_CREATE_CONFIRM = 'third_transfer_crud_create_confirmation',
  CRUD_CREATE_VOUCHER = 'third_transfer_crud_create_voucher',
  CRUD_UPDATE_FORM = 'third_transfer_crud_update_form',
  CRUD_UPDATE_CONFIRM = 'third_transfer_crud_update_confirmation',
  CRUD_UPDATE_VOUCHER = 'third_transfer_crud_update_voucher',
  CRUD_DELETE = 'third_transfer_crud_delete',
  SIGNATURE_TRACKING_OPERATIONS = 'third_transfer_voucher_operation',
  SIGNATURE_TRACKING_HOME = 'third_transfer_home_signature_tracking',
  SIGNATURE_TRACKING_CONFIRM = 'third_transfer_confirm_signature_tracking',
  SIGNATURE_TRACKING_VOUCHER = 'third_transfer_voucher_signature_tracking',
}

export enum EThirdTransferViewMode {
  DEFAULT = 'default',
  SIGNATURE_TRACKING_DETAIL = 'defaultSignatureTracking',
  TRANSACTION_HISTORY = 'transactionHistory',
  SIGNATURE_TRACKING = 'signatureTracking',
  SIGNATURE_TRACKING_OPERATION = 'signatureTrackingOperation',
}

export enum EThirdTransferTypeTransaction {
  DEFAULT = 'default',
  SIGNATURE_TRACKING = 'signatureTracking',
}

export enum EThirdTransferUrlNavigationCollection {
  HOME = '/transfer/third',
  HOMESV = '/transfer/third/home',
  DEFAULT_CONFIRMATION = '/transfer/third/confirmation',
  DEFAULT_VOUCHER = '/transfer/third/voucher',
  SIGNATURE_TRACKING_HOME = '/transfer/third/st-home',
  SIGNATURE_TRACKING_CONFIRMATION = '/transfer/third/st-confirmation',
  SIGNATURE_TRACKING_VOUCHER = '/transfer/third/st-voucher',
  SIGNATURE_TRACKING_MODIFY_VOUCHER = '/transfer/third/stm-voucher',
  SIGNATURE_TRACKING_OPERATION = '/transfer/third/st-operation',
  TRANSACTION_HISTORY_VOUCHER = '/transfer/third/th-voucher',
  HOME_TRANSACTION = '/transfer/third/transaction',
}

export enum EThirdCrudUrlNavigationCollection {
  CREATE_HOME = '/transfer/third/create',
  CREATE_VOUCHER = '/transfer/third/create-voucher',
  CREATE_CONFIRMATION = '/transfer/third/create-confirm',
  UPDATE_HOME = '/transfer/third/update',
  UPDATE_VOUCHER = '/transfer/third/update-voucher',
  DELETE = '/transfer/third/delete',
}
