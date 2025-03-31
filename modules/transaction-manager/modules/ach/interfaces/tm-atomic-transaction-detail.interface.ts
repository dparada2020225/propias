export interface ITMAtomicACHTransactionDetail {
  typeOperation: string;
  service: string;
  date: string;
  idTransference: string;
  sourceAccount: string;
  sourceAccountName: string;
  bankName: string;
  product: string;
  targetAccount: string;
  targetAccountName: string;
  comment: string;
  amount: string;
  currency: string;
  status:string;
  dateRaw: string;
  typeTransaction: string
}

export interface ITMAtomicACHUniIncomingTransactionDetail {
  id:                   number;
  transactionRef:       number;
  payexRef:             string;
  timestamp:            string;
  transactionKey:       string;
  coreReference:        number;
  currency:             string;
  amount:               number;
  receivingAccount:     string;
  receivingAccountType: string;
  receivingBankId:      string;
  receivingName:        string;
  cif:                  string;
  senderBankId:         string;
  senderName:           string;
  senderAccount:        string;
  message:              string;
  status:               string;
  massiveMsgId:         string;
  timestampAs400:       string;
  timestampResponse:    string;
}



export class ACHTransactionAtomicBuilder {
  private transaction: ITMAtomicACHTransactionDetail = {
    typeOperation: '',
    service: '',
    date: '',
    idTransference: '',
    sourceAccount: '',
    sourceAccountName: '',
    bankName: '',
    product: '',
    targetAccount: '',
    targetAccountName: '',
    comment: '',
    amount: '',
    currency: '',
    status: '',
    dateRaw: '',
    typeTransaction: '',
  }

  typeTransaction(value: string) {
    this.transaction.typeTransaction = value;
    return this;
  }

  typeOperation(value: string) {
    this.transaction.typeOperation = value;
    return this;
  }
  service(value: string) {
    this.transaction.service = value;
    return this;
  }
  date(value: string) {
    this.transaction.date = value;
    return this;
  }

  dateRaw(date: string, hour: string) {
    const dateFormatted = date.split('/').join('');
    const hourFormatted = hour.split(':').join('');
    this.transaction.dateRaw = `${dateFormatted}${hourFormatted}`;
    return this;
  }

  idTransference(value: string) {
    this.transaction.idTransference = value;
    return this;
  }
  sourceAccount(value: string) {
    this.transaction.sourceAccount = value;
    return this;
  }
  sourceAccountName(value: string) {
    this.transaction.sourceAccountName = value;
    return this;
  }
  targetAccount(value: string) {
    this.transaction.targetAccount = value;
    return this;
  }
  product(value: string) {
    this.transaction.product = value;
    return this;
  }

  bankName(value: string) {
    this.transaction.bankName = value;
    return this;
  }
  targetAccountName(value: string) {
    this.transaction.targetAccountName = value;
    return this;
  }
  comment(value: string) {
    this.transaction.comment = value;
    return this;
  }
  amount(value: string) {
    this.transaction.amount = value;
    return this;
  }
  currency(value: string) {
    this.transaction.currency = value;
    return this;
  }
  status(value: string) {
    this.transaction.status = value;
    return this;
  }

  build() {
    return this.transaction;
  }
}

export interface ITMACHMultipleTransactionDetail {
  operationType: string;
  dateCreated: string;
  numberTransference: string;
  sourceAccount: string;
  sourceAccountName: string;
  bankName: string;
  product: string;
  targetAccountNumber: string;
  comment: string;
  amount: string;
  currency: string;
  status: string;
}

export interface ITMLoteTransactionDetail {
  date: string;
  lote: string;
  status: string;
  sourceAccount: string;
  idTransaction?: string;
  accountName: string;
}

export interface ITMConsultACHLoteVoucherParameters {
  transaction: ITMLoteTransactionDetail;
}

export interface ITMAtomicACHTransactionDetailVoucherParameters {
  transaction: ITMAtomicACHTransactionDetail;
  typeService: string;
  className?: string;
}

export interface ITMAtomicACHTransactionDetailModalParameters extends ITMAtomicACHTransactionDetailVoucherParameters {
  title: string;
}

export interface ITMAtomicACHTransactionDetailPdfParameters extends ITMAtomicACHTransactionDetailVoucherParameters {
  title: string;
  fileName: string;
}
