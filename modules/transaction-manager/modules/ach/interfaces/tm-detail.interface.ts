import {
  ITMLookUpAch365RegisterMapped,
  ITMLookUpAchRegisterMapped,
  IUniTransactionDetailResponse
} from './transfer-mapped.interface';
import {
  ILookUpUniTransactionInLoteRegisterMapped,
  ITMLookUpAchUniMultipleRegisterMapped
} from './tm-uni-multiple.interface';
import { ITMAtomicACHUniIncomingTransactionDetail } from './tm-atomic-transaction-detail.interface';
import { ITransferACH365DetailMapped } from './t365-response.interface';
import {
  ILookUpMultiple365RegisterInLote,
  ILookUpTransfer368LoteMappedResponse
} from './t365-multiple-resposne.interface';

export interface ITMAchUniTransactionBuilderParameters {
  transaction: IUniTransactionDetailResponse;
  transactionSelected: ITMLookUpAchRegisterMapped;
}

export interface ITMAchUniIncomingTransactionBuilderParameters {
  transaction: ITMAtomicACHUniIncomingTransactionDetail;
  transactionSelected: ITMLookUpAchRegisterMapped;
}

export interface ITMAchUniMultipleTransactionBuilderParameters {
  transactionSelected: ILookUpUniTransactionInLoteRegisterMapped;
  loteSelected: ITMLookUpAchUniMultipleRegisterMapped;
}


export interface ITMAcn365TransactionBuilderParameters {
  transactionDetail: ITransferACH365DetailMapped;
  transactionSelected: ITMLookUpAch365RegisterMapped;
}


export interface ITMAch365MultipleTransactionBuilderParameters {
  transactionSelected: ILookUpTransfer368LoteMappedResponse;
  loteSelected: ILookUpMultiple365RegisterInLote;
}
