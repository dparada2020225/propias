export interface IB2bConsultationDetail {
  b2bID: string;
  account: string;
  name: string;
  product: string;
  status: string;
  dueDate: string;
  subStatus: string;
  term: string;
  amountGranted: number;
  warranty: string;
  concession: string;
  effectiveRate: number;
  nominalRate: number;
  nextPaymentDate: string;
  balance: IB2bConsultationBalance;
  reference: string;
}

export interface IB2bConsultationBalance {
  capitalToDate: number;
  interest: number;
  delinquentBalance: number;
  additionalCharger: number;
  totalBalance: number;
  nexInstallmentValue: number;
  marginTurning: number;
  totalCancellationBalance: number;
}
