import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { IAchAccount } from './ach-account-interface';
import { IDataReading } from '@adf/components';
import { IAccount } from '../../../../../models/account.inteface';
import {
  IExecuteTransactionWithToken,
  IExecuteTransactionWithTokenFailedResponse,
} from '../../../../../models/token-service-response.interface';
import { IAchCrudTransactionResponse } from './crud/crud-create.interface';
import { ECrudAchTypeClient } from '../enum/ach-crud-control-name.enum';
import { IUpdateAchForm } from './crud/crud-form.interface';
import { IDataToSettingsACH } from './settings.interface';
import { IACHScheduleResponse } from './ach-transaction.interface';

export enum EAchTypeTransfer {
  CRUD = 'crud',
  TRANSACTION = 'transaction',
}

export interface IAchUpdateFormValues {
  name: string;
  status: string;
  email: string;
  alias: string;
  identifyBeneficiary?: string;
  companyIdentifier?: string;
}

export interface IAchFormStorageLayout {
  typeTransfer?: EAchTypeTransfer;
  action?: string;
  accountSelected?: IAchAccount;
  debitedAccountSelected?: IAccount;
  formValues?: IAchFormValues | IAchUpdateFormValues;
  voucherConfirmation?: IDataReading;
  typeClient?: ECrudAchTypeClient;
}

export interface IAchDeleteStorageLayout {
  typeTransfer?: EAchTypeTransfer;
  action: string;
  accountSelected?: IAchAccount;
  transactionResponse: IAchCrudTransactionResponse | null;
}

export interface IAchUpdateStorageLayout extends IAchDeleteStorageLayout {
  formValues?: IUpdateAchForm;
  typeClient: ECrudAchTypeClient;
}

export interface IACHTransactionResponse {
  dateTime: string;
  reference: string;
}


export interface IParametersToExecuteTransaction {
  accreditedAccount: IAchAccount;
  debitedAccount: IAccount;
  formValues: IAchFormValues;
  dataFromSettings: IDataToSettingsACH;
  omitASTransaction: boolean;
  hourSelected: IACHScheduleResponse | null;

}

export type TAchTransactionResponse = IExecuteTransactionWithToken<IACHTransactionResponse> | IExecuteTransactionWithTokenFailedResponse;

export interface IAddFavoriteACH {
  number: string;
  alias: string;
}

export interface IAchFormValues {
  accountDebited: string;
  amount: string;
  comment: string;
  schedule?: boolean;
  date?: NgbDate | null;
  hour?: string | null;
}

export class ACHFormValuesBuilder {
  private readonly formValues: IAchFormValues;

  constructor() {
    this.formValues = {
      accountDebited: '',
      amount: '',
      comment: '',
      schedule: undefined,
      date: undefined,
      hour: '',
    };
  }

  accountDebited(value: string) {
    this.formValues.accountDebited = value;
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

  date(value: NgbDate) {
    this.formValues.date = value;
    return this;
  }

  schedule(value: boolean) {
    this.formValues.schedule = value;
    return this;
  }

  hour(value: string) {
    this.formValues.hour = value;
    return this;
  }

  build() {
    return this.formValues;
  }
}
