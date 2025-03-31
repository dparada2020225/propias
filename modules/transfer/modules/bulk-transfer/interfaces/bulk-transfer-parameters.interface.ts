import { ICurrentFile, IHeadingFile, IPreResponseBulkT } from '../models/bulk-transfer.interface';
import { IAccount } from '../../../../../models/account.inteface';
import { IAChBulkTransferAccount } from '../../transfer-ach/interfaces/ach-account-interface';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ITMTransaction } from '../../../../transaction-manager/interfaces/tm-transaction.interface';
import { EBTTypeTransaction } from '../enum/bt-view.enum';

export interface IBulTransferFormValues {
  schedule: boolean;
  date: NgbDate;
  hour: string;
}


export interface IBulkTransferConfirmState {
  currentFile: ICurrentFile;
  detailTransaction?: IHeadingFile;
  transactionResponse: IPreResponseBulkT;
  sourceAccount: IAccount;
  formValues?: IBulTransferFormValues;
  targetAccounts?: IAChBulkTransferAccount[];
  isSignatureTrackingTransaction?: boolean;
  messageTransaction?: string;
  fileName?: string;
  typeTransaction?: EBTTypeTransaction;
  action?: string;
  position?: number;
}

export interface IBTDetailState {
  transactionDetail: any;
  transactionSelected: ITMTransaction;
  action?: string;
  position?: number;
}
