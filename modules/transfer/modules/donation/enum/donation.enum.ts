export enum EDonationSchduleService {
  DONATION = 'ope-dncs'
}

export enum EDonationTypeTransaction {
  DEFAULT = 'default',
  SIGNATURE_TRACKING = 'signature_tracking',
}

export enum EDonationNavigationProtected {
  HOME = 'donation_transfer_home',
  VOUCHER = 'donation_transfer_voucher',
  CONFIRMATION = 'donation_transfer_confirmation',
  SIGNATURE_TRACKING_HOME = 'donation_transfer_home_signature_tracking',
  SIGNATURE_TRACKING_CONFIRMATION = 'donation_transfer_confirmation_signature_tracking',
  SIGNATURE_TRACKING_VOUCHER = 'donation_transfer_voucher_signature_tracking',
  SIGNATURE_TRACKING_OPERATION = 'donation_transfer_operation',
}

export enum EDonationViewMode {
  DEFAULT = 'default',
  TRANSACTION_HISTORY = 'transactionHistory',
  SIGNATURE_TRACKING = 'signatureTracking',
  SIGNATURE_TRACKING_DETAIL = 'signatureTrackingDetail',
  SIGNATURE_TRACKING_OPERATION = 'signatureTrackingOperation',
}

export enum EDonationTransferUrlNavigationCollection {
  HOME = '/transfer/donations',
  DEFAULT_CONFIRMATION = '/transfer/donations/confirmation',
  DEFAULT_VOUCHER = '/transfer/donations/voucher',
  SIGNATURE_TRACKING_HOME = '/transfer/donations/st-home',
  SIGNATURE_TRACKING_CONFIRMATION = '/transfer/donations/st-confirmation',
  SIGNATURE_TRACKING_VOUCHER = '/transfer/donations/st-voucher',
  SIGNATURE_TRACKING_MODIFY_VOUCHER = '/transfer/donations/stm-voucher',
  SIGNATURE_TRACKING_OPERATION = '/transfer/donations/st-operation',
  TRANSACTION_HISTORY_VOUCHER = '/transfer/donations/th-voucher',
}
