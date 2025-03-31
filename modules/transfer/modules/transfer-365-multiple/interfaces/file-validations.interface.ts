import { TRow } from '../../bulk-transfer/models/bulk-transfer.interface';
import { ITM365FileLoadedList } from './load-file.interface';
import { ITM365FormValues } from './form-values.interface';

export interface ITM365FileValidationBaseParameters  {
  workSheetRawValues: Array<Array<TRow>>;
  fileRaw: File;
}

export interface fileValidationsParameters {
  fileParsed: ITM365FileLoadedList;
  formValues: ITM365FormValues;
}

export interface ITM365RegistersModalHelper {
  code: string;
  name: string;
  shortName: string;
}

