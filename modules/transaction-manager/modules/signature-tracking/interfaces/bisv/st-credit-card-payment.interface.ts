export interface IStBISVCreditCardPaymentNotifyRequest {
  cardName:     string;
  debitAccount: string;
  cardNumber:   string;
  amount:       string;
  currency:     string;
  debitAmount:  string;
  reference:    string;
  lps:          string;
  dls:          string;
  trx:          string;
  mode:         string;
}
