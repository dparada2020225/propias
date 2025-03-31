import { StorageService } from '@adf/security';
import { Injectable } from '@angular/core';
import { PasswordDefinition } from 'src/app/models/change-password-modal';
import { PasswordResponse } from '../../../models/password-response.interface';
import { IpasswordSecurity, ISettingData } from '../../../models/setting-interface';

/**
 * @author Fabian Serrano
 * @date 03/07/21
 */

@Injectable({
  providedIn: 'root',
})
export class PasswordValidationService {
  regexPasswordList: Array<string> = PasswordDefinition.regexPasswordList;
  minLength: number = PasswordDefinition.minLength;
  settings!: ISettingData;

  regexPasswordListSV: Array<IpasswordSecurity> = new Array<IpasswordSecurity>();
  languaje: string = 'es';

  constructor(private storageService: StorageService) {
    if (this.storageService.getItem('securityParameters')) {
      this.settings = JSON.parse(this.storageService.getItem('securityParameters'));
      this.regexPasswordListSV = this.settings.passwordSecurity;
    }
  }

  passwordEvaluationSv(password: string): boolean {
    let isValid: boolean = false;
    if (password && this.regexPasswordListSV && this.regexPasswordListSV.length > 0) {
      let regex: RegExp;
      for (const passwordSecurity of this.regexPasswordListSV) {
        if (passwordSecurity.caseSensitive) {
          regex = new RegExp(passwordSecurity.regex);
        } else {
          regex = new RegExp(passwordSecurity.regex, 'i');
        }

        if (!regex.test(password)) {
          isValid = false;
          break;
        } else {
          isValid = true;
        }
      }
    }
    return isValid;
  }

  validationPasswordSv(password: string, language?: string): PasswordResponse[] {
    if (language) {
      this.languaje = language;
    } else {
      if (localStorage.getItem('code')) {
        this.languaje = localStorage.getItem('code') ?? 'es';
      }
    }

    let passwordList: PasswordResponse[] = [];

    if (password && this.regexPasswordListSV && this.regexPasswordListSV.length > 0) {
      let regex: RegExp;
      for (const passwordSecurity of this.regexPasswordListSV) {
        if (passwordSecurity.caseSensitive) {
          regex = new RegExp(passwordSecurity.regex);
        } else {
          regex = new RegExp(passwordSecurity.regex, 'i');
        }

        passwordList.push(this.handleGetPasswordList(regex, password, passwordSecurity));
      }
    }
    return passwordList;
  }

  handleGetPasswordList(regex: RegExp, password: string, passwordSecurity: IpasswordSecurity) {
    let response: PasswordResponse;

    if (regex.test(password)) {
      response = {
        label: this.languaje === 'es' ? passwordSecurity.label.es : passwordSecurity.label.en,
        isValid: true,
      };
    } else {
      response = {
        label: this.languaje === 'es' ? passwordSecurity.label.es : passwordSecurity.label.en,
        isValid: false,
      };
    }

    return response;
  }

  validation(password: any): string {
    const numberValidations = this.regexPasswordList.length + 1;
    let successfulValidation = 0;

    if (password && this.regexPasswordList && this.regexPasswordList.length > 0) {
      for (const regexPassword of this.regexPasswordList) {
        let regex = new RegExp(regexPassword);

        if (regex.test(password)) {
          successfulValidation = successfulValidation + 1;
        }
      }
    }

    if (password && password.length >= this.minLength) {
      successfulValidation = successfulValidation + 1;
    }

    let typeDifficulty = Math.round((5 * successfulValidation) / numberValidations);

    switch (typeDifficulty) {
      case 0:
        return 'cero';

      case 1:
        return 'veryLow';

      case 2:
        return 'low';

      case 3:
        return 'half';

      case 4:
        return 'high';

      case 5:
        return 'hard';

      default:
        return 'cero';
    }
  }
}
