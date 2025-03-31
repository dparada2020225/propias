import { ITMAtomicACHTransactionDetail } from './tm-atomic-transaction-detail.interface';

export interface ITMConsultAtomicACHVoucherParameters {
  transaction: ITMAtomicACHTransactionDetail;
  typeService: string;
}
