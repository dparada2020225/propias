import { IS365FormValues, IScheduleFormValues } from './form.interface';
import { IAccount } from '../../../../../models/account.inteface';
import { IAchAccount } from '../../transfer-ach/interfaces/ach-account-interface';
import { EACHTypeTransaction } from '../../transfer-ach/enum/transfer-ach.enum';
import { IAMS365Account } from '../../../../accounts-management/interfaces/am-account-list.interface';
import { IS365TransferReason } from './transfer.interface';

export interface IS365HomeState {
  formValues: IS365FormValues;
  scheduleFormValues: IScheduleFormValues;
  sourceAccountSelected: IAccount;
  targetAccountSelected: IAMS365Account;
  reasonSelected: IS365TransferReason;
  commission: number;
  totalValue: string;
}

export interface IS365ConfirmationState extends IS365HomeState {
  transactionResponse: any;
  message: string | undefined;
  typeTransaction: string;
}
