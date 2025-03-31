import { ILoadItem, ITableStructure } from '@adf/components';

export interface IAMManagementTableAnimationParameters<T = any> {
  account: ILoadItem<T>,
  layout: ITableStructure<T>,
  iconClassName: string
}

export interface IAMManagementAnimationParameters<T = any> {
  account: ILoadItem<T>,
  layout: ITableStructure<T>,
}
