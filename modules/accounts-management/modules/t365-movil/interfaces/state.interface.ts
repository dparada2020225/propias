import { IACHBiesGeneralParameterBank } from '../../../../../models/ach-general-parameters.interface';
import { IAM365CreateFormState } from './form.interface';
import { AM365Account } from './associated-account.interface';

export interface AM365CreateHomeState {
  account: AM365Account;
  bankSelected: IACHBiesGeneralParameterBank;
  formValues: IAM365CreateFormState;
}

export interface IAM365CreateConfirmState extends AM365CreateHomeState {
  transactionResponse: any;
}

export interface IAM365DetailState {
  account: AM365Account;
}

export interface IAM365HomeUpdateState {
  account: AM365Account;
  formValues: IAM365CreateFormState;
  bankSelected: IACHBiesGeneralParameterBank;
}

export interface IAM365ConfirmationUpdateState extends IAM365HomeUpdateState {
  transactionResponse: any;
}

export interface IAM365ConfirmationDeleteState {
  transactionResponse: any;
  account: AM365Account;
}
