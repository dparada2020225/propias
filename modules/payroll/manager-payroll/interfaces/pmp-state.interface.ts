import {ISPLDFormState} from './pmp-load-form.interface';
import { ISPPFileValidationsResponse, ISPPFStructureParsed } from './pmp-upload-file.interface';
import { SPPView } from '../enums/pmp-view.enum';
import { SPPMTableBody } from './sppd-manually.interface';

export interface PmpLoadHomeState {
  formState: ISPLDFormState;
}

export interface PmpLoadFileState extends PmpLoadHomeState {
  fileUploaded: ISPPFileValidationsResponse,
}

export interface PmpManualHomeState {
  formState: ISPLDFormState;
  registers: Array<any>;
}

export interface ISPPFileValidateMasiveAccounts {
  account: string
}

export interface ISPPFileResponseMasiveAccounts {
  account: string;
  accountName: string;
  status: string
}

export interface ISPPCorrelativePayroll{
  code: number;
  correlative: number;
  message: string
}

export interface ISaveDataPayroll {
  mnemonic:     string;
  participants: IloadParticipant[];
}

export interface IloadParticipant {
  company:       number;
  type:          number;
  correlative:   number;
  targetAccount: string;
  accountName:   string;
  email?:         string;
  details:       string;
  targetAmount:  number;
  statusAccount: string;
  dateCreation:  string;
}

export interface PayrollLoadParticipantsParameters {
  currentView: SPPView;
  fileParsed: ISPPFStructureParsed;
  registers: Array<SPPMTableBody>;
  accountsValidated: ISPPFileResponseMasiveAccounts[];
}

export interface IPayrollLoadParticipantsExecuteLoadParameters extends Omit<PayrollLoadParticipantsParameters, 'accountsValidated'>{

}
