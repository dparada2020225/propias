
export interface I365TransferRequest {
  sourceProduct:                     string;
  sourceSubproduct:                  string;
  sourceAccountNumber:               string;
  sourceCurrency:                    string;
  sourceAmount:                      string;
  targetBank:                        string;
  targetProduct:                     string;
  targetAccountNumber:               string;
  targetCurrency:                    string;
  targetAmount:                      string;
  commentary:                        string;
  targetAccountIdentificationNumber: string;
  clientType:                        string;
  clientNumber:                      string;
  sourceAccountName:                 string;
  targetAccountType:                 string;
  targetAccountIdentificationType:   string;
  targetAccountName:                 string;
  targetAccountStatus:               string;
  targetBankName:                    string;
  targetAccountEmail:                string;
  targetAccountCreationDate:         string;
  targetAccountModificationDate:     string;
  targetAccountCreationUser:         string;
  targetAccountModificationUser:     string;
  omitASTransaction:                 boolean;
  serviceType:                       string;
  achTransferenceType:               string;
  clientId?:                          string;
  purpose?: string;
  transferReason?: string,
  scheduleDateTime?: string,
  country?: string
  commission?: string;
}



export class S365TransferRequestBuilder {
  private request: I365TransferRequest = {
    sourceProduct: '',
    sourceSubproduct: '',
    sourceAccountNumber: '',
    sourceCurrency: '',
    sourceAmount: '',
    targetBank: '',
    targetProduct: '',
    targetAccountNumber: '',
    targetCurrency: '',
    targetAmount: '',
    commentary: '',
    targetAccountIdentificationNumber: "",
    clientType: '',
    clientNumber: '',
    sourceAccountName: '',
    targetAccountType: '',
    targetAccountIdentificationType: '',
    targetAccountName: '',
    targetAccountStatus: '',
    targetBankName: '',
    targetAccountEmail: '',
    targetAccountCreationDate: '',
    targetAccountModificationDate: '',
    targetAccountCreationUser: '',
    targetAccountModificationUser: '',
    omitASTransaction: false,
    serviceType: '',
    achTransferenceType: '',
    purpose: '',
  }

  purpose(value: string) {
    this.request.purpose = value;
    return this;
  }

  commission(value: string) {
    this.request.commission = value;
    return this;
  }

  sourceProduct(value: string) {
    this.request.sourceProduct = value;
    return this;
  }

  sourceSubProduct(value: string) {
    this.request.sourceSubproduct = value;
    return this;
  }

  sourceAccountNumber(value: string) {
    this.request.sourceAccountNumber = value;
    return this;
  }

  sourceCurrency(value: string) {
    this.request.sourceCurrency = value;
    return this;
  }

  sourceAmount(value: string) {
    this.request.sourceAmount = value;
    return this;
  }

  targetBank(value: string) {
    this.request.targetBank = value;
    return this;
  }

  targetProduct(value: string) {
    this.request.targetProduct = value;
    return this;
  }


  targetAccountNumber(value: string) {
    this.request.targetAccountNumber = value;
    return this;
  }

  targetCurrency(value: string) {
    this.request.targetCurrency = value;
    return this;
  }

  targetAmount(value: string) {
    this.request.targetAmount = value;
    return this;
  }

  commentary(value: string) {
    this.request.commentary = value;
    return this;
  }

  targetAccountIdentificationNumber(value: string) {
    this.request.targetAccountIdentificationNumber = value;
    return this;
  }

  clientType(value: string) {
    this.request.clientType = value;
    return this;
  }

  clientNumber(value: string) {
    this.request.clientNumber = value;
    return this;
  }

  sourceAccountName(value: string) {
    this.request.sourceAccountName = value;
    return this;
  }

  targetAccountType(value: string) {
    this.request.targetAccountType = value;
    return this;
  }

  targetAccountIdentificationType(value: string) {
    this.request.targetAccountIdentificationType = value;
    return this;
  }

  targetAccountName(value: string) {
    this.request.targetAccountName = value;
    return this;
  }

  targetAccountStatus(value: string) {
    this.request.targetAccountStatus = value;
    return this;
  }

  targetBankName(value: string) {
    this.request.targetBankName = value;
    return this;
  }

  targetAccountEmail(value: string) {
    this.request.targetAccountEmail = value;
    return this;
  }

  targetAccountCreationDate(value: string) {
    this.request.targetAccountCreationDate = value;
    return this;
  }


  targetAccountModificationDate(value: string) {
    this.request.targetAccountModificationDate = value;
    return this;
  }

  targetAccountCreationUser(value: string) {
    this.request.targetAccountCreationUser = value;
    return this;
  }

  targetAccountModificationUser(value: string) {
    this.request.targetAccountModificationUser = value;
    return this;
  }

  omitASTransaction(value?: boolean) {
    this.request.omitASTransaction = value ?? true;
    return this;
  }

  serviceType(value: string) {
    this.request.serviceType = value;
    return this;
  }


  achTransferenceType(value: string) {
    this.request.achTransferenceType = value;
    return this;
  }

  clientId(value: string) {
    // this.request.clientId = value;
    return this;
  }

  transferReason(value: string) {
    this.request.transferReason = value;
    return this;
  }

  scheduleDateTime(value: string) {
    this.request.scheduleDateTime = value;
    return this;
  }
  country(value: string) {
    this.request.country = value;
    return this;
  }

  build() {
    return this.request;
  }
}

