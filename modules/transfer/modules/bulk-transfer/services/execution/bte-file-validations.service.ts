import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IBTFileResponse, ICurrentFile, IDetailFile, IHeadingFile, TRow } from '../../models/bulk-transfer.interface';
import { TranslateService } from '@ngx-translate/core';
import { IAchAccount } from '../../../transfer-ach/interfaces/ach-account-interface';
import { IAccount } from '../../../../../../models/account.inteface';
import { IValidationStartupParameters } from '../../interfaces/bt-validations.interface';
import { UtilService } from 'src/app/service/common/util.service';
import { EFileDetailsKeys, EHeadingFileKeys } from '../../enum/bte-file-validations.enum';
import { ESides } from '../../../../interface/table.enum';

@Injectable({
  providedIn: 'root'
})
export class BteFileValidationsService {
  file$: Subject<IBTFileResponse> = new Subject<IBTFileResponse>();
  emiteFile: EventEmitter<IBTFileResponse> | null = null;
  associatedAccounts!: IAchAccount[];
  sourceAccounts!: IAccount[];
  private headingFileKeys = [
    EHeadingFileKeys.KEY,
    EHeadingFileKeys.SOURCE_ACCOUNT,
    EHeadingFileKeys.CREDITS,
    EHeadingFileKeys.TOTAL_AMOUNT,
    EHeadingFileKeys.CURRENCY,
  ];
  private detailFileKeys = [
    EFileDetailsKeys.KEY,
    EFileDetailsKeys.IDENTIFIER,
    EFileDetailsKeys.ACCOUNT,
    EFileDetailsKeys.NAME,
    EFileDetailsKeys.AMOUNT,
  ];
  private MIN_DATA_FILE_SIZE_PER_REGISTER = 5
  private MAX_LENGTH_OF_TARGET_NAME = 22;
  private MAX_LENGTH_OF_BENEFICIARY_IDENTIFY = 18;
  private MAX_LENGTH_OF_TARGET_AMOUNT = 13;

  get currentFile() {
    return this.file$.asObservable();
  }

  constructor(
    private translate: TranslateService,
    private utils: UtilService,
  ) { }

  validate(startupParameters: IValidationStartupParameters) {
    const {
      workSheetRawValues,
      emiteFile,
      file,
      associatedAccounts,
      sourceAccounts } = startupParameters ?? {};

    this.sourceAccounts = sourceAccounts;
    this.associatedAccounts = associatedAccounts;
    this.emiteFile = emiteFile;


    if (!this.validateEmptyFile(workSheetRawValues)) {
      emiteFile.emit({
        message: 'label:empty_file',
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });

      return false;
    }

    if (!this.validateIsCompleteDataInFile(workSheetRawValues)) {
      emiteFile.emit({
        message: 'error:ach_valid_rows_in_file',
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });

      return false;
    }

    const currentFile = this.parseResult(workSheetRawValues);

    if (!this.fileValidations(currentFile)) return false;

    emiteFile.emit({
      message: 'label:success_file',
      messageStatus: 'success',
      fileStatus: 'success',
      currentFile,
      file,
    });

    return true;
  }

  private fileValidations(currentFile: ICurrentFile) {
    const { heading, details } = currentFile ?? {};

    const headingQuantity = Number(heading?.credits);
    const registersQuantity = details?.length;
    const totalAmount = this.getTotalAmount(details);
    const headingAmount = heading?.totalAmount;
    const sourceAccountNumber = heading?.sourceAccount;

    if (!this.validateStructureFile(currentFile)) return  false;

    if (!this.validateFileHasKeyDetail(currentFile)) return false;

    if (!this.validateQuantityOfRegisters(heading)) return false;

    if (!this.validateIsNotEqualQuantityRegisterToSumOfDetailSection(headingQuantity, registersQuantity))  return false;

    if (this.validateIsAmountInHeadingZero(headingAmount)) return false;

    if (!this.validateEmptyAmount(details)) return false;

    if (!this.validateAmountOfRegisters(details)) return false;

    if (!this.validateNameOfRegistersInAccount(details)) return false;

    if (!this.validateAmountIsNotEqualToSumOfDetailAmount(headingAmount, totalAmount)) return false;

    if (!this.validateNameOfRegisters(details)) return false;

    if (!this.validateSourceAccount(sourceAccountNumber)) return false;

    if (!this.validateIfCurrencyIsValid(sourceAccountNumber, heading)) return false;

    if (!this.validateAssociatedAccounts(details)) return false;

    return this.validateMaxLengthOfTargetAmount(details);

  }

  private validateIsAmountInHeadingZero(headingAmount: number) {
    const value = headingAmount === 0;

    if (value) {
      this.emiteFile?.emit({
        message: 'label:heading_empty_amount',
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });

      return false;
    }


    return value;
  }

  private validateIsNotEqualQuantityRegisterToSumOfDetailSection(headingQuantity: number, registersQuantity: number) {
    const value = headingQuantity === registersQuantity;

    if (!value) {
      this.emiteFile?.emit({
        message: 'error:ach_valid_credits_to_heading',
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });

      return false;
    }

    return value;
  }

  private validateAmountIsNotEqualToSumOfDetailAmount(headingAmount: number, totalAmount: number) {
    const value = headingAmount === totalAmount;

    if (!value) {
      this.emiteFile?.emit({
        message: 'alert:different_amount',
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });

      return false;
    }


    return value
  }

  private validateQuantityOfRegisters(heading: IHeadingFile) {
    const value = heading.credits !== 0;

    if (!value) {
      this.emiteFile?.emit({
        message: 'error:ach_valid_credits',
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });

      return false;
    }


    return value;
  }

  private validateEmptyFile(values: TRow[][] | string): boolean {
    return values.length > 0;
  }

  private validateIsCompleteDataInFile(values: Array<Array<TRow>>): boolean {
    const isColumnNull = values.some(row => row.some(column => column === null));
    const isColumnUndefined = values.some(row => row.some(column => column === undefined));
    const isColumnEmpty = values.some(row => row.some(column => column === ''));
    const validate = isColumnNull || isColumnUndefined || isColumnEmpty;
    const isCompletedColumns = values.every(row => row.length === this.MIN_DATA_FILE_SIZE_PER_REGISTER);
    return !(isCompletedColumns && validate);
  }

  private parseResult(result: TRow[][]) {
    const data = [...result];
    const headers = data.splice(0, 1)[0];


    return {
      heading: this.parseArrayToObj<IHeadingFile>(headers, this.headingFileKeys), // heading file keys
      details: this.parseDetail(data)
    };
  }

  private parseFileValueToNumber(value: number | string) {
    const parsed = Number(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  private validateEmptyAmount(registers: IDetailFile[]) {
    const listTransactionWithEmptyAmount = registers.filter(rgg => !rgg.hasOwnProperty('amount'));

    if (listTransactionWithEmptyAmount.length > 1) {
      const errors = this.getListOfErrorsForEmptyAmount(listTransactionWithEmptyAmount, 'label:file_transfer_account_amount_cero_el');
      this.emiteFile?.emit({
        messages: errors,
        message: undefined as never,
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });
      return false;
    }

    if (listTransactionWithEmptyAmount.length === 1) {
      const account = listTransactionWithEmptyAmount[0];
      const message = this.translate.instant('label:file_transfer_account_amount_cero', {
        numberAccount: account?.account,
        accountName: account?.name,
      });

      this.emiteFile?.emit({
        message,
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });

      return false;
    }

    return true;

  }

  private validateAmountOfRegisters(registers: IDetailFile[]) {
    const listOfTransactionWithZeroAmount = registers.filter(attr => attr.amount === 0);

    if (listOfTransactionWithZeroAmount.length > 1) {
      const errors = this.getListOfErrorsForEmptyAmount(listOfTransactionWithZeroAmount, 'label:file_transfer_account_amount_cero_el');
      this.emiteFile?.emit({
        messages: errors,
        message: undefined as never,
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });
      return false;
    }

    if (listOfTransactionWithZeroAmount.length === 1) {
      const account = listOfTransactionWithZeroAmount[0];
      const message = this.translate.instant('label:file_transfer_account_amount_cero', {
        numberAccount: account?.account,
        accountName: account?.name,
      });

      this.emiteFile?.emit({
        message,
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });
      return false;
    }

    return true;
  }

  private validateNameOfRegisters(registers: IDetailFile[]) {
    const regex = /^[-a-zA-Z0-9]+ [-a-zA-Z0-9]+( [-a-zA-Z0-9]+)*$/;

    const filtered = registers.filter(attr => !attr.name.match(regex) || attr.name.length < 4);

    if (filtered.length === 1) {
      const account = filtered[0];
      const message = this.translate.instant('label:file_transfer_wrong_name', {
        numberAccount: account?.account,
        accountName: account?.name,
      });

      this.emiteFile?.emit({
        message,
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });

      return false;
    }

    if (filtered.length > 1) {
      const errors = this.getListOfErrorsForEmptyAmount(filtered, 'label:file_transfer_wrong_name_el');
      this.emiteFile?.emit({
        messages: errors,
        message: undefined as never,
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });
      return false;
    }


    return true;
  }

  private validateNameOfRegistersInAccount(registers: IDetailFile[]) {
    const accountWitWrongName = registers.filter(x => !this.associatedAccounts.some(y => y.name === x.name));

    if (accountWitWrongName.length === 1) {
      const account = accountWitWrongName[0];
      const message = this.translate.instant('label:file_transfer_wrong_name', {
        numberAccount: account?.account,
        accountName: account?.name,
      });

      this.emiteFile?.emit({
        message,
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });

      return false;
    }

    if (accountWitWrongName.length > 1) {
      const errors = this.getListOfErrorsForEmptyAmount(accountWitWrongName, 'label:file_transfer_wrong_name_el');
      this.emiteFile?.emit({
        messages: errors,
        message: undefined as never,
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });
      return false;
    }

    return true;
  }


  private validateAssociatedAccounts(registers: IDetailFile[]) {
    const accountNoAssociated = registers.filter(x => !this.associatedAccounts.some(y => y.account === x.account));

    if (accountNoAssociated.length === 1) {
      const account = accountNoAssociated[0];
      const message = this.translate.instant('label:file_transfer_wrong_associated', {
        numberAccount: account?.account,
        accountName: account?.name,
      });

      this.emiteFile?.emit({
        message,
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });

      return false;
    }

    if (accountNoAssociated.length > 1) {
      const errors = this.getListOfErrorsForEmptyAmount(accountNoAssociated, 'label:file_transfer_wrong_associated_el');
      this.emiteFile?.emit({
        messages: errors,
        message: undefined as never,
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });
      return false;
    }

    return true;
  }



  private validateSourceAccount(sourceAccount: string) {
    const accountToDebit = this.sourceAccounts.find(acc => acc.account === sourceAccount);

    if (!accountToDebit) {
      this.emiteFile?.emit({
        message: 'label:file_transfer_wrong_source_Account',
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });
      return false;
    }

    return true;
  }

  private validateIfCurrencyIsValid(numberAccount: string, heading: IHeadingFile) {
    const sourceAccount = this.sourceAccounts.find(acc => acc.account === numberAccount) as IAccount;

    if (sourceAccount.currency !== heading.currency) {
      this.emiteFile?.emit({
        message: 'error:ach_invalid_currency',
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });

      return false;
    }


    return true;
  }

  private validateStructureFile(currentFile: ICurrentFile) {
    const { heading } = currentFile ?? {};

    const keyHeading = heading.key !== 'H';
    const sourceAccount = !heading.sourceAccount && heading?.sourceAccount?.length < 6;
    const keyUndefined = heading.hasOwnProperty('undefined');

    if (keyHeading || sourceAccount || keyUndefined) {
      this.emiteFile?.emit({
        message: 'label:file-structure',
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });
      return false;
    }

    return true;
  }

  private validateFileHasKeyDetail(currentFile: ICurrentFile) {
    const { details } = currentFile

    const isFileHasKeyDetail = details.every(detail => detail.key === 'D');

    if (!isFileHasKeyDetail) {
      this.emiteFile?.emit({
        message: 'error:ach_key_detail',
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });

      return false;
    }

    return isFileHasKeyDetail;
  }

  private validateMaxLengthOfTargetName(registers: IDetailFile[]) {
    const filtered = registers.filter(({name}) => name.length > this.MAX_LENGTH_OF_TARGET_NAME);

    if (filtered.length === 1) {
      const account = filtered[0];
      const message = this.translate.instant('error:ach_name_max_length', {
        numberAccount: account?.account,
        accountName: account?.name,
      });

      this.emiteFile?.emit({
        message,
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });

      return false;
    }

    if (filtered.length > 1) {
      const errors = this.getListOfErrorsForEmptyAmount(filtered, 'error:ach_name_max_length_el');
      this.emiteFile?.emit({
        messages: errors,
        message: undefined as never,
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });
      return false;
    }

    return true;
  }

  private validateMaxLengthOfBeneficiaryIdentify(registers: IDetailFile[]) {
    const identifierFiltered = registers.filter(({identifier}) => identifier.length > this.MAX_LENGTH_OF_BENEFICIARY_IDENTIFY);

    if (identifierFiltered.length === 1) {
      const account = identifierFiltered[0];
      const message = this.translate.instant('error:ach_identifier_max_length', {
        numberAccount: account?.account,
        accountName: account?.name,
      });

      this.emiteFile?.emit({
        message,
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });

      return false;
    }

    if (identifierFiltered.length > 1) {
      const errors = this.getListOfErrorsForEmptyAmount(identifierFiltered, 'error:ach_identifier_max_length_el');
      this.emiteFile?.emit({
        messages: errors,
        message: undefined as never,
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });
      return false;
    }

    return true;
  }

  private validateMaxLengthOfTargetAmount(registers: IDetailFile[]) {
    const identifierFiltered = registers.filter(({amount}) => String(amount).length > this.MAX_LENGTH_OF_TARGET_AMOUNT);

    if (identifierFiltered.length === 1) {
      const account = identifierFiltered[0];
      const message = this.translate.instant('error:ach_amount_max_length', {
        numberAccount: account?.account,
        accountName: account?.name,
      });

      this.emiteFile?.emit({
        message,
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });

      return false;
    }

    if (identifierFiltered.length > 1) {
      const errors = this.getListOfErrorsForEmptyAmount(identifierFiltered, 'error:ach_amount_max_length_el');
      this.emiteFile?.emit({
        messages: errors,
        message: undefined as never,
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: null,
      });
      return false;
    }

    return true;
  }

  private getTotalAmount(registers: IDetailFile[]) {
    const total = registers.reduce((value, current) => {
      return value + current?.amount;
    }, 0);

    return this.utils.parseNumberAsFloat(total.toFixed(2));
  }

  private getListOfErrorsForEmptyAmount(registers: IDetailFile[], label: string): string[] {
    return registers.reduce((errors, register) => {
      const message = this.translate.instant(label, {
        numberAccount: register?.account,
        accountName: register?.name,
      });
      errors.push(message as never);

      return errors;
    }, []);
  }

  private parseArrayToObj<T = any>(list: TRow[], keys: string[]): T {
    return list.reduce((prev, current, i) => {
      return { ...prev, [keys[i]]: !current ? this.setValueInNull(keys[i]) : this.parseFileValues(current, keys[i]) };
    }, {} as T);
  }

  private setValueInNull(key: string) {
    const keysMap = {
      [EFileDetailsKeys.AMOUNT]: 0,
      [EHeadingFileKeys.CREDITS]: 0,
      [EHeadingFileKeys.TOTAL_AMOUNT]: 0,
    }

    return keysMap[key] ?? null;
  }

  private parseFileValues(value: string | number, key: string) {
    switch (key) {
      case EFileDetailsKeys.AMOUNT:
      case EHeadingFileKeys.TOTAL_AMOUNT:
      case EHeadingFileKeys.CREDITS:
        return this.parseFileValueToNumber(value);
      case EFileDetailsKeys.ACCOUNT:
        return String(value);
      case EHeadingFileKeys.SOURCE_ACCOUNT:
        return this.utils.filledSideStrings(String(value), '0', 12, ESides.LEFT);
        default: return value;
    }
  }

  private parseDetail(details: TRow[][]): IDetailFile[] {
    return details.reduce((prev, current) => {
      const parser = this.parseArrayToObj<IDetailFile>(current, this.detailFileKeys); // detail file keys
      prev.push(parser);
      return prev;
    }, [] as IDetailFile[]);
  }


 }

