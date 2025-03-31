export enum EAchScheduleServices {
  ACH = 'ach-cnsadm',
  ACH_TRANSFER = 'ach-transf'
}

export enum EACHStatusAccount {
  ACTIVE = 'A',
  INACTIVE = 'I',
}

export enum EACHTransactionViewMode {
  DEFAULT = 'default',
  TRANSACTION_HISTORY = 'transactionHistory',
  SIGNATURE_TRACKING = 'signatureTracking',
  SIGNATURE_TRACKING_UPDATE = 'signatureTrackingUpdate',
  SIGNATURE_TRACKING_OPERATION = 'signatureTrackingOperation'
}

export enum EACHTypeTransaction {
  SIGNATURE_TRACKING = 'signatureTracking',
  DEFAULT = 'default'
}

export enum EACHTypeSchedule {
  LBTR = '1',
  ACH = '2',
  LBTR_VALUE = 10000
}


type TACHHelpersParameters = Readonly<{
  IS_SHOW_FAVORITE_WIDGET: boolean,
  IS_HIDDEN_FAVORITE_WIDGET: boolean,
  IS_SHOW_ALERT_VOUCHER: boolean,
  IS_HIDDEN_ALERT_VOUCHER: boolean,
}>;

export const ACH_PARAMETERS_HELPERS: TACHHelpersParameters = {
  IS_SHOW_FAVORITE_WIDGET: true,
  IS_HIDDEN_FAVORITE_WIDGET: false,
  IS_SHOW_ALERT_VOUCHER: true,
  IS_HIDDEN_ALERT_VOUCHER: false,
}
