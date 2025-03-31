import { IDataSelect, ILayout } from "@adf/components"
import { FormGroup } from "@angular/forms"
import { IAccount } from '../../../../../models/account.inteface';
import { IDonationAccount, IDonationExecuteDescription } from './donation-account.interface';
import {
  IExecuteTransactionWithToken,
  IExecuteTransactionWithTokenFailedResponse
} from '../../../../../models/token-service-response.interface';
import { IFlowError } from "src/app/models/error.interface";

export interface IDTEInitStep1 {
  title: string,
  subtitle: string | null,
  accountDebitList: IAccount[] | IFlowError,
  accountFundationList: IDonationAccount[] | IFlowError
}

export interface IDTEInitStep1Response {
  donationLayout: ILayout,
  donationTransferForm: FormGroup,
  optionsList: IDataSelect[],
  error: string
}


export type TTransactionDonationResponse = IExecuteTransactionWithToken<IDonationExecuteDescription> | IExecuteTransactionWithTokenFailedResponse;
