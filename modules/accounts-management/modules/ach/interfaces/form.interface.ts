import { IACHBiesGeneralParameterBank, IACHBiesGeneralParameterListDocument } from 'src/app/models/ach-general-parameters.interface';
import { V3IAchAccount } from '../../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';

export interface IAACHUpdateFormParameters {
  isOwnAccount?: boolean;
  account: V3IAchAccount;
  bank?: IACHBiesGeneralParameterBank | undefined;
  documentType?: IACHBiesGeneralParameterListDocument | undefined;
}
