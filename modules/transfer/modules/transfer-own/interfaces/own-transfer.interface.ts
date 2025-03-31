import { IResponseOwnTransfers } from './own-transfer-respoce.interface';
import { EOwnTransferTypeTransaction } from '../enum/own-transfer-control-name.enum';
import { ITMTransaction } from '../../../../transaction-manager/interfaces/tm-transaction.interface';
import { ITransactionManagerRequestDetail } from 'src/app/modules/transaction-manager/interfaces/transaction-manger.interface';

export interface ILayoutVoucherSimple {
  amount: number;
  comment?: string;
}

export interface IOwnTransferFormValues {
  accountDebited: string;
  accountCredit: string;
  amount: string;
  comment: string;
}
export interface IOwnTransferExecuteProperties {
  reference?: string;
  date?: string;
  accountToDebit: IOwnAccount | undefined;
  accountToCredit: IOwnAccount | undefined;
  formValues: IOwnTransferFormValues | any;
}

export interface IOwnTransferSTVoucherParam {
  title: string;
  subTitle: string;
  message: string;
}

export interface IOwnTransferState {
  debitedAccount: IOwnAccount;
  accreditAccount: IOwnAccount;
  formValues: IOwnTransferFormValues;
  transactionResponse?: IResponseOwnTransfers;
  typeTransaction?: EOwnTransferTypeTransaction;
  transactionManagerDetail?: ITransactionManagerRequestDetail;
  transactionSelected?: ITMTransaction;
  message?: string;

}

export interface IOWnTransferStorageState extends IOwnTransferExecuteProperties {
  step: number;
  accountDebitNumber?: string;
}

export interface IOwnAccount {
  account: string;
  agency: number;
  alias: string;
  availableAmount: number;
  cif: string;
  consortium: string;
  currency: string;
  enabled: boolean;
  mask: string;
  name: string;
  product: number;
  status: string;
  subproduct: number;
  totalAmount: number;
}

export class OwnTransferAccount {
  private readonly ownAccount: IOwnAccount;

  constructor() {
    this.ownAccount = {
      account: '',
      agency: 0,
      alias: '',
      availableAmount: 0,
      cif: '',
      consortium: '',
      currency: '',
      enabled: false,
      mask: '',
      name: '',
      product: 0,
      status: '',
      subproduct: 0,
      totalAmount: 0,
    };
  }

  account(value: string) {
    this.ownAccount.account = value;
    return this;
  }

  agency(value: number) {
    this.ownAccount.agency = value;
    return this;
  }

  alias(value: string) {
    this.ownAccount.alias = value;
    return this;
  }

  availableAmount(value: number) {
    this.ownAccount.availableAmount = value;
    return this;
  }

  cif(value: string) {
    this.ownAccount.cif = value;
    return this;
  }

  consortium(value: string) {
    this.ownAccount.consortium = value;
    return this;
  }

  currency(value: string) {
    this.ownAccount.currency = value;
    return this;
  }

  enabled(value: boolean) {
    this.ownAccount.enabled = value;
    return this;
  }

  mask(value: string) {
    this.ownAccount.mask = value;
    return this;
  }

  name(value: string) {
    this.ownAccount.name = value;
    return this;
  }

  product(value: number) {
    this.ownAccount.product = value;
    return this;
  }

  status(value: string) {
    this.ownAccount.status = value;
    return this;
  }

  subproduct(value: number) {
    this.ownAccount.subproduct = value;
    return this;
  }

  totalAmount(value: any) {
    this.ownAccount.totalAmount = value;
    return this;
  }

  build() {
    return this.ownAccount;
  }
}

export class OwnTransferFormValuesBuilder {
  private readonly formValues: IOwnTransferFormValues;

  constructor() {
    this.formValues = {
      accountDebited: '',
      accountCredit: '',
      amount: '',
      comment: '',
    };
  }

  accountDebited(value: string) {
    this.formValues.accountDebited = value;
    return this;
  }

  accountCredit(value: string) {
    this.formValues.accountCredit = value;
    return this;
  }

  amount(value: string) {
    this.formValues.amount = value;
    return this;
  }

  comment(value: string) {
    this.formValues.comment = value;
    return this;
  }

  build() {
    return this.formValues;
  }
}


export interface IExecuteOwnTransfer {
  sourceAccount: string;
  sourceProduct: string;
  sourceSubProduct: string;
  sourceCurrency: string;
  sourceAlias: string;
  targetAccount: string;
  targetProduct: string;
  targetSubProduct: string;
  targetCurrency: string;
  targetAlias: string;
  amount: number;
  notify: boolean;
  description: string;
  email: string;
}
