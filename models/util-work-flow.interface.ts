import { DateTimeFormat, IImagesConfirmationModal } from '@adf/components';

export interface IUserDataTransaction {
  account: string;
  alias: string;
  name?: string;
  currency: string;
  product: number;
}

export interface IUserDataModalPdf {
  account: string;
  name: string;
}

export interface IHeadBandLayout {
  date: DateTimeFormat;
  reference: string;
  numberAccount?: string;
}

export interface IHeadBandLayoutConfirm {
  date: DateTimeFormat;
  reference: string;
  numberAccount?: string;
}

export interface IHeadBandLayoutConfirmAchUni {
  date: DateTimeFormat;
  reference: string;
  numberAccount?: string;
}

export interface IUtilModalParameter {
  firstImage?: IImagesConfirmationModal;
  secondImage?: IImagesConfirmationModal;
}


