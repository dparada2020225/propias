export interface SPFormParameters {
  title: string;
  subtitle: string;
}

export interface SPFormState {
  file: string;
  load: string;
  credits: string;
  amount: string;
}


export interface GetPayedSupplierDetailBodyRequest {
  mainClient: string;
  authorization: string;
}
