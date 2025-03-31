import { IAccount } from '../../../../../models/account.inteface';
import { ITM365FileLoadedList } from './load-file.interface';
import { ITM365FormValues } from './form-values.interface';

export interface ITM365ConfirmationState {

}

export interface ITM365HomeState {
  sourceAccountSelected: IAccount;
  targetAccountListFromFile: ITM365FileLoadedList;
  formValues: ITM365FormValues;
  token?: string;
  isTokenRequired: boolean;
}

export interface ITM365TransferWithCorrelative extends ITM365HomeState {
  correlative: string;
}

export interface ITM365TransferWithFileTransfer extends ITM365TransferWithCorrelative {
  fileToUpLoad: FormData;
}

export interface ITM365TransferExecuted extends ITM365TransferWithFileTransfer {
  serviceResponse: any;
}
