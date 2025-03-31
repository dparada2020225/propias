export interface  ICrudAchUniForm {
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


export interface  IUpdateAchUniForm {
  alias: string;
  name: string;
  companyIdentifier?: string;
  identifyBeneficiary: string;
  status: string;
  email: string;

}
