import { IB2bConsultationDetail } from './b2b-consultation.interface';
import { IUserInfo } from '../../../../../models/user-info.interface';

export interface IB2BDConsultModalParameters {
  back2back: IB2bConsultationDetail,
  dateTime: {
    hour: string;
    date: string;
  },
  user: IUserInfo;
  bankName: string;
  currency: string;
}
