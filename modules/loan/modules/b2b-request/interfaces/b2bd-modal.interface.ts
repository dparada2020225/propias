import { IB2bRequestResponse } from './b2b-request.interface';
import { IAccount } from '../../../../../models/account.inteface';
import { IUserInfo } from '../../../../../models/user-info.interface';

export interface B2bdModalInterface {
  requestDetail: IB2bRequestResponse;
  accountDebited: IAccount;
  dateTime: any;
  bankName: string;
  currency: string;
  user: IUserInfo;
}
