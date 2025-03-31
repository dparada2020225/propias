import { ICurrentFile, IDetailFile, IHeadingFile } from '../models/bulk-transfer.interface';
import { IAccount } from '../../../../../models/account.inteface';
import { IAChBulkTransferAccount } from '../../transfer-ach/interfaces/ach-account-interface';

export interface  IBulkTransferVoucherDefinitionParameters {
  currentFile: ICurrentFile;
  reference: string;
  datetime: string;
  sourceAccount: IAccount;
  tittle?: string;
  subtitle?: string;
}

export interface IBTDVoucherBuilder {
  date: string;
  titlePdf: string;
  reference: string;
  fileNamePdf: string;
  targetAccounts: IAChBulkTransferAccount[];
  sourceAccount: IAccount;
  currentFile: ICurrentFile;
  formValues: any;
  title: string;
  subtitle: string;
}

export class HeadingFileBuilder {
  private readonly heading: IHeadingFile;

  constructor() {
    this.heading = {
      key: '',
      sourceAccount: '',
      credits: 0,
      totalAmount: 0,
      currency: '',
    };
  }

  key(value: string) {
    this.heading.key = value;
    return this;
  }

  sourceAccount(value: string) {
    this.heading.sourceAccount = value;
    return this;
  }

  credits(value: number) {
    this.heading.credits = value;
    return this;
  }

  totalAmount(value: number) {
    this.heading.totalAmount = value;
    return this;
  }

  currency(value: string) {
    this.heading.currency = value;
    return this;
  }

  build() {
    return this.heading;
  }
}

export class CurrentFileBuilder {
  private readonly currentFile: ICurrentFile;

  constructor() {
    this.currentFile = {
      heading: {} as IHeadingFile,
      details: [],
    };
  }

  heading(value: IHeadingFile) {
    this.currentFile.heading = value;
    return this;
  }

  detail(value: IDetailFile[]) {
    this.currentFile.details = value;
    return this;
  }

  build() {
    return this.currentFile;
  }
}
