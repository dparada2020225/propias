import { PSPPFileStructure } from "./ps-upload-file.interface";

export interface SPMTableHeader {
  label: string;
  name: string;
  icon: string;
  action: string;
}

export interface SPMTableBody extends Omit<PSPPFileStructure, 'email'> {
  amountParsed: string;
  email: string;
  isChecked: boolean;
  status: string;
  detail: string;
}

export const SPPMTableKeys = {
  ACCOUNT: 'accountNumber',
  NAME: 'accountName',
  AMOUNT: 'amount',
  EMAIL: 'email',
  DETAIL: 'detail',
  AMOUNT_PARSED: 'amountParsed',
  IS_CHECKED: 'check'
}

export class SPDRegisterBuilder {
  private _account: string = '';
  private _name: string = '';
  private _amount: string = '';
  private _amountParsed: string = '';
  private _email: string = '';
  private _status: string = '';
  private _isChecked: boolean = false;
  private _detail: string = '';

  setAccount(account: string) {
    this._account = account;
    return this;
  }

  setName(name: string) {
    this._name = name;
    return this;
  }

  setAmount(amount: string) {
    this._amount = amount;
    return this;
  }

  setAmountParsed(amountParsed: string) {
    this._amountParsed = amountParsed;
    return this;
  }

  setEmail(email: string) {
    this._email = email;
    return this;
  }

  setStatus(status: string) {
    this._status = status
    return this
  }

  setDetail(detail: string) {
    this._detail = detail
    return this
  }

  build(): SPMTableBody {
    return {
      accountNumber: this._account,
      accountName: this._name,
      amount: this._amount,
      amountParsed: this._amountParsed,
      email: this._email,
      status: this._status,
      detail: this._detail,
      isChecked: this._isChecked
    }
  }
}
