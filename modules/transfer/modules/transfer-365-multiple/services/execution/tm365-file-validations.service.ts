import { EventEmitter, Injectable } from '@angular/core';
import {
  ETM365FileLoadedKeys, ITM365FileLoadedList,
  ITM365FileValidationResponse, ITM365FileValidationResponseParameters,
  ITM365LoadFileParameters
} from '../../interfaces/load-file.interface';
import {
  fileValidationsParameters,
  ITM365FileValidationBaseParameters
} from '../../interfaces/file-validations.interface';
import { LoadSheetFileService } from '../../../../../../service/common/load-sheet-file.service';
import { UtilService } from '../../../../../../service/common/util.service';
import {
  BisvGeneralParameters, IACHBiesGeneralParameterBank,
  IACHBiesGeneralParameters
} from '../../../../../../models/ach-general-parameters.interface';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class Tm365FileValidationsService {
  private emitFile!: EventEmitter<ITM365FileValidationResponse>;
  private MIN_DATA_FILE_SIZE_PER_REGISTER = 9;
  private REGEX_ALPHANUMERIC = /^[a-zA-Z0-9\s]*$/;
  private REGEX_EMAIL = new RegExp('[a-zA-Z0-9_-]+([.][a-zA-Z0-9_-]+)*@[a-zA-Z0-9_-]+([.][a-zA-Z0-9_-]+)*[.][a-zA-Z]{2,5}');
  private settings: IACHBiesGeneralParameters = new BisvGeneralParameters().build();
  private VALID_TYPE_CLIENT = ['J', 'N'];

  private file!: File;
  private FILE_KEYS = [
    ETM365FileLoadedKeys.BANK_CODE,
    ETM365FileLoadedKeys.PRODUCT,
    ETM365FileLoadedKeys.CURRENCY,
    ETM365FileLoadedKeys.ACCOUNT,
    ETM365FileLoadedKeys.ACCOUNT_NAME,
    ETM365FileLoadedKeys.TYPE_CLIENT,
    ETM365FileLoadedKeys.AMOUNT,
    ETM365FileLoadedKeys.EMAIL,
    ETM365FileLoadedKeys.COMMENT,
  ];

  constructor(
    private loadSheetFileService: LoadSheetFileService,
    private utils: UtilService,
    private translate: TranslateService,
  ) {
  }

  validate(startupParameters: ITM365LoadFileParameters) {
    const {
      file,
      emitter,
      formValues,
      settings,
      workSheetRawValues,
    } = startupParameters;

    this.emitFile = emitter;
    this.file = file;
    this.settings = settings;
    console.log(this.settings)

    if (!this.validateEmptyFile({
      workSheetRawValues,
      fileRaw: file,
    })) return false;

    if (!this.manageValidateIsCompleteDataInFile({
      workSheetRawValues,
      fileRaw: file,
    })) return false;

    const fileParsed = this.loadSheetFileService.parseWorkSheetValueIntoObjStructure<ITM365FileLoadedList>({
      list: workSheetRawValues,
      keys: this.FILE_KEYS,
      setValueInNull: (key: string) => this.setValueInNull(key),
      parseFileValues: (value: string | number, key: string) => this.parseFileValues(value, key)
    });

    if (!this.fileValidations({
      formValues,
      fileParsed,
    })) return false;

    this.handleEmitResponse({
      message: 'label:success_file',
      isSuccessLoadFile: true,
      fileLoaded: {
        accounts: this.parseRegisters(fileParsed),
      },
      fileRaw: file,
    });

    return true;
  }

  private validateEmptyFile(parameters: ITM365FileValidationBaseParameters): boolean {
    const { fileRaw, workSheetRawValues } = parameters;
    const isValid = workSheetRawValues.length > 0;

    if (!isValid) {
      this.handleEmitResponse({
        message: 'label:empty_file',
        isSuccessLoadFile: false,
        fileLoaded: null,
        fileRaw: fileRaw,
      });
      return false;
    }

    return isValid;
  }

  private validateIsCompleteDataInFile(parameters: ITM365FileValidationBaseParameters): boolean {
    const { workSheetRawValues } = parameters;

    const columnsRequired = workSheetRawValues.map(row => row.slice(0, row.length));
    const isColumnNull = columnsRequired.some(row => row.some(column => column === null));
    const isColumnUndefined = columnsRequired.some(row => row.some(column => column === undefined));
    const isColumnEmpty = columnsRequired.some(row => row.some(column => column === ''));
    const validate = isColumnNull || isColumnUndefined || isColumnEmpty;
    const isCompletedColumns = columnsRequired.every(row => row.length === this.MIN_DATA_FILE_SIZE_PER_REGISTER);
    return !(isCompletedColumns && validate);
  }

  private manageValidateIsCompleteDataInFile(parameters: ITM365FileValidationBaseParameters): boolean {
    const { fileRaw } = parameters;
    const isValid = this.validateIsCompleteDataInFile(parameters);

    if (!isValid) {
      this.handleEmitResponse({
        message: 'error:ach_valid_rows_in_file',
        isSuccessLoadFile: false,
        fileLoaded: null,
        fileRaw: fileRaw,
      });

      return false;
    }


    return isValid;
  }

  private fileValidations(parameters: fileValidationsParameters) {
    if (!this.validateAmountIsNotEqualToSumOfDetailAmount(parameters)) return false;

    if (!this.validateBankCodeIsNumber(parameters.fileParsed)) return false;

    if (!this.validateBankExistInSettings(parameters.fileParsed)) return false;

    if (!this.validateProductIncludeInBankSelected(parameters.fileParsed)) return false;

    if (!this.validateCurrencyValue(parameters.fileParsed)) return false;

    if (!this.validateEmailField(parameters.fileParsed)) return false;

    if (!this.validateCommentAndName(parameters.fileParsed)) return false;

    if (!this.validateAmountValidAndLength(parameters.fileParsed)) return false;

    if (!this.validLengthComment(parameters.fileParsed)) return false;

    if (!this.validTypeClient(parameters.fileParsed)) return false;

    return this.validateQuantityOfRegisters(parameters);
  }

  /* =============================== SPECIFIC FILE VALIDATIONS =====================================*/

  private validateAmountIsNotEqualToSumOfDetailAmount(parameters: fileValidationsParameters) {
    const { fileParsed, formValues } = parameters;

    const { amount } = formValues
    const totalAmountInFile = this.getTotalAmount(fileParsed);
    const isTheSameValue = this.utils.parseNumberAsFloat(amount) === totalAmountInFile

    if (!isTheSameValue) {
      this.handleEmitResponse({
        message: 'payroll:error_different_amount_registers_to_debit',
        isSuccessLoadFile: false,
        fileLoaded: null,
        fileRaw: this.file,
      });
      return false;
    }

    return isTheSameValue;
  }

  private validateQuantityOfRegisters(parameters: fileValidationsParameters) {
    const { formValues, fileParsed } = parameters;
    const totalRegisters = fileParsed.length;
    const isTheSameValuesInFile =  this.utils.parseNumberAsFloat(formValues.credits) === totalRegisters;

    if (!isTheSameValuesInFile) {
      this.handleEmitResponse({
        message: 'payroll:error_quantity_credits',
        isSuccessLoadFile: false,
        fileLoaded: null,
        fileRaw: this.file,
      });
      return false;
    }

    return isTheSameValuesInFile;
  }

  private validateBankCodeIsNumber(accountList: ITM365FileLoadedList) {
    let idx = 0;

    const isValid = accountList.every((account, id) => {
      const value = Number(account.bankCode);
      const isNumber = isNaN(value);

      if (isNumber) {
        idx = id + 1;
      }

      return isNumber;
    });


    if (isValid) {
      this.handleEmitResponse({
        message: 'payroll:error_quantity_credits',
        isSuccessLoadFile: false,
        fileLoaded: null,
        fileRaw: this.file,
      });

      return false;
    }

    return true;
  }

  private validateBankExistInSettings(accountList: ITM365FileLoadedList) {
    let idx = 0;
    const bankAvailable = this.settings.banks.filter(bank => bank.participant[1] === 'S');
    const bankCodes = bankAvailable.map(bank => bank.code);

    const isValidBankCode = accountList.every((account, i) => {
      const isValid = bankCodes.includes(Number(account.bankCode).toString());

      if (!isValid) {
        idx = i;
      }

      return isValid;
    });


    if (!isValidBankCode) {
      this.handleEmitResponse({
        message: 'payroll:error_quantity_credits',
        isSuccessLoadFile: false,
        fileLoaded: null,
        fileRaw: this.file,
      });

      return false;
    }

    return isValidBankCode;
  }

  private validateProductIncludeInBankSelected(accountList: ITM365FileLoadedList) {
    let idx = 0;
    const bankAvailable = this.settings.banks.filter(bank => bank.participant[1] === 'S');

    const isValidBankCode = accountList.every((account, i) => {
      const bankSelected = bankAvailable.find(bank => Number(bank.code) === Number(account.bankCode)) as IACHBiesGeneralParameterBank;
      const products = bankSelected.products.map(product => product.code);
      const isValid = products.includes(Number(account.product));

      if (!isValid) {
        idx = i;
      }

      return isValid;
    });


    if (!isValidBankCode) {
      this.handleEmitResponse({
        message: 'payroll:error_quantity_credits',
        isSuccessLoadFile: false,
        fileLoaded: null,
        fileRaw: this.file,
      });

      return false;
    }

    return isValidBankCode;
  }

  private validateCurrencyValue(accountList: ITM365FileLoadedList) {
    let idx = 0;
    const currencies = this.settings.currencies.map(currency => currency.code);

    const isValidCurrencyBank = accountList.every((account, i) => {
      const isValid = currencies.includes(account.currency.toUpperCase());

      if (!isValid) {
        idx = i;
      }

      return isValid;
    });


    if (!isValidCurrencyBank) {
      this.handleEmitResponse({
        message: 'payroll:error_quantity_credits',
        isSuccessLoadFile: false,
        fileLoaded: null,
        fileRaw: this.file,
      });

      return false;
    }

    return isValidCurrencyBank;
  }

  private validateEmailField(accountList: ITM365FileLoadedList) {
    let idx = 0;
    const isValidCurrencyBank = accountList.every((account, i) => {
      const isValid = this.REGEX_EMAIL.test(account.email);

      if (!isValid) {
        idx = i;
      }

      return isValid;
    });


    if (!isValidCurrencyBank) {
      this.handleEmitResponse({
        message: 'payroll:error_quantity_credits',
        isSuccessLoadFile: false,
        fileLoaded: null,
        fileRaw: this.file,
      });

      return false;
    }

    return isValidCurrencyBank;
  }

  private validateCommentAndName(accountList: ITM365FileLoadedList) {
    let idx = 0;
    const isValidCurrencyBank = accountList.every((account, i) => {
      const isValid = this.REGEX_ALPHANUMERIC.test(account.comment) && this.REGEX_ALPHANUMERIC.test(account.accountName);

      if (!isValid) {
        idx = i;
      }

      return isValid;
    });


    if (!isValidCurrencyBank) {
      this.handleEmitResponse({
        message: 'payroll:error_quantity_credits',
        isSuccessLoadFile: false,
        fileLoaded: null,
        fileRaw: this.file,
      });

      return false;
    }

    return isValidCurrencyBank;
  }

  private validLengthComment(accountList: ITM365FileLoadedList) {
    let idx = 0;
    const isValidCurrencyBank = accountList.every((account, i) => {
      const isValid = account.comment.length <= 40;

      if (!isValid) {
        idx = i;
      }

      return isValid;
    });


    if (!isValidCurrencyBank) {
      this.handleEmitResponse({
        message: 'payroll:error_quantity_credits',
        isSuccessLoadFile: false,
        fileLoaded: null,
        fileRaw: this.file,
      });

      return false;
    }

    return isValidCurrencyBank;
  }

  private validateAmountValidAndLength(accountList: ITM365FileLoadedList) {
    let idx = 0;

    const isValidCurrencyBank = accountList.every((account, i) => {
      const amount = this.utils.parseNumberAsFloat(account.amount);
      const isValidAmount = amount > 0;
      const amountToValid = String(account.amount).includes('.') ? String(account.amount).replace('.', ''): String(account.amount);
      const isValidLength = amountToValid.length >= 0 && amountToValid.length <= 13;
      const isValid = isValidAmount && isValidLength;

      if (!isValid) {
        idx = i;
      }

      return isValid;
    });


    if (!isValidCurrencyBank) {
      this.handleEmitResponse({
        message: 'payroll:error_quantity_credits',
        isSuccessLoadFile: false,
        fileLoaded: null,
        fileRaw: this.file,
      });

      return false;
    }

    return isValidCurrencyBank;
  }

  private validTypeClient(accountList: ITM365FileLoadedList) {
    let idx = 0;

    const isValidCurrencyBank = accountList.every((account, i) => {
      const isValid = this.VALID_TYPE_CLIENT.includes(account.typeClient.toUpperCase());

      if (!isValid) {
        idx = i;
      }

      return isValid;
    });


    if (!isValidCurrencyBank) {
      this.handleEmitResponse({
        message: 'payroll:error_quantity_credits',
        isSuccessLoadFile: false,
        fileLoaded: null,
        fileRaw: this.file,
      });

      return false;
    }

    return isValidCurrencyBank;
  }

  /* =============================== SPECIFIC FILE VALIDATIONS =====================================*/

  private handleEmitResponse(parameters: ITM365FileValidationResponseParameters) {
    const { message, fileRaw, isSuccessLoadFile, fileLoaded } = parameters;
    this.emitFile.emit({
      message,
      fileRaw,
      fileLoaded,
      isSuccessLoadFile,
    } as ITM365FileValidationResponse);
  }

  private setValueInNull(key: string) {
    const keysMap = {};

    return keysMap[key] ?? null;
  }

  private parseFileValues(value: string | number, key: string) {
    return value;
  }

  private parseRegisters(accountList: ITM365FileLoadedList) {
    return accountList.map(account => {
      const bankSelected = this.settings.banks.find(bank => Number(bank.code) === Number(account.bankCode));

      return {
        ...account,
        bankName: bankSelected?.description ?? account?.bankCode,
        productName: this.getProductName(account.product),
        amountFormatted: this.utils.formatAmount(account.amount),
        clientTypeFormatted: this.utils.getClientTypeName(account.typeClient),
      }
    })
  }

  private getTotalAmount(registers: ITM365FileLoadedList) {
    const total = registers.reduce((value, current) => {
      const currentValue = this.utils.parseNumberAsFloat(current?.amount);
      return value + currentValue;
    }, 0);

    return this.utils.parseNumberAsFloat(total.toFixed(2));
  }


  private getProductName(product: string) {
    const base = this.translate.instant('tm365:label_account');
    const productName = this.utils.getLabelProduct(Number(product));

    return `${base} ${productName}`.toUpperCase();
  }

}
