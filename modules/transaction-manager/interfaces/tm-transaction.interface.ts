export interface ITMTransaction {
  interfaceWeb: string;
  serviceCode: string;
  serviceDescription: string;
  reference: string;
  creator: string;
  creationDate: string;
  modificator: string;
  lastModificationDate: string;
  status: string;
  identification: string;
  interfaceDate: string;
  aditionalInformation: string;
  request: string;
  response: string;
  signatory: ISignatory[];
  errorDetail: string;
  amount: string;
  currency: string;
  alias: string;
  targetAlias?: string;
  serviceCodeToSearch?: string;
  dateTime?: string;
  userSignature: 'N' | 'S';
  disabled: boolean;
}

interface ISignatory {
  user: string;
  userName: string;
}

export class TMTransactionBuilder {

  private readonly transaction: ITMTransaction = {
    interfaceWeb: '',
    serviceCode: '',
    serviceDescription: '',
    reference: '',
    creator: '',
    creationDate: '',
    modificator: '',
    lastModificationDate: '',
    status: '',
    identification: '',
    interfaceDate: '',
    aditionalInformation: '',
    request: '',
    response: '',
    signatory: [],
    errorDetail: '',
    amount: '',
    currency: '',
    alias: '',
    targetAlias: '',
    serviceCodeToSearch: '',
    dateTime: '',
    userSignature: 'N',
    disabled: false,
  };

  interfaceWeb(value: string) {
    this.transaction.interfaceWeb = value;
    return this;
  }

  alias(value: string) {
    this.transaction.alias = value;
    return this;
  }

  targetAlias(value: string) {
    this.transaction.targetAlias = value;
    return this;
  }

  serviceCode(value: string) {
    this.transaction.serviceCode = value;
    return this;
  }

  serviceDescription(value: string) {
    this.transaction.serviceDescription = value;
    return this;
  }

  reference(value: string) {
    this.transaction.reference = value;
    return this;
  }

  creator(value: string) {
    this.transaction.creator = value;
    return this;
  }

  creationDate(value: string) {
    this.transaction.creationDate = value;
    return this;
  }

  modificator(value: string) {
    this.transaction.modificator = value;
    return this;
  }

  lastModificationDate(value: string) {
    this.transaction.lastModificationDate = value;
    return this;
  }

  status(value: string) {
    this.transaction.status = value;
    return this;
  }

  identification(value: string) {
    this.transaction.identification = value;
    return this;
  }

  interfaceDate(value: string) {
    this.transaction.interfaceDate = value;
    return this;
  }

  aditionalInformation(value: string) {
    this.transaction.aditionalInformation = value;
    return this;
  }

  request(value: string) {
    this.transaction.request = value;
    return this;
  }

  signatory(value: ISignatory[]) {
    this.transaction.signatory = value;
    return this;
  }


  errorDetail(value: string) {
    this.transaction.errorDetail = value;
    return this;
  }

  amount(value: string) {
    this.transaction.amount = value;
    return this;
  }

  currency(value: string) {
    this.transaction.currency = value;
    return this;
  }

  serviceCodeToSearch(value: string) {
    this.transaction.serviceCodeToSearch = value;
    return this;
  }


  dateTime(value: string) {
    this.transaction.dateTime = value;
    return this;
  }

  build() {
    return this.transaction;
  }
}
