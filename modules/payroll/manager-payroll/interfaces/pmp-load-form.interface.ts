export interface ISPLDFormParameters {
  title: string;
  subtitle: string;
}

export interface ISPLDFormState {
  file: string;
  load: string;
  credits: string;
  amount: string;
}


export interface GetPayedPayrollDetailBodyRequest {
  mainClient: string;
  authorization: string;
}
