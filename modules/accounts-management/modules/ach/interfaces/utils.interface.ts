import { ILoadItem, ITableStructure } from '@adf/components';
import { V3IAchAccount } from '../../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';

export interface ICAAchManagementTableAnimationUtilsParameters {
  account: ILoadItem<V3IAchAccount>,
  layout: ITableStructure<V3IAchAccount>,
  iconClassName: string
}

export interface ICAchManagementAnimationParameters {
  account: ILoadItem<V3IAchAccount>,
  layout: ITableStructure<V3IAchAccount>,
}
