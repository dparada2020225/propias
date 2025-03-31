import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

/**
 * @author Eder Santos
 * @author Matthew Gaitan
 * @date 10/06/21
 *
 * Provide a way to obtain the translate key for the backend messages
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {

  constructor(private translate: TranslateService) {
  }

  /**
   * Get the translate key, if the traslate key is not found return the message if able, if not return the http status
   * translate key
   * @param data A json with the error
   * @return A string with the
   */
  getTranslateKey(data: any): string {
    let key = '';
    if (data && data.error && data.error.code) {

      key = this.buildError(data.error.code);
    }
    if (key && this.hasTranslation(key)) {
      return key;
    } else {
      if (data && data.error && data.error.message) {
        return data.error.message;
      } else {
        return this.buildError(data?.error?.status ?? data?.code , 'http');
      }
    }

  }

  private hasTranslation(key: string): boolean {
    const translation = this.translate.instant(key);
    return translation !== key && translation !== '';
  }

  private buildError(code: any, module: string = 'dep'): string {
    return `error.${module}.${code}`;
  }
}
