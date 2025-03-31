import { ITMTransaction } from '../../../interfaces/tm-transaction.interface';

export interface ITransactionHistory extends ITMTransaction{
  serviceCodeToSearch?: string;
}

export interface ITHBodyRequest {
  signatureType: string;
  service: string;
  initialDate: string;
  finalDate: string;
}
