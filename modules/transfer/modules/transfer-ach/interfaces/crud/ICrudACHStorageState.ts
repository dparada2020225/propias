import { ICrudAchForm } from './crud-form.interface';
import { ECrudAchTypeClient } from '../../enum/ach-crud-control-name.enum';
import { IACHBank, IAchCrudTransactionResponse } from './crud-create.interface';

export interface ICrudACHStorageState  {
  formValues: ICrudAchForm;
  typeClient: ECrudAchTypeClient;
  transactionResponse?: IAchCrudTransactionResponse;
  bankSelected: IACHBank;
}
