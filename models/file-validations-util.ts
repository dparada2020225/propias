import { TRow } from "../modules/transfer/modules/bulk-transfer/models/bulk-transfer.interface";

export interface IParseWorkSheetValuesParameters {
  list: TRow[];
  keys: string[];
  setValueInNull: (key: string) => any;
  parseFileValues: (value: string | number, key: string) => any;
}
export interface LoadSheetCreateFileToUploadParameters<T = any> {
  fileStructure: T
  fileName: string;
  typeFile: string;
}
