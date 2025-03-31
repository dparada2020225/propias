export interface IS365AddAccountBodyRequest {
  clientType: string;
  account:    string;
  name:       string;
  favorite:   boolean;
  properties: AddProperties;
}

export interface IS365UpdateAccountBodyRequest {
  account:    string;
  name:       string;
  clientType: string;
  favorite:   boolean;
  properties: UpdateProperties;
}

export interface IS365DeleteAccountBodyRequest {
  account:    string;
  properties: DeleteProperties;
}

interface AddProperties {
  country:        string;
  bank:           string;
  city:           string;
  address:        string;
  favorite:       string;
  documentNumber: string;
  accountType:    string;
}

export interface UpdateProperties {
  registry:       string;
  country:        string;
  bank:           string;
  city:           string;
  address:        string;
  favorite:       string;
  documentNumber: string;
  accountType:    string;
}

export interface DeleteProperties {
  registry:       string;
  country:        string;
  bank:           string;
}

export interface IS365DeleteFavorite {
  account: string;
  properties: {
    bank: string;
    country: string;
  }
}
