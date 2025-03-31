import { TLookUpACHRegisterAtomicMapped } from './tm-ach-register.interface';

export interface IAchLookUpTableParameters {
  listTransactions: TLookUpACHRegisterAtomicMapped;
  typeService: string;
  typeTransaction: string;
}
