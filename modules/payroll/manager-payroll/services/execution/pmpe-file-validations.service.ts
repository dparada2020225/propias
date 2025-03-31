import {EventEmitter, Injectable} from '@angular/core';
import {
  ISPPBuildCsvFileParameters,
  ISPPBuildCsvFileParametersSV,
  ISPPFile,
  ISPPFileStartupParameters,
  ISPPFileStructure,
  ISPPFormStatus,
  ISPPFStructureParsed,
  TSPPFileParsed,
  TSPPFileStructure
} from '../../interfaces/pmp-upload-file.interface';
import {UtilWorkFlowService} from '../../../../../service/common/util-work-flow.service';
import {UtilService} from '../../../../../service/common/util.service';
import {ParsedFileUploadUtilService} from '../../../../../service/general/parsed-file-upload-util.service';
import {SPP_FILE_STRUCTURE} from '../../enums/pmp-file-structure.enum';
import {environment} from '../../../../../../environments/environment';
import {EProfile} from '../../../../../enums/profile.enum';

@Injectable({
  providedIn: 'root'
})
export class PmpeFileValidationsService {
  private MIN_DATA_FILE_SIZE_PER_REGISTER = 2
  private MIN_TARGET_ACCOUNT_LENGTH = 12;
  private MIN_AMOUNT_LENGTH = 13;
  private IDENTIFIER_CREDITS = '0';
  private IDENTIFIER_DEBITS = '1';
  private ACCOUNT_NUMBER_REGEX = /^[a-zA-Z0-9\s]*$/;
  private AMOUNT_REGEX = /^\d+([.,]\d+)?$/;
  private EMAIL_REGEX = /^[\w-]([-.\w])+\w+@([\w-]+\.)+[A-Za-z]{2,4}$/i;
  private emitFile: EventEmitter<ISPPFile> | null = null;
  private currentFile: File | null = null;
  private maxRegistersAllowed = 0;

  constructor(
    private utils: UtilService,
    private utilWorkFlow: UtilWorkFlowService,
    private parsedFileUploadUtil: ParsedFileUploadUtilService,
  ) {
  }

  validate(startupParameters: ISPPFileStartupParameters) {
    const {
      workSheetRawValues,
      file,
      emiteFile,
      formValues,
      maxRegistersAllowed
    } = startupParameters;
    this.emitFile = emiteFile;
    this.currentFile = file;
    this.maxRegistersAllowed = maxRegistersAllowed;

    if (!this.validateEmptyFile(workSheetRawValues)) {
      emiteFile.emit({
        message: 'label:empty_file',
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: file,
      });

      return false;
    }

    if (!this.validateIsCompleteDataInFile(workSheetRawValues)) {
      emiteFile.emit({
        message: 'error:ach_valid_rows_in_file',
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: file,
      });

      return false;
    }

    const currentFile = this.parseFile(workSheetRawValues);
    if (!this.fileValidations(currentFile, formValues)) return false;

    const currentFileParsed = this.buildCurrentFile(currentFile, formValues);

    emiteFile.emit({
      message: 'label:success_file',
      messageStatus: 'success',
      fileStatus: 'success',
      currentFile: currentFileParsed,
      file: file,
    });

    return true;
  }

  buildStructureFileRequestBP(parameters: ISPPBuildCsvFileParameters) {
    const { formValues, fileRegisters } = parameters;
    const { totalAmount } = formValues;

    const sourceAmount = this.utilWorkFlow.rebuildAmount(String(totalAmount));
    // TASK: get source account from form
    const sourceAccount = ''
    const debitMapped = `${sourceAccount}${sourceAmount}${this.IDENTIFIER_DEBITS}`;
    const creditsMapped = fileRegisters.map(register => {
      const currentAmount = this.utilWorkFlow.rebuildAmount(String(register.amount));
      const accountName = register.accountName ? register.accountName : '';
      return `${register.accountNumber}${currentAmount}${this.IDENTIFIER_CREDITS}${accountName}`
    });

    return [...creditsMapped, debitMapped].join('\n');
  }


  buildStructureFileRequestBISV(parameters: ISPPBuildCsvFileParametersSV) {
    const { fileRegisters } = parameters;

    const creditsMapped = fileRegisters.map(register => {
      const currentAmount = this.utilWorkFlow.rebuildAmount(String(register.amount));
      const email = register.email ? register.email : '';
      const accountNumber = String(register.accountNumber).padEnd(12, ' ');
      return `${accountNumber}${currentAmount}${this.IDENTIFIER_CREDITS}${email}`
    });

    return creditsMapped.join('\r\n');
  }

  buildStructureFileRequestBIPA(parameters: ISPPBuildCsvFileParametersSV) {
    const { fileRegisters } = parameters;

    const creditsMapped = fileRegisters.map(register => {
      const currentAmount = this.utilWorkFlow.rebuildAmount(String(register.amount));
      return `${register.accountNumber}${currentAmount}${this.IDENTIFIER_CREDITS}`
    });

    return creditsMapped.join('\n');
  }


  /* ---------------------------------  VALIDATIONS -------------------------------- */

  private fileValidations(currentFile: TSPPFileParsed, formValues: ISPPFormStatus) {
    if (!this.validateIfRegistersAreUnderTheLimit(currentFile)) return false;

    if (!this.validateIfFileContainDuplicates(currentFile)) return false;

    if (!this.validateIsFileContainEmail(currentFile)) return false;

    if (!this.validateFieldAccountNumberIsNotEmpty(currentFile)) return false;

    if (!this.validateAccountNumberIsNotAZero(currentFile)) return false;

    if (!this.validateAccountNumberIsANumber(currentFile)) return false;

    if (!this.validateMaxLengthTargetAccount(currentFile)) return false;

    if (!this.validateMinLengthTargetAccount(currentFile)) return false;

    if (!this.validateAccountNumberRegex(currentFile)) return false;

    if (!this.validateIsAmountInFile(currentFile)) return false;

    if (!this.validateIsAmountContainSpecialCharacters(currentFile)) return false;

    if (!this.validateIsAmountLength(currentFile)) return false;

    if (!this.validateAmountIsNotEqualToSumOfDetailAmount(currentFile, formValues)) return false;

    return this.validateQuantityOfRegisters(formValues.credits, currentFile.length);
  }

  private validateIfRegistersAreUnderTheLimit(currentFile: TSPPFileParsed) {
    const isUnderTheLimit = currentFile.length <= this.maxRegistersAllowed;

    if (!isUnderTheLimit) {
      const message = this.parsedFileUploadUtil.manageTranslateText('payroll:error_file_max_registers_allowed', {
        value: this.maxRegistersAllowed,
      });

      this.parsedFileUploadUtil.manageEmitFailedResponse(message, this.emitFile as EventEmitter<any>, this.currentFile);
      return false;
    }

    return isUnderTheLimit;
  }

  private validateIfFileContainDuplicates(currentFile: TSPPFileParsed) {
    let value = ''
    let position = 0;

    const accountNumbers = currentFile.map(account => account.accountNumber);

    const isDuplicate = accountNumbers.some((account, idx) => {
      const isValid = accountNumbers.indexOf(account) !== idx;

      if (isValid) {
        value = account;
        position = idx + 1;
      }

      return isValid;
    });

    if (isDuplicate) {
      const message = this.parsedFileUploadUtil.manageTranslateText('payroll:error_file_duplicate_account', {
        value,
        position,
      });

      this.parsedFileUploadUtil.manageEmitFailedResponse(message, this.emitFile as EventEmitter<any>, this.currentFile);
      return false;
    }

    return !isDuplicate;
  }

  private validateEmptyFile(values: TSPPFileStructure | string): boolean {
    return values.length > 0;
  }

  private validateIsCompleteDataInFile(values: TSPPFileStructure): boolean {
    const columnsRequired = values.map(row => row.slice(0, row.length - 1));
    const isColumnNull = columnsRequired.some(row => row.some(column => column === null));
    const isColumnUndefined = columnsRequired.some(row => row.some(column => column === undefined));
    const isColumnEmpty = columnsRequired.some(row => row.some(column => column === ''));
    const validate = isColumnNull || isColumnUndefined || isColumnEmpty;
    const isCompletedColumns = columnsRequired.every(row => row.length === this.MIN_DATA_FILE_SIZE_PER_REGISTER);
    return !(isCompletedColumns && validate);
  }

  private validateIsAmountInFile(registers: TSPPFileParsed): boolean {
    let position = 0;

    const isAmountInFile = registers.every((register, idx) => {
      const isValid = Boolean(register.amount && register.hasOwnProperty(SPP_FILE_STRUCTURE.AMOUNT));

      if (!isValid) {
        position = idx + 1;
      }

      return isValid;
    })

    if (!isAmountInFile) {
      const message = this.parsedFileUploadUtil.manageTranslateText('payroll:error_file_empty_amount', {
        position,
      });

      this.parsedFileUploadUtil.manageEmitFailedResponse(message, this.emitFile as EventEmitter<any>, this.currentFile);
      return false;
    }

    return isAmountInFile;
  }

  private validateIsAmountContainSpecialCharacters(currentFile: TSPPFileParsed) {
    let value = ''
    let position = 0;

    const isAmountContainSpecialCharacters = currentFile.every((account, idx) => {
      const currentAmount = String(account.amount);
      const isValid =  this.AMOUNT_REGEX.test(currentAmount);

      if (!isValid) {
        value = currentAmount;
        position = idx + 1;
      }

      return isValid
    });

    if (!isAmountContainSpecialCharacters) {
      const message = this.parsedFileUploadUtil.manageTranslateText('payroll:error_file_regex_amount', {
        value,
        position,
      });

      this.parsedFileUploadUtil.manageEmitFailedResponse(message, this.emitFile as EventEmitter<any>, this.currentFile);
      return false;
    }

    return isAmountContainSpecialCharacters;
  }

  private validateIsAmountLength(currentFile: TSPPFileParsed) {
    let value = ''
    let position = 0;

    const isInvalidAmountLength = currentFile.some((account, idx) => {
      const currentAmount = String(account.amount);
      const isInvalid =  currentAmount.length > this.MIN_AMOUNT_LENGTH;

      if (isInvalid) {
        value = currentAmount;
        position = idx + 1;
      }

      return isInvalid
    });

    if (isInvalidAmountLength) {
      const message = this.parsedFileUploadUtil.manageTranslateText('payroll:error_file_maxlength_amount', {
        value,
        position,
      });

      this.parsedFileUploadUtil.manageEmitFailedResponse(message, this.emitFile as EventEmitter<any>, this.currentFile);
      return false;
    }

    return !isInvalidAmountLength;
  }

  private validateAccountNumberIsNotAZero(currentFile: TSPPFileParsed) {
    const isAccountAZero = currentFile.every(value => {
      return value.accountNumber !== '0'
    });

    if (!isAccountAZero) {
      this.emitFile?.emit({
        message: 'error: account contains a zero',
        messageStatus: 'warning',
        fileStatus: 'failed',
        currentFile: null,
        file: this.currentFile,
      });
      return false;
    }

    return isAccountAZero;
  }

  private validateFieldAccountNumberIsNotEmpty(currentFile: TSPPFileParsed) {
    let value = '';
    let position = 0;

    const isValidAccount = currentFile.every((account, idx) => {
      const isValid = Boolean(account.accountNumber && account.hasOwnProperty(SPP_FILE_STRUCTURE.ACCOUNT_NUMBER));

      if (!isValid) {
        value = account.accountNumber;
        position = idx + 1;
      }

      return isValid;
    })

    if (!isValidAccount) {
      const message = this.parsedFileUploadUtil.manageTranslateText('payroll:error_file_empty_account', {
        value,
        position: position ,
      });

      this.parsedFileUploadUtil.manageEmitFailedResponse(message, this.emitFile as EventEmitter<any>, this.currentFile);
      return false;
    }

    return isValidAccount
  }

  private validateMaxLengthTargetAccount(currentFile: TSPPFileParsed) {
    let value = ''
    let position = 0;

    const isValidLengthAccount = currentFile.some((account, idx) => {
      const currentAccount = String(account.accountNumber);
      const isValid =  currentAccount.length > this.MIN_TARGET_ACCOUNT_LENGTH;

      if (isValid) {
        value = currentAccount;
        position = idx + 1;
      }

      return isValid
    });

    if (isValidLengthAccount) {
       const message = this.parsedFileUploadUtil.manageTranslateText('payroll:error_file_maxlength_account', {
          value,
          position,
        });

      this.parsedFileUploadUtil.manageEmitFailedResponse(message, this.emitFile as EventEmitter<any>, this.currentFile);
      return false;
    }

    return !isValidLengthAccount;
  }

  private validateMinLengthTargetAccount(currentFile: TSPPFileParsed) {
    let value = ''
    let position = 0;

    const isValidLengthAccount = currentFile.some((account, idx) => {
      const currentAccount = String(account.accountNumber);
      const isValid =  currentAccount.length < this.MIN_TARGET_ACCOUNT_LENGTH;

      if (isValid) {
        value = currentAccount;
        position = idx + 1;
      }

      return isValid
    });

    if (isValidLengthAccount) {
      const message = this.parsedFileUploadUtil.manageTranslateText('payroll:error_file_minlength_account', {
        value,
        position,
      });

      this.parsedFileUploadUtil.manageEmitFailedResponse(message, this.emitFile as EventEmitter<any>, this.currentFile);
      return false;
    }

    return !isValidLengthAccount;
  }

  private validateAccountNumberIsANumber(currentFile: TSPPFileParsed) {
    let value = ''
    let position = 0;

    const validate = currentFile.every((account, idx) => {
      const currentAccount = String(account.accountNumber);
      const isValid = /^[0-9]+$/.test(account.accountNumber);

      if (!isValid) {
        value = currentAccount;
        position = idx + 1;
      }

      return isValid
    });

    if (!validate) {
      const message = this.parsedFileUploadUtil.manageTranslateText('payroll:error_file_regex_account', {
        value,
        position,
      });

      this.parsedFileUploadUtil.manageEmitFailedResponse(message, this.emitFile as EventEmitter<any>, this.currentFile);
      return false;
    }

    return validate;
  }

  private validateAccountNumberRegex(currentFile: TSPPFileParsed) {
    let value = ''
    let position = 0;

    const isValidRegexAccount = currentFile.every((account, idx) => {
      const currentAccount = String(account.accountNumber);
      const isValid =  this.ACCOUNT_NUMBER_REGEX.test(currentAccount);

      if (!isValid) {
        value = currentAccount;
        position = idx + 1;
      }

      return isValid
    });

    if (!isValidRegexAccount) {
      const message = this.parsedFileUploadUtil.manageTranslateText('payroll:error_file_regex_account', {
        value,
        position,
      });

      this.parsedFileUploadUtil.manageEmitFailedResponse(message, this.emitFile as EventEmitter<any>, this.currentFile);
      return false;
    }

    return isValidRegexAccount;
  }

  private validateIsFileContainEmail(currentFile: TSPPFileParsed) {
    if (environment.profile !== EProfile.SALVADOR) return true;

    const registersWithEmail = currentFile.filter(account => {
      return account.hasOwnProperty(SPP_FILE_STRUCTURE.EMAIL) || account.email
    })

    if (registersWithEmail.length === 0) return true;

    let value = ''
    let position = 0;

    const isValidEmail = registersWithEmail.every((account) => {
      const currentEmail = String(account.email);
      const isValid =  this.EMAIL_REGEX.test(currentEmail);

      if (!isValid) {
        value = currentEmail;
        position = currentFile.findIndex(idx => idx.accountNumber === account.accountNumber) + 1;
      }

      return isValid
    });

    if (!isValidEmail) {
      const message = this.parsedFileUploadUtil.manageTranslateText('payroll:error-generic', {
        value,
        position,
      });

      this.parsedFileUploadUtil.manageEmitFailedResponse(message, this.emitFile as EventEmitter<any>, this.currentFile);
      return false;
    }

    return isValidEmail;
  }

  private validateAmountIsNotEqualToSumOfDetailAmount(currentFile: TSPPFileParsed, formValues: ISPPFormStatus) {
    const { totalAmount } = formValues
    const totalAmountInFile = this.getTotalAmount(currentFile);
    const isTheSameValue = this.utils.parseNumberAsFloat(totalAmount) === totalAmountInFile

    if (!isTheSameValue) {
      const message = this.parsedFileUploadUtil.manageTranslateText('payroll:error_different_amount_registers_to_debit', {});
      this.parsedFileUploadUtil.manageEmitFailedResponse(message, this.emitFile as EventEmitter<any>, this.currentFile);
      return false;
    }

    return isTheSameValue;
  }

  private validateQuantityOfRegisters(credits: string, totalRegisters: number) {
    const isTheSameValuesInFile =  this.utils.parseNumberAsFloat(credits) === totalRegisters;

    if (!isTheSameValuesInFile) {
      const message = this.parsedFileUploadUtil.manageTranslateText('payroll:error_quantity_credits', {});
      this.parsedFileUploadUtil.manageEmitFailedResponse(message, this.emitFile as EventEmitter<any>, this.currentFile);
      return false;
    }

    return isTheSameValuesInFile;
  }


  /* ------------------------ UTILS VALIDATIONS ------------------- */
  private getTotalAmount(registers: TSPPFileParsed) {
    const total = registers.reduce((value, current) => {
      const currentValue = this.utils.parseNumberAsFloat(current?.amount);
      return value + currentValue;
    }, 0);

    return this.utils.parseNumberAsFloat(total.toFixed(2));
  }

  private parseFile(values: TSPPFileStructure): ISPPFileStructure[] {
    return values.map(row => {
      const values = {}
      values['accountNumber'] = String(row[0]).trim();
      values['amount'] = !row[1] ? '' : String(row[1]).trim();

      if (row[2] && environment.profile === EProfile.HONDURAS) {
        values['accountName'] = this.utils.fillStrings(String(row[2]), '', 60)
      }

      if (row[2] && environment.profile === EProfile.SALVADOR) {
        values['email'] = String(row[2]).trim();
      }

      return values as ISPPFileStructure
    })
  }

  private buildCurrentFile(currentFile: TSPPFileParsed, formValues: ISPPFormStatus) {
    const { credits, totalAmount} = formValues;

    return {
      credits,
      totalAmount,
      accounts: [
        ...currentFile
      ]
    } as ISPPFStructureParsed
  }

}
