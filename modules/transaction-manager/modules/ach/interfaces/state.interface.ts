import { ITMConsultACHFormValues } from '../enum/form-control-name.enum';
import { ITMAtomicACHTransactionDetail } from './tm-atomic-transaction-detail.interface';
import { ITMConsultACHLoteResponsea } from './transfer.interface';
import { ITMConsultACHMultiple365Mapped, TListConsultACHMultiple365Lote } from './tm-multiple-365.interface';
import {
  ILookUpUniTransactionLoteDetailResponseMapped,
  ITMLookUpAchUniMultipleRegisterMapped
} from './tm-uni-multiple.interface';
import {
  ILookUpMultiple365RegisterInLote,
  ILookUpTransfer368LoteMappedResponse
} from './t365-multiple-resposne.interface';

export interface ITMConsultACHHomeState {
  formValues: ITMConsultACHFormValues;
}

export interface ITMConsultACHDetailTransactionState {
  transferenceId: string;
  formValues: ITMConsultACHFormValues;
  transactionDetail: ITMAtomicACHTransactionDetail;
  from: string;
}

export interface ITMConsultACHSignatoryListState extends ITMConsultACHDetailTransactionState {
  listSignatories: Array<ListSignatories>;
}

type ListSignatories = {
  username: string,
  signatureType: string,
  date: string;
  dateFormatted: string
  hour: string;
}

export interface ITMConsultACHLote {
  formValues: ITMConsultACHFormValues;
  transaction: ITMLookUpAchUniMultipleRegisterMapped;
  from: string;
  registerInTransaction: ILookUpUniTransactionLoteDetailResponseMapped;
  view: string;
}

export interface ITMConsultACHLoteMultiple365 {
  formValues: ITMConsultACHFormValues;
  transaction: ILookUpTransfer368LoteMappedResponse;
  from: string;
  registerInTransaction: Array<ILookUpMultiple365RegisterInLote>;
  view: string;
}
