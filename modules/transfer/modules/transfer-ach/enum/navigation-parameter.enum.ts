export enum EACHNavigationParameters  {
  TRANSFER_FORM = 'transfer_ach_form',
  VOUCHER = 'transfer_ach_voucher',
  CONFIRMATION = 'transfer_ach_confirm',
  CRUD_CREATE_FORM = 'transfer_ach_confirm',
  CRUD_CREATE_VOUCHER = 'crud_create_ach_voucher',
  CRUD_CREATE_CONFIRMATION = 'crud_create_ach_confirmation',
  CRUD_DELETE = 'crud_delete_ach',
  CRUD_UPDATE_FORM = 'crud_update_ach_form',
  CRUD_UPDATE_VOUCHER = 'crud_update_ach_voucher',
  CRUD_UPDATE_CONFIRMATION = 'crud_update_ach_confirmation',
  TRANSACTION_HISTORY = 'transfer_ach_voucher',
  SIGNATURE_TRACKING_OPERATIONS = 'transfer_ach_voucher_operations',
  TRANSFER_FORM_UPDATE_MODE = 'transfer_ach_form_update_mode',
  VOUCHER_UPDATE_MODE = 'transfer_ach_voucher_update_mode',
  CONFIRMATION_UPDATE_MODE = 'transfer_ach_confirm_update_mode',
}


export enum EACHTransferUrlNavigationCollection {
  HOME = '/transfer/ach',
  DEFAULT_CONFIRMATION = '/transfer/ach/confirmation',
  DEFAULT_VOUCHER = '/transfer/ach/voucher',
  SIGNATURE_TRACKING_HOME = '/transfer/ach/st-home',
  SIGNATURE_TRACKING_CONFIRMATION = '/transfer/ach/st-confirmation',
  SIGNATURE_TRACKING_VOUCHER = '/transfer/ach/st-voucher',
  SIGNATURE_TRACKING_MODIFY_VOUCHER = '/transfer/ach/stm-voucher',
  SIGNATURE_TRACKING_OPERATION = '/transfer/ach/st-operation',
  TRANSACTION_HISTORY_VOUCHER = '/transfer/ach/th-voucher',
  HOME_TRANSACTION = '/transfer/ach/transfer-form',
}

export enum EACHCrudUrlNavigationCollection {
  CREATE_HOME = 'transfer/ach/create',
  CREATE_VOUCHER = '/transfer/ach/create-voucher',
  CREATE_CONFIRMATION = '/transfer/ach/create-confirm',
  UPDATE_HOME = '/transfer/ach/update',
  UPDATE_CONFIRMATION = '/transfer/ach/update-confirm',
  UPDATE_VOUCHER = '/transfer/ach/update-voucher',
  DELETE = '/transfer/ach/delete',
}
