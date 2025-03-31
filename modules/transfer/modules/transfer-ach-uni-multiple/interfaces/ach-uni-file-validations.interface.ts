import { TRow } from '../../bulk-transfer/models/bulk-transfer.interface';
import { ITMAchUniFileLoadedList } from './ach-uni-load-file.interface';
import { ITMAchUniFormValues } from './ach-uni-form-values.interface';

export interface ITMAchUniFileValidationBaseParameters  {
  workSheetRawValues: Array<Array<TRow>>;
  fileRaw: File;
}

export interface ITmAchUnifileValidationsParameters {
  fileParsed: ITMAchUniFileLoadedList;
  formValues: ITMAchUniFormValues;
}

export interface ITMAchUniRegistersModalHelper {
  code: string;
  product: string;
  currency: string;
  account: string;
  amount: string;
  comment: string;
}

export interface ITmAchUniValidationResult {
  isValid: boolean;
  errorDescription: string;
  errorCode: string
}
