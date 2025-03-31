
interface IBaseFormValues {
  sourceAccount: string;
  beneficiary: string;
  bank: string;
  numberPhone: string;
  amount: string;
  comment: string;
}

export interface IM365BaseFormValues {
  sourceAccount: string;
  beneficiary: string;
  bank: string;
}

export interface IFormValuesForEnteredOption extends IBaseFormValues {
  nameBeneficiary: string;
  email: string;
}

export interface IFormValuesForRegisteredOption extends IBaseFormValues {
  isShowFavorites: string;
}

export type IM365FormValues = IFormValuesForEnteredOption | IFormValuesForRegisteredOption;


