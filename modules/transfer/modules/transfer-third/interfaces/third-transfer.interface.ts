import {DateTimeFormat} from '@adf/components';
import {IAccount} from 'src/app/models/account.inteface';
import {IThirdTransfersAccounts} from '../../../interface/transfer-data-interface';

export interface IThirdTransferConfirmationVoucher {
  accountCredit: IThirdTransfersAccounts;
  accountDebited: IAccount;
  formValues: IThirdTransferFormValues;
  date: string;
  reference: string;
  title: string;
  subtitle: string;
}

export interface IInfoFavorite {
  favorite: boolean;
  typeAlert?: string | null;
  message?: string | null;
}

export interface IThirdTransferSTVoucher {
  title: string;
  subTitle: string;
  message: string;
  typeAlert?: string;
}

export interface ICrudCreateFormValues {
  email?: string;
  alias: string;
}


export interface IThirdTransferSampleVoucher {
  accountToCredit: IThirdTransfersAccounts;
  accountToDebit: IAccount;
  formValues: IThirdTransferFormValues;
  isFavorite: boolean;
  title: string;
  subtitle: string;
  reference?: string;
}

export interface IThirdTransferModal {
  accountDebited: IAccount;
  accountCredit: IThirdTransfersAccounts;
  dateTime: DateTimeFormat;
  reference: string;
  userName: string;
  formValues: IThirdTransferFormValues;
}

export interface IThirdTransferSampleVoucherCrossCoin {
  accountDebited: any;
  accountCredit: IThirdTransfersAccounts;
  amountToAccredit: number;
  exchangeRate?: number;
  formValues: IThirdTransferCrossCoinFormValues;
}

export interface IThirdTransferCrossCoinFormValues {
  email: string;
  destinationCurrency: string;
  descriptionCurrency: string;
  comment?: string;
  amountToDebit: number;
}

export interface IThirdTransferConfirmationVoucherCrossCoin extends IThirdTransferSampleVoucherCrossCoin {
  date: DateTimeFormat;
  reference: string | number;
}

export interface IPdfLayout {
  accountToDebited: IAccount;
  accountToCredit: IThirdTransfersAccounts;
  formValues: IThirdTransferFormValues;
  date: DateTimeFormat;
  referenceNumber: string;
  title: string;
  fileName: string;
}


export interface IThirdTransferFormValues {
  accountDebited: string;
  amount: string;
  email: string;
  comment: string;
}

export class ThirdTransferFormValuesBuilder {
  private readonly formsValues: IThirdTransferFormValues;

  constructor() {
    this.formsValues = {
      accountDebited: '',
      amount: '',
      email: '',
      comment: '',
    };
  }

  accountDebited(value: string) {
    this.formsValues.accountDebited = value;
    return this;
  }

  amount(value: string) {
    this.formsValues.amount = value;
    return this;
  }

  email(value: string) {
    this.formsValues.email = value;
    return this;
  }

  comment(value: string) {
    this.formsValues.comment = value;
    return this;
  }

  build() {
    return this.formsValues;
  }
}
