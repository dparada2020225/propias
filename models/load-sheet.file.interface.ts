import { TRow } from '../modules/transfer/modules/bulk-transfer/models/bulk-transfer.interface';

export type TypeFileLoaded = 'csv' | 'plain' | 'sap' | 'txt' | 'json'

export interface ILoadCsvFileParameters {
  fileName: string;
  fileStructure: string;
  typeFile: TypeFileLoaded;
}

export interface parseArrayToObjLoadedFile {
  list: TRow[];
  keys: string[];
  setValueInNull: (key: string) => any;
  parseFileValues: (value: TRow, key: string) => any;
}

export interface IParseWorkSheetValues extends Omit<parseArrayToObjLoadedFile, 'list'> {
  list: Array<Array<TRow>>;
}
