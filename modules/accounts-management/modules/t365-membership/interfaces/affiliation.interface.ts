export interface IM365AffiliationAccount {
  name:           string;
  alias:          string;
  favorite:       boolean;
  useAnyCurrency: boolean;
  account:        string;
}

export type IS365AffiliationAccountList = Array<IM365AffiliationAccount>;
