
export interface  ITMRequestDetailACHBiesTransaction {
  sourceProduct:                        string;
  sourceSubProduct:                     string;
  sourceAccount:                        string;
  sourceCurrency:                       string;
  sourceAmount:                         string;
  sourceAmountParsed:                   string;
  codeBank:                             string;
  targetProduct:                        string;
  targetAccount:                        string;
  targetCurrency:                       string;
  targetAmount:                         string;
  comment:                              string;
  originalTransaction:                  string;
  numLote:                              string;
  typeService:                          string;
  targetIdentify:                       string;
  sourceCurrency2:                      string;
  sourceAlias:                          string;
  sourceAccountDescription:             string;
  targetAccountName:                    string;
  targetBankName:                       string;
  targetAccountStatus:                  string;
  targetProduct2:                       string;
  targetDateCrated:                     string;
  targetUserCreated:                    string;
  targetDateModify:                     string;
  targetUserModify:                     string;
  targetEmail:                          string;
  targetAccount2:                       string;
  bankInternalCode:                     string;
  descriptionTypeAccount:               string;
  proposalCode:                         string;
  codeTypeOperation365Business:         string;
  descriptionTypeOperation365Business:  string;
  codeTypeOperationOriginal365Business: string;
  codeTypePayment365Business:           string;
  descriptionTypePayment365Business:    string;
  commission:                           string;
  typeACH:                              string;
  uniCommission: string;
  UniCommissionParsed: string;
}


export interface  ITMRequestDetailACHSipaBiesTransaction {
  sourceProduct:          string;
  sourceSubProduct:       string;
  sourceAccount:          string;
  sourceCurrency:         string;
  sourceAmount:           string;
  sourceAmountParsed:     string;
  valueUnknown:           string;
  targetAccount:          string;
  targetCurrency:         string;
  comment:                string;
  originalTransaction:    string;
  numLote:                string;
  typeService:            string;
  countryCode:            string;
  reasonCode: string;
  bankCode: string;
  targetProduct: string;
}
