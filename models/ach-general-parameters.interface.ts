export interface IACHBiesGeneralParameters {
  general:    IACHBiesGeneralParameterGeneral;
  currencies: Array<IACHBiesGeneralParameterCurrency>;
  products:   Array<IACHBiesGeneralParameterProduct>;
  banks:      Array<IACHBiesGeneralParameterBank>;
}

export class BisvGeneralParameters {
  private parameters: IACHBiesGeneralParameters = {
    general: {
      listDocuments: [],
      fileName: '',
      formatRegister: '',
      idAddendum: '',
      idDetail: '',
      idHeader: '',
    },
    currencies: [],
    products: [],
    banks: [],
  }

  build() {
    return this.parameters;
  }
}


export interface IACHBiesGeneralParameterBank {
  code:                            string;
  description:                     string;
  isAccountUseAccountAlphanumeric: string;
  participant:                     string;
  routes:                          Array<IACHBiesGeneralParameterRoute>;
  products:                        Array<IACHBiesGeneralParameterBankProduct>;
}

export interface IACHBiesGeneralParameterBankProduct {
  code:              number;
  lowerAccountLimit: number;
  maxAccountLimit:   number;
}

export interface IACHBiesGeneralParameterRoute {
  currency: string;
  code:     string;
}

export interface IACHBiesGeneralParameterCurrency {
  code:                string;
  name:                string;
  institutionId:       number;
  lowerNaturalLimit:   number;
  upperNaturaLimit:    number;
  loweLegalLimit:      number;
  upperLegalLimit:     number;
  lowerT365MovilLimit: number;
  upperT365MovilLimit: number;
  lowerBusinessLimit:  number;
  upperBusinessLimit:  number;
}

export interface IACHBiesGeneralParameterGeneral {
  formatRegister: string;
  idHeader:       string;
  idDetail:       string;
  idAddendum:     string;
  fileName:       string;
  listDocuments:  Array<IACHBiesGeneralParameterListDocument>;
}

export interface IACHBiesGeneralParameterListDocument {
  identificationId: string;
  description:      string;
  mask:             string;
}

export interface IACHBiesGeneralParameterProduct {
  code:            number;
  description:     string;
  transactionCode: number;
  nemonic:         string;
}
