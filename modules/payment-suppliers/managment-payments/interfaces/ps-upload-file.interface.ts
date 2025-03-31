import { IBTFileResponse, TRow } from '../../../transfer/modules/bulk-transfer/models/bulk-transfer.interface';
import { EventEmitter } from '@angular/core';
import { EProfile } from '../../../../enums/profile.enum';

export interface SPFormStatus {
  credits: string;
  totalAmount: string;
}

export interface SPFileStartupParameters {
  file: File;
  emiteFile: EventEmitter<SPPPFile>;
  workSheetRawValues: Array<Array<TRow>>;
  formValues: SPFormStatus
  profile: EProfile;
  maxRegistersAllowed: number;
}

export interface SPBuildCsvFileParameters {
  formValues: SPFormStatus
  fileRegisters: SPFileParsed
}

export interface SPBuildCsvFileParametersSV extends Omit<SPBuildCsvFileParameters, 'formValues'> {}

export interface PSPPFileStructure {
  accountNumber: string;
  amount: string;
  status?: string;
  accountName?: string;
  email?: string;
  detail?: string;
}

export interface SPStructureParsed extends Omit<SPFormStatus, 'typeLoad'> {
  accounts: Array<PSPPFileStructure>
}

export type SPFileStructure = Array<Array<TRow>>
export type SPFileParsed = Array<PSPPFileStructure>
export interface SPPPFile extends Omit<IBTFileResponse, 'currentFile'> {
  currentFile: SPStructureParsed | null
}

export interface ISPPFileValidationsResponse {
  currentFile: SPStructureParsed | null;
  file: File | null;
  fileStatus: 'success' | 'failed';
  message: string;
  messageStatus: 'success' | 'warning';
}
