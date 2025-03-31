export interface  ICrudAchForm {
  typeClient: string;
  name: string;
  identifyBeneficiary: string;
  alias: string;
  bankName: string;
  typeAccount: string;
  currency: string;
  numberAccount: string;
  email: string;
  companyIdentifier?: string;
}


export interface  IUpdateAchForm {
  alias: string;
  name: string;
  companyIdentifier?: string;
  identifyBeneficiary: string;
  status: string;
  email: string;

}
