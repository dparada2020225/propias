import {ISPPFileStructure} from './pmp-upload-file.interface';

export interface SPPMTableHeader {
  label: string;
  name: string;
  icon: string;
  action: string;
}

export interface SPPMTableBody extends Omit<ISPPFileStructure, 'email'> {
  amountParsed: string;
  email: string;
  isChecked: boolean;
  status: string;
}

export const SPPMTableKeys = {
  ACCOUNT: 'accountNumber',
  NAME: 'accountName',
  AMOUNT: 'amount',
  EMAIL: 'email',
  AMOUNT_PARSED: 'amountParsed',
  IS_CHECKED: 'check'
}

export class SPPRegisterBuilder {
  private _account: string = '';
  private _name: string = '';
  private _amount: string = '';
  private _amountParsed: string = '';
  private _email: string = '';
  private _status: string = '';
  private _isChecked: boolean = false;

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

  build(): SPPMTableBody {
    return {
      accountNumber: this._account,
      accountName: this._name,
      amount: this._amount,
      amountParsed: this._amountParsed,
      email: this._email,
      status: this._status,
      isChecked: this._isChecked
    }
  }
}
