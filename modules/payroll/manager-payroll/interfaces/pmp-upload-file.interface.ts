import { IBTFileResponse, TRow } from '../../../transfer/modules/bulk-transfer/models/bulk-transfer.interface';
import { EventEmitter } from '@angular/core';
import { EProfile } from '../../../../enums/profile.enum';

export interface ISPPFormStatus {
  credits: string;
  totalAmount: string;
}

export interface ISPPFileStartupParameters {
  file: File;
  emiteFile: EventEmitter<ISPPFile>;
  workSheetRawValues: Array<Array<TRow>>;
  formValues: ISPPFormStatus
  profile: EProfile;
  maxRegistersAllowed: number;
}

export interface ISPPBuildCsvFileParameters {
  formValues: ISPPFormStatus
  fileRegisters: TSPPFileParsed
}

export interface ISPPBuildCsvFileParametersSV extends Omit<ISPPBuildCsvFileParameters, 'formValues'> {}

export interface ISPPFileStructure {
  accountNumber: string;
  amount: string;
  accountName?: string;
  email?: string;
  detail?: string;
}

export interface ISPPFStructureParsed extends Omit<ISPPFormStatus, 'typeLoad'> {
  accounts: Array<ISPPFileStructure>
}

export type TSPPFileStructure = Array<Array<TRow>>
export type TSPPFileParsed = Array<ISPPFileStructure>
export interface ISPPFile extends Omit<IBTFileResponse, 'currentFile'> {
  currentFile: ISPPFStructureParsed | null
}

export interface ISPPFileValidationsResponse {
  currentFile: ISPPFStructureParsed | null;
  file: File | null;
  fileStatus: 'success' | 'failed';
  message: string;
  messageStatus: 'success' | 'warning';
}
