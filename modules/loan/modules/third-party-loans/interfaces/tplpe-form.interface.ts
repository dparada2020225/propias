import { IAccount } from '../../../../../models/account.inteface';
import { FormGroup } from '@angular/forms';
import { IDataSelect, ILayout } from '@adf/components';
import { IFlowError } from '../../../../../models/error.interface';
import { IThirdPartyLoanAssociate } from './crud/crud-third-party-loans-interface';

export interface ITPLPEStartupParameters {
  sourceAccounts: IAccount[] | IFlowError;
  currentLoanToPayment: IThirdPartyLoanAssociate;
}

export interface ITPLPEReturnValues {
  selectForm: FormGroup;
  partialAmountForm: FormGroup;
  options: IDataSelect[];
  error?: string;
  selectFormLayout: ILayout;
}

export interface ITPLPESourceAccountSelectedChangeResponse {
  sourceAccount: IAccount | null;
}
