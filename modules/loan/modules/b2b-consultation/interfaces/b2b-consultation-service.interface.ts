export interface IB2bConsultationAccounts {
  b2bID: string;
  name: string;
  balance: number;
  dueDate: string;
}

export interface IB2bConsultationErrorResponse {
  message: string;
  error: string;
  status: number;
}

export interface IB2bConsultationAccountsResponse {
  accounts: IB2bConsultationAccounts[];
}
