
export enum ESignatureTrackingTypeAction {
  MODIFY = 'MODIFY',
  DELETE = 'DELETE',
  REJECT = 'RETURN',
  PROCESS = 'PROCESS',
  AUTHORIZE = 'AUTHORIZE',
  VIEW = 'DETAIL',
  VIEW_SIGNATORY = 'VIEW_SIGNATORY',
  SEND = 'SEND'
}


export enum ESTTableOptions {
  UPDATE = 'modify_option',
  DELETE = 'delete',
  VIEW = 'viewDetail_option',
  VIEW_SIGNATURE = 'view_signature',
  REJECT = 'reject',
  SEND = 'send',
  AUTHORIZE = 'authorize',
  PROCESS = 'process',
}

export enum ETabPosition {
  ENTERED = 0,
  TO_AUTHORIZE = 1,
  AUTHORIZED = 2,
}

export enum ETableType {
  ENTERED = 'entered',
  TO_AUTHORIZE = 'toAuthorize',
  AUTHORIZED = 'authorized'
}

export enum ETabStep {
  ENTERED = 'ADMITTED',
  TO_AUTHORIZE = 'TO_AUTHORIZE',
  AUTHORIZED = 'AUTHORIZED'
}

export enum EEmbeddedTransactionStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

