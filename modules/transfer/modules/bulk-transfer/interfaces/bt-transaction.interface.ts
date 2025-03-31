import {
  IExecuteTransactionWithToken,
  IExecuteTransactionWithTokenFailedResponse
} from '../../../../../models/token-service-response.interface';
import { ICurrentFile, IPreResponseBulkT } from '../models/bulk-transfer.interface';
import { IAchAccount } from '../../transfer-ach/interfaces/ach-account-interface';
import { IACHSettings } from '../../transfer-ach/interfaces/settings.interface';

export interface IBTSaveTransactionRequest {
  company: string;
  lotCode: string;
  details: IBTSaveTransactionDetailRequest[];
}

export interface IBTDetailBodyRequest {
  company: string;
  lotCode: string;
}

export type TBTExecuteTransaction = IExecuteTransactionWithToken<IPreResponseBulkT> | IExecuteTransactionWithTokenFailedResponse;


export interface IBTSaveTransactionDetailRequest {
  account: string;
  accountType: string;
  amount: any;
  institution: string;
  institutionId: string;
  participant: string;
  programmedTransfer: boolean;
  transferDate: string;
  transferHour: string;
}

export interface IBTTargetAccountBuilderMap {
  associatedAccountsMap: Map<string, IAchAccount>;
  currentFile: ICurrentFile;
  achSettings: IACHSettings[];
}

export interface IBTSaveTransactionResponse {
  code: string;
  message: string;
  dateTime: string;
}

export class BTSaveTransactionBuilder {
  private readonly saveTransaction: IBTSaveTransactionDetailRequest;

  constructor() {
    this.saveTransaction = {
      account: '',
      accountType: '',
      amount: undefined,
      institution: '',
      institutionId: '',
      participant: '',
      programmedTransfer: false,
      transferDate: '',
      transferHour: '',
    };
  }

  account(value: string) {
    this.saveTransaction.account = value;
    return this;
  }

  accountType(value: string) {
    this.saveTransaction.accountType = value;
    return this;
  }

  amount(value: any) {
    this.saveTransaction.amount = value;
    return this;
  }

  institution(value: string) {
    this.saveTransaction.institution = value;
    return this;
  }

  institutionId(value: string) {
    this.saveTransaction.institutionId = value;
    return this;
  }

  participant(value: string) {
    this.saveTransaction.participant = value;
    return this;
  }

  programmedTransfer(value: boolean) {
    this.saveTransaction.programmedTransfer = value;
    return this;
  }

  transferDate(value: string) {
    this.saveTransaction.transferDate = value;
    return this;
  }

  transferHour(value: string) {
    this.saveTransaction.transferHour = value;
    return this;
  }

  build() {
    return this.saveTransaction;
  }
}
