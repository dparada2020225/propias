export interface IM365DisaffiliateBodyRequest {
  account: string;
}

export interface IM365AffiliateBodyRequest {
  account: string;
  properties: {
    phone: string;
  }
}

export interface IM365UpdateAffiliationBodyRequest extends IM365AffiliateBodyRequest {
  oldAccount: string;
}
