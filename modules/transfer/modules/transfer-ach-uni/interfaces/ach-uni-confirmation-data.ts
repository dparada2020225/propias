import { IAccount } from "src/app/models/account.inteface";
import { AchUniFormValues } from "./ach-uni-transfer.interface";
import { AchUniBank } from "./ach-uni-bank";
import { AchUniPurpose } from "./ach-uni-purpose";

export interface AchUniConfirmationData {
  accountToDebited: IAccount;
  accountToCredit: IAccount;
  bank: AchUniBank;
  purpose: AchUniPurpose;
  formValues: AchUniFormValues;
  title?: string;
  subtitle?: string;
  message?: string;
}

