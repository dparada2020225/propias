import { ISPLDFormState } from "src/app/modules/payroll/manager-payroll/interfaces/pmp-load-form.interface";
import { ISPPFileValidationsResponse, SPStructureParsed } from "./ps-upload-file.interface";
import { SPPView } from "../enums/ps-view.enum";
import { SPPMTableBody } from "src/app/modules/payroll/manager-payroll/interfaces/sppd-manually.interface";

export interface SPLoadHomeState {
  formState: ISPLDFormState;
}

export interface SPLoadFileState extends SPLoadHomeState {
  fileUploaded: ISPPFileValidationsResponse,
}

export interface SPManualHomeState {
  formState: ISPLDFormState;
  registers: Array<any>;
}

export interface SPFileValidateMasiveAccounts {
  account: string
}

export interface SPFileResponseMasiveAccounts {
  account: string;
  accountName: string;
  status: string
}

export interface PSCorrelativeSupplier{
  responseCode: number;
  correlative: number;
  errorMessage: string
}

export interface ISaveDataSupplier {
  mnemonic:     string;
  participants: IloadParticipantSP[];
}

export interface IloadParticipantSP {
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

export interface SupplierLoadParticipantsParameters {
  currentView: SPPView;
  fileParsed: SPStructureParsed;
  registers: Array<SPPMTableBody>;
  accountsValidated: SPFileResponseMasiveAccounts[];
}

export interface ISupplierLoadParticipantsExecuteLoadParameters extends Omit<SupplierLoadParticipantsParameters, 'accountsValidated'>{

}
