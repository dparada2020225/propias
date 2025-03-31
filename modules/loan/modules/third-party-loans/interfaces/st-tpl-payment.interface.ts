export interface ISTTPLPaymentNotificationBodyRequest {
  reference: string;
  amount: number;
  currency: string;
  email: string;
  identifier: string;
}

