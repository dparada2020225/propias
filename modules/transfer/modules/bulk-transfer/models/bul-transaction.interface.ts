import { IACHTransactionSource, IACHTransactionTarget } from '../../transfer-ach/interfaces/ach-transaction.interface';
import { ICurrentFile, IResponseLote } from './bulk-transfer.interface';
import { IAccount } from '../../../../../models/account.inteface';
import { IAchAccount } from '../../transfer-ach/interfaces/ach-account-interface';
import { IACHSettings } from '../../transfer-ach/interfaces/settings.interface';
import { IBulTransferFormValues } from '../interfaces/bulk-transfer-parameters.interface';


export interface IExecutePreTransferParameters {
  isTokenRequired: boolean;
  token: string;
  lotCode: IResponseLote;
}

export interface IExecuteBTTransactionStartupParameters {
  currentFile: ICurrentFile;
  sourceAccount: IAccount;
  associatedAccountsMap: Map<string, IAchAccount>;
  achSettings: IACHSettings[];
  formValues: IBulTransferFormValues;
}

export interface IBulkTransactionRequestBody {
    lot: number;
    cif: string;
    paymentType: string;
    formatRegister: string;
    currency: string;
    scheduleDate: string;
    fileName: string;
    source: IACHTransactionSource;
    target: IACHTransactionTarget[];
}

export class BulkTransactionBuilder {
    private readonly request: IBulkTransactionRequestBody;

    constructor() {
        this.request = {
            lot: 0,
            cif: '',
            paymentType: '',
            formatRegister: '',
            currency: '',
            scheduleDate: '',
            fileName: '',
            source: {} as IACHTransactionSource,
            target: [] as IACHTransactionTarget[],
        };
    }

    lot(value: number) {
        this.request.lot = value;
        return this;
      }


    cif(value: string) {
        this.request.cif = value;
        return this;
      }

      paymentType(value: string) {
        this.request.paymentType = value;
        return this;
      }

      formatRegister(value: string) {
        this.request.formatRegister = value;
        return this;
      }

      currency(value: string) {
        this.request.currency = value;
        return this;
      }

      scheduleDate(value: string) {
        this.request.scheduleDate = value;
        return this;
      }

      fileName(value: string) {
        this.request.fileName = value;
        return this;
      }


      source(value: IACHTransactionSource) {
        this.request.source = value;
        return this;
      }

      target(value: IACHTransactionTarget[]) {
        this.request.target = value;
        return this;
      }

      build() {
        return this.request;
      }
}
