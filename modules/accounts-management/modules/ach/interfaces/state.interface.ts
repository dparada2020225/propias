import {
  IACHBiesGeneralParameterBank,
  IACHBiesGeneralParameterCurrency, IACHBiesGeneralParameterListDocument,
  IACHBiesGeneralParameterProduct,
  IACHBiesGeneralParameterRoute
} from '../../../../../models/ach-general-parameters.interface';
import { V3IAchAccount } from '../../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';


export interface IAMACHFormValues {
  typeCustomer: string;
  bank: string;
  typeAccount: string;
  currency: string;
  account: string;
  name: string;
  email: string;
  typeIdentifier: string;
  noIdentifier: string;
  reason: string;
  ownAccount: boolean;
  isAddToFavorites: boolean;
}

export interface IAMAACHUpdateFormValues {
  name: string;
  email: string;
  typeIdentifier: string;
  noIdentifier: string;
  reason: string;
  status: string;
  ownAccount: boolean;
}

export interface IAMACHHomeSTate {
  formValues: IAMACHFormValues;
  currencySelected: IACHBiesGeneralParameterRoute;
  productSelected: IACHBiesGeneralParameterProduct;
  bankSelected: IACHBiesGeneralParameterBank;
  typeClientSelected: any;
  documentIdentificationSelected: IACHBiesGeneralParameterListDocument;
  reasonSelected: any;
}

export interface IAMACHConfirmationState extends IAMACHHomeSTate {
  transactionResponse: any;
}


export interface IAMACHDetailState {
  account: V3IAchAccount;
}

export interface IAMACHHomeUpdateState {
  account: V3IAchAccount;
  formValues: IAMAACHUpdateFormValues;
  reasonSelected: any;
  documentTypeLabel: string;
  id: string;
}

export interface IAMACHConfirmationUpdateState extends IAMACHHomeUpdateState {
  transactionResponse: any;
}

export interface IAMACHConfirmationDeleteState {
  transactionResponse: any;
  account: V3IAchAccount;
  documentTypeLabel: string;
}
