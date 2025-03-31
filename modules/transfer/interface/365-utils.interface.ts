import { IACHBiesGeneralParameterCurrency } from '../../../models/ach-general-parameters.interface';

export interface I365TransferAmountValidParameters {
  currency: string,
  limitByUser: number,
  availableAmountInSourceAccount: number;
  currencies: Array<IACHBiesGeneralParameterCurrency>,
  amount: string;
  isT365MovilValidation?: boolean
}
