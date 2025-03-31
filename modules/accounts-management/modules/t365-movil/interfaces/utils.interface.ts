import { ILoadItem, ITableStructure } from '@adf/components';
import { IAchAccount } from '../../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';
import { AM365Account } from './associated-account.interface';

export interface IAM365ManagementTableAnimationUtilsParameters {
  account: ILoadItem<AM365Account>,
  layout: ITableStructure<AM365Account>,
  iconClassName: string
}

export interface IAM365ManagementAnimationParameters {
  account: ILoadItem<AM365Account>,
  layout: ITableStructure<AM365Account>,
}
