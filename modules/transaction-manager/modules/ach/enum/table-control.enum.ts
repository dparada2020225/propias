export enum ETMConsultACHAtomicTransferenceTableKeys {
  DATE = 'dateParsed',
  OPERATION = 'operation',
  SERVICE = 'service',
  ID = 'id',
  ACCOUNT = 'account',
  NAME = 'name',
  CURRENCY = 'currency',
  AMOUNT = 'amount',
  STATUS = 'status',
}

export enum ETMConsultACHMultipleTransferenceTableKeys {
  DATE = 'dateParsed',
  LOTE = 'lote',
  AMOUNT = 'total',
  STATUS = 'status'
}

export enum ETMConsultACHSignatoryTableKeys {
  USERNAME = 'username',
  SIGNATURE_TYPE = 'signatureType',
  DATE = 'dateFormatted',
  HOUR = 'hour',
}

export enum ETMConsultACHLoteTableKeys {
  ID = 'id',
  BANK_NAME = 'bankName',
  PRODUCT = 'product',
  CURRENCY = 'currency',
  ACCOUNT = 'account',
  AMOUNT = 'amount',
  COMMENT = 'comment'
}

export enum ETMConsultACHMultiple365TableKeys {
  DATE = 'dateParsed',
  OPERATION = 'typeOperation',
  LOTE = 'lote',
  ACCOUNT = 'account',
  NAME = 'accountName',
  CURRENCY = 'currency',
  AMOUNT = 'amount',
  STATUS = 'status',
}

export enum ETMConsultACH365LoteTableKeys {
  ID = 'id',
  BANK_NAME = 'bankName',
  PRODUCT = 'product',
  CURRENCY = 'currency',
  ACCOUNT = 'account',
  TARGET_ACCOUNT_NAME = 'name',
  TYPE_CLIENT = 'typeClientParsed',
  AMOUNT = 'amount',
  EMAIL = 'email',
  COMMENT = 'comment'
}
