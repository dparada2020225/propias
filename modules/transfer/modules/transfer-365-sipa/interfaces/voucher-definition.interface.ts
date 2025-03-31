import { IS365HomeState } from './state.interface';

export interface IS365ConfirmationVoucherParameters extends IS365HomeState {
}

export interface IS365ModalVoucherParameters extends IS365HomeState {
  transactionResponse: any;
}
