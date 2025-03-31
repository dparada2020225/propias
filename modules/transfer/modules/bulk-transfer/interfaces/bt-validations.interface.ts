import { IBTFileResponse, TRow } from '../models/bulk-transfer.interface';
import { EventEmitter } from '@angular/core';
import { IAchAccount } from '../../transfer-ach/interfaces/ach-account-interface';
import { IAccount } from '../../../../../models/account.inteface';

export interface IValidationStartupParameters {
  file: File;
  emiteFile: EventEmitter<IBTFileResponse>;
  associatedAccounts: IAchAccount[];
  sourceAccounts: IAccount[];
  workSheetRawValues: Array<Array<TRow>>;
}
