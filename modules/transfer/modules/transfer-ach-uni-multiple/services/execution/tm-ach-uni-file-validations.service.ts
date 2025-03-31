import { EventEmitter, Injectable } from '@angular/core';
import { ETMAchUniFileLoadedKeys, ITMAchUniFileLoadedList, ITMAchUniFileValidationResponse, ITMAchUniFileValidationResponseParameters, ITMAchUniLoadFileParameters } from '../../interfaces/ach-uni-load-file.interface';
import { LoadSheetFileService } from 'src/app/service/common/load-sheet-file.service';
import { UtilService } from 'src/app/service/common/util.service';
import { IAchAccount } from '../../../transfer-ach/interfaces/ach-account-interface';
import { ITMAchUniAchAccount } from '../../interfaces/ach-uni-table.interface';
import { ITMAchUniFileValidationBaseParameters, ITmAchUnifileValidationsParameters } from '../../interfaces/ach-uni-file-validations.interface';
import { TranslateService } from '@ngx-translate/core';
import { EProductFromCode } from 'src/app/enums/product.enum';

@Injectable({
  providedIn: 'root'
})
export class TmAchUniFileValidationsService {
  private emitFile!: EventEmitter<ITMAchUniFileValidationResponse>;
  private MIN_DATA_FILE_SIZE_PER_REGISTER = 9;
  private file!: File;
  private FILE_KEYS = [
    ETMAchUniFileLoadedKeys.BANK_CODE,
    ETMAchUniFileLoadedKeys.PRODUCT,
    ETMAchUniFileLoadedKeys.CURRENCY,
    ETMAchUniFileLoadedKeys.ACCOUNT,
    ETMAchUniFileLoadedKeys.AMOUNT,
    ETMAchUniFileLoadedKeys.COMMENT,
    ETMAchUniFileLoadedKeys.NUMBER_LINE
  ];

  constructor(
    private loadSheetFileService: LoadSheetFileService,
    private utils: UtilService,
    private translate: TranslateService,
  ) {
  }

  validate(startupParameters: ITMAchUniLoadFileParameters) {
    const {
      file,
      emitter,
      formValues,
      settings,
      targetAccountList,
      targetAccountListMap,
      workSheetRawValues,
    } = startupParameters;

    this.emitFile = emitter;
    this.file = file;
    //VALIDACION DEL NOMBRE DEL ARCHIVO
    if(!this.validateNameLong(file)) return false;

    if(!this.validateFileType(file)) return false;

    //VERIFICACION DE CANTIDAD DE LINEAS DEL ARCHIVO
    if (!this.validateEmptyFile({workSheetRawValues, fileRaw: file})) return false;

    // //VALIDACION PARA QUE LAS LINEAS ESTEN LLENAS DE MANERA ADECUADA
    if (!this.manageValidateIsCompleteDataInFile({
      workSheetRawValues,
      fileRaw: file,
    })) return false;

    const fileParsed = this.loadSheetFileService.parseWorkSheetValueIntoObjStructure<ITMAchUniFileLoadedList>({
      list: workSheetRawValues,
      keys: this.FILE_KEYS,
      setValueInNull: (key: string) => this.setValueInNull(key),
      parseFileValues: (value: string | number, key: string) => this.parseFileValues(value, key)
    });
    //validacion de total de creditos y total monto en el archivo vs creditos y  monto en el form
    if (!this.fileValidations({
      formValues,
      fileParsed,
    })) return false;

    const fileParseToAchAccounts = this.parseFileToAchAccounts(fileParsed, targetAccountListMap);

    if(fileParseToAchAccounts.length > 0 && fileParseToAchAccounts.length === fileParsed.length) {
      this.handleEmitResponse({
        message: 'label:success_file',
        isSuccessLoadFile: true,
        fileLoaded: {
          accounts: fileParseToAchAccounts,
        },
        fileRaw: file,
        dataInvalid: false
      });
      return true;
    }else{
      return false;
    }
  }

  validateNameLong(file: File): boolean {
    const fileName = file.name;
    const isValid: boolean = fileName.length <= 70;
    if (!isValid) {
      this.handleEmitResponse({
        message: 'tm-ach-uni:error_file_name_long',
        isSuccessLoadFile: false,
        fileLoaded: null,
        fileRaw: file,
        dataInvalid: false
      });
      return false;
    }
    return isValid;
  }

  validateFileType(file: File): boolean {
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop();
    const isValid: boolean = fileExtension === 'xlsx' || fileExtension === 'xls' || fileExtension === 'csv';

    if (!isValid) {
      this.handleEmitResponse({
        message: 'tm-ach-uni:error_file_type',
        isSuccessLoadFile: false,
        fileLoaded: null,
        fileRaw: file,
        dataInvalid: false
      });
      return false;
    }
    return isValid;
  }

  private parseFileToAchAccounts(fileParsed: ITMAchUniFileLoadedList, associatedAccountsMap: Map<string, IAchAccount>) {

    const list: ITMAchUniAchAccount[] = [];
    let missingAccounts = false;
    let numberline = -1;
    let incorrectData!: any;

    for (const accountFromFile of fileParsed) {
      const account = String(accountFromFile?.accountNumber);
      if (associatedAccountsMap.has(account)) {

        accountFromFile.description = this.replaceInvalidChars(accountFromFile.description);
        const currentAccount = associatedAccountsMap.get(account) as IAchAccount;
        accountFromFile.bankCode = this.padNumber(currentAccount.bank);
        accountFromFile.product = this.getCodeByProductName(currentAccount.type) ?? '';

        list.push({
          ...currentAccount,
          dataFromFile: {
            ...accountFromFile,
          }
        });

      } else {
        missingAccounts = true;
        numberline = accountFromFile?.lineNumber;
        incorrectData = accountFromFile;
        break;
      }
    }

    if (missingAccounts) {
      this.handleEmitResponse({
        message: 'tm-ach-uni:line_error_account_not_found_uni',
        isSuccessLoadFile: false,
        fileLoaded: null,
        dataInvalid: incorrectData,
        fileRaw: this.file,
      });
      return [];
    }

    return list;
  }

  private padNumber(num: number): string {
    return num.toString().padStart(4, '0');
  }

  private getCodeByProductName(productName: string): string | undefined {
    const entries = Object.entries(EProductFromCode);
    const foundEntry = entries.find(([code, name]) => name === productName);
    return foundEntry ? foundEntry[0] : undefined;
  }


  private replaceInvalidChars(input: string): string {
    const regex: RegExp = /[^A-Za-z\s\d]/g;
    const cleanedInput = input.replace(regex, '');
    return cleanedInput;
  }

  private validateEmptyFile(parameters: ITMAchUniFileValidationBaseParameters): boolean {
    const { fileRaw, workSheetRawValues } = parameters;
    const isValid = workSheetRawValues.length > 0;
    if (!isValid) {
      this.handleEmitResponse({
        message: 'label:empty_file',
        isSuccessLoadFile: false,
        fileLoaded: null,
        fileRaw: fileRaw,
        dataInvalid: false
      });
      return false;
    }
    return isValid;
  }

  private validateIsCompleteDataInFile(parameters: ITMAchUniFileValidationBaseParameters): boolean {
    const { workSheetRawValues } = parameters;
    for (let i = 0; i < workSheetRawValues.length; i++) {
      const row = workSheetRawValues[i];
      const [bankCode, productCode, currencyCode, account, amount, comment, lineNumber] = row;
      const numberline = i + 1;
      const rowTemp = [...row];
      rowTemp.pop();

      if (rowTemp.length !== 6) {
        this.handleEmitResponse({
          message: this.translate.instant('tm-ach-uni:line_error_file_colums_invalid', { numberline }),
          isSuccessLoadFile: false,
          fileLoaded: null,
          fileRaw: parameters.fileRaw,
          dataInvalid: false
        });
        return false;
      }

      // Condición 2: El código de banco, posición 0 del arreglo es nulo o vacío
      if(!bankCode){
        this.handleEmitResponse({
          message: this.translate.instant('tm-ach-uni:line_error_file_bank_invalid', { numberline }),
          isSuccessLoadFile: false,
          fileLoaded: null,
          fileRaw: parameters.fileRaw,
          dataInvalid: false
        });
        return false;
      }
      // Condición 3: El código de banco, posición 0 del arreglo no tiene 4 caracteres
      if(!this.verifyLength(bankCode, 4)){
        this.handleEmitResponse({
          message: this.translate.instant('tm-ach-uni:line_error_file_bank_long_invalid', { numberline }),
          isSuccessLoadFile: false,
          fileLoaded: null,
          fileRaw: parameters.fileRaw,
          dataInvalid: false
        });
        return false;
      }
      // Condición 4: El código de banco, posición 0 del arreglo no es numérico
      if (isNaN(Number(bankCode))) {
        this.handleEmitResponse({
          message: this.translate.instant('tm-ach-uni:line_error_file_bank_invalid', { numberline }),
          isSuccessLoadFile: false,
          fileLoaded: null,
          fileRaw: parameters.fileRaw,
          dataInvalid: false
        });
        return false;
      }
      // Condición 5: El código de producto, posición 1 del arreglo no es numérico
      if (isNaN(Number(productCode)) || !productCode) {
        this.handleEmitResponse({
          message: this.translate.instant('tm-ach-uni:line_error_file_product_invalid', { numberline }),
          isSuccessLoadFile: false,
          fileLoaded: null,
          fileRaw: parameters.fileRaw,
          dataInvalid: false
        });
        return false;
      }
      // Condición 6: El código de producto, posición 1 no tiene 2 caracteres
      if(!this.verifyLength(productCode, 2)){
        this.handleEmitResponse({
          message: this.translate.instant('tm-ach-uni:line_error_file_product_long_invalid', { numberline }),
          isSuccessLoadFile: false,
          fileLoaded: null,
          fileRaw: parameters.fileRaw,
          dataInvalid: false
        });
        return false;
      }
      // Condición 7: El código de moneda, posición 2 está vacío
      if (!currencyCode) {
        this.handleEmitResponse({
          message: this.translate.instant('tm-ach-uni:line_error_file_currency_code_invalid', { numberline }),
          isSuccessLoadFile: false,
          fileLoaded: null,
          fileRaw: parameters.fileRaw,
          dataInvalid: false
        });
        return false;
      }
      // Condición 8: El código de moneda, posición 2 no tiene 3 caracteres
      if (!this.verifyLength(currencyCode, 3)) {
        this.handleEmitResponse({
          message: this.translate.instant('tm-ach-uni:line_error_file_currency_long_code_invalid', { numberline }),
          isSuccessLoadFile: false,
          fileLoaded: null,
          fileRaw: parameters.fileRaw,
          dataInvalid: false
        });
        return false;
      }
      // Condición 9: La cuenta, posición 3 del arreglo no es un número entero
      if (!Number.isInteger(Number(account)) || !account) {
        this.handleEmitResponse({
          message: this.translate.instant('tm-ach-uni:line_error_file_account_invalid', { numberline }),
          isSuccessLoadFile: false,
          fileLoaded: null,
          fileRaw: parameters.fileRaw,
          dataInvalid: false
        });
        return false;
      }
      // Condición 10: La cuenta, posición 3 del arreglo tiene más de 17 caracteres
      if (!this.verifyLength(account, 17)) {
        this.handleEmitResponse({
          message: this.translate.instant('tm-ach-uni:line_error_file_account_long_invalid', { numberline }),
          isSuccessLoadFile: false,
          fileLoaded: null,
          fileRaw: parameters.fileRaw,
          dataInvalid: false
        });
        return false;
      }
      // Condición 11: El monto, posición 4 del arreglo no es numérico o es igual a 0
      if (isNaN(Number(amount)) || Number(amount) === 0 || !amount) {
        this.handleEmitResponse({
          message: this.translate.instant('tm-ach-uni:line_error_file_amount_invalid', { numberline }),
          isSuccessLoadFile: false,
          fileLoaded: null,
          fileRaw: parameters.fileRaw,
          dataInvalid: false
        });
        return false;
      }
      // Condición 12: El monto, posición 4 del arreglo tiene la longitud del valor ingresado en monto superior a los 13 caracteres
      if (!this.verifyLength(amount, 13)) {
        this.handleEmitResponse({
          message: this.translate.instant('tm-ach-uni:line_error_file_amount_long_invalid', { numberline }),
          isSuccessLoadFile: false,
          fileLoaded: null,
          fileRaw: parameters.fileRaw,
          dataInvalid: false
        });
        return false;
      }
      // Condición 13: El comentario, posición 5 del arreglo tiene una longitud mayor a 60 posiciones
      if (!comment) {
        this.handleEmitResponse({
          message: this.translate.instant('tm-ach-uni:line_error_file_comment_invalid', { numberline }),
          isSuccessLoadFile: false,
          fileLoaded: null,
          fileRaw: parameters.fileRaw,
          dataInvalid: false
        });
        return false;
      }

      if (!this.verifyLength(comment, 60)) {
        this.handleEmitResponse({
          // message: `Longitud de comentario inválida en línea ${i + 1}.`,
          message: this.translate.instant('tm-ach-uni:line_error_file_comment_long_invalid', { numberline }),
          isSuccessLoadFile: false,
          fileLoaded: null,
          fileRaw: parameters.fileRaw,
          dataInvalid: false
        });
        return false;
      }

      // Condición 14: El comentario, posición 5 del arreglo no contiene caracteres espciales
      if (!this.checkSpecialCharacters(comment.toString())) {
        const regex: RegExp = /^[A-Za-z\s\d]*$/;

        if(comment.toString().includes('Ñ') || comment.toString().includes('ñ')){
          this.handleEmitResponse({
            message: this.translate.instant('tm-ach-uni:line_error_file_comment_invalid_character_spanish', { numberline }),
            isSuccessLoadFile: false,
            fileLoaded: null,
            fileRaw: parameters.fileRaw,
            dataInvalid: false
          });
          return false;
        }

        if(comment.toString().includes('*][')){
          this.handleEmitResponse({
            message: this.translate.instant('tm-ach-uni:line_error_file_comment_invalid_character_special', { numberline }),
            isSuccessLoadFile: false,
            fileLoaded: null,
            fileRaw: parameters.fileRaw,
            dataInvalid: false
          });
          return false;
        }
      }
    }
    // Si todas las validaciones pasan
    return true;
  }

  checkSpecialCharacters(text: string): boolean {
    const regex = /^[A-Za-z\s\d]*$/;
    return regex.test(text);
  }


  private verifyLength(value: string | number, maxLength: number): boolean {
    const strValue = value.toString();
    return strValue.length <= maxLength;
  }

  private manageValidateIsCompleteDataInFile(parameters: ITMAchUniFileValidationBaseParameters): boolean {

    const isValid = this.validateIsCompleteDataInFile(parameters);
    if (!isValid) {
      return false;
    }
    return isValid;
  }

  private fileValidations(parameters: ITmAchUnifileValidationsParameters) {
    if (!this.validateAmountIsNotEqualToSumOfDetailAmount(parameters)) return false;
    return this.validateQuantityOfRegisters(parameters);
  }

  /* =============================== SPECIFIC FILE VALIDATIONS =====================================*/

  private validateAmountIsNotEqualToSumOfDetailAmount(parameters: ITmAchUnifileValidationsParameters) {
    const { fileParsed, formValues } = parameters;

    const { amount } = formValues
    const totalAmountInFile = this.getTotalAmount(fileParsed);
    const isTheSameValue = this.utils.parseNumberAsFloat(amount) === totalAmountInFile
    if (!isTheSameValue) {
      this.handleEmitResponse({
        message: 'tm-ach-uni:error_different_amount_registers_to_debit',
        isSuccessLoadFile: false,
        fileLoaded: null,
        fileRaw: this.file,
        dataInvalid: false
      });
      return false;
    }

    return isTheSameValue;
  }

  private validateQuantityOfRegisters(parameters: ITmAchUnifileValidationsParameters) {
    const { formValues, fileParsed } = parameters;
    const totalRegisters = fileParsed.length;
    const isTheSameValuesInFile =  this.utils.parseNumberAsFloat(formValues.credits) === totalRegisters;

    if (!isTheSameValuesInFile) {
      this.handleEmitResponse({
        message: 'payroll:error_quantity_credits',
        isSuccessLoadFile: false,
        fileLoaded: null,
        fileRaw: this.file,
        dataInvalid: false
      });
      return false;
    }

    return isTheSameValuesInFile;
  }

  /* =============================== SPECIFIC FILE VALIDATIONS =====================================*/

  private handleEmitResponse(parameters: ITMAchUniFileValidationResponseParameters) {
    const { message, fileRaw, isSuccessLoadFile, fileLoaded, dataInvalid } = parameters;
    this.emitFile.emit({
      message,
      fileRaw,
      fileLoaded,
      isSuccessLoadFile,
      dataInvalid
    } as ITMAchUniFileValidationResponse);
  }

  private setValueInNull(key: string) {
    const keysMap = {};

    return keysMap[key] ?? null;
  }

  private parseFileValues(value: string | number, key: string) {
    return value;
  }

  private getTotalAmount(registers: ITMAchUniFileLoadedList) {
    const total = registers.reduce((value, current) => {
      const currentValue = this.utils.parseNumberAsFloat(current?.amount);
      return value + currentValue;
    }, 0);

    return this.utils.parseNumberAsFloat(total.toFixed(2));
  }

}
