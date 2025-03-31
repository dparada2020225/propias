export interface ITMLookUpAchRegisterMapped {
  dateParsed: string;
  hour: string;
  id: string;
  service: string;
  account: string;
  name: string;
  currency: string;
  amount: string;
  status: string;
  operation: string;
}

export interface ITMLookUpAch365RegisterMapped extends ITMLookUpAchRegisterMapped {
  date: string;
  serviceRaw: string;
  operationRaw: string;
}

export interface IUniTransactionDetailResponse {
  amount:                    number;
  status:                    string;
  receiverBankId:            string;
  destinationAccount:        string;
  destinationType:           number;
  instructionIdentification: string;
  priority:                  number;
  authorizationNumber:       string;
  recipientName:             string;
  personType:                number;
  purpose:                   string;
  dateOfBirth:               string;
  identificationType:        string;
  profession:                string;
  homeAddress:               string;
  paidOccupation:            string;
  taxIdentification:         string;
  taxRegistration:           string;
  description:               string;
  identification:            string;
  serviceType:               string;
}
