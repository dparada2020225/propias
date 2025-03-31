import { Injectable } from '@angular/core';
import { I365TransferAmountValidParameters } from '../../interface/365-utils.interface';
import { UtilService } from '../../../../service/common/util.service';
import { CLIENT_TYPE } from '../../../../enums/common-value.enum';
import { DateTimeFormat } from '@adf/components';

@Injectable({
  providedIn: 'root'
})
export class Ttr365UtilsService {

  constructor(
    private utils: UtilService,
  ) { }

  getIsAmountValidByLimits(parameters: I365TransferAmountValidParameters) {
    const { currency, amount, limitByUser, currencies, availableAmountInSourceAccount, isT365MovilValidation } = parameters;
    const amountToNumber = this.utils.parseAmountStringToNumber(amount);

    if (amountToNumber > availableAmountInSourceAccount) {
      return {
        isValid: false,
        message: 'ach:label_not_amount_available'
      }
    }

    if (amountToNumber > limitByUser) {
      return {
        isValid: false,
        message: 'ach:label_365_error_limit_amount_by_user'
      }
    }

    const settingLimitByCurrency = currencies.find(setting => setting.code === currency);

    if (!settingLimitByCurrency) {
      return {
        isValid: false,
        message: 'no_config_currency'
      }
    }

    const { lowerNaturalLimit, loweLegalLimit, upperNaturaLimit, upperLegalLimit } = settingLimitByCurrency;

    const loweLimitByTypeClient = this.utils.getClientType() === CLIENT_TYPE.NATURAL ? lowerNaturalLimit : loweLegalLimit;
    const upperLimitByTypeClient = this.utils.getClientType() === CLIENT_TYPE.NATURAL ? upperNaturaLimit : upperLegalLimit;

    if (amountToNumber < loweLimitByTypeClient) {
      return {
        isValid: false,
        message: 'no_config_by type user'
      }
    }

    if (amountToNumber > upperLimitByTypeClient) {
      return {
        isValid: false,
        message: 'no_config_by type user'
      }
    }

    const { lowerT365MovilLimit, upperT365MovilLimit } = settingLimitByCurrency;

    if (amountToNumber < lowerT365MovilLimit && isT365MovilValidation) {
      return {
        isValid: false,
        message: 'no_config_by lower t365'
      }
    }

    if (amountToNumber > upperT365MovilLimit && isT365MovilValidation) {
      return {
        isValid: false,
        message: 'no_config_by lowe t365'
      }
    }


    return {
      isValid: true,
      message: undefined,
    }
  }

  getDateOperation(date: DateTimeFormat) {
    const hourRaw = date.hour.slice(0, 9);
    const suffix = date.hour.slice(9, 11).split('').join('.');

    return {
      standardWithHour: `${date.standard} ${hourRaw}${suffix.toLowerCase()}`
    }
  }
}
