import {IDataSelect, ILayout} from '@adf/components';
import {FormGroup} from '@angular/forms';
import {IAccount} from 'src/app/models/account.inteface';
import {IFlowError} from 'src/app/models/error.interface';
import {IThirdTransfersAccounts} from '../../../interface/transfer-data-interface';
import {IThirdTransferFormValues} from './third-transfer.interface';

export interface ITTEInitStep1Request {
  title: string;
  subtitle: string;
  accountDebitedList: IAccount[] | IFlowError;
  accountCredit: IThirdTransfersAccounts;
  isModifyMode?: boolean;
  accountCreditList?: IThirdTransfersAccounts[] | IFlowError;
}

export interface ITTEInitStep1Responce {
  thirdTransferLayout: ILayout;
  thirdTransferForm: FormGroup;
  optionList: IDataSelect[];
  error: string;
}

export interface ITTEChangeAccountDebitResponce {
  thirdTransferLayout?: ILayout;
  accountDebited?: IAccount;
}

export interface ITTEVoucherLayoutRequest {
  title: string;
  subtitle: string;
  date: string;
  titlePdf: string;
  reference: string;
  fileNamePdf: string;
  accountCredit: IThirdTransfersAccounts;
  accountDebited: IAccount;
  formValues: IThirdTransferFormValues;
}
