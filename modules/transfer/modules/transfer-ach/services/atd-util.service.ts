import { Injectable } from '@angular/core';
import { IAchAccount, IAChBulkTransferAccount } from '../interfaces/ach-account-interface';
import { EProductFromCode, Product } from '../../../../../enums/product.enum';
import {
  IACHCurrencies,
  IACHSettings,
  IBuildScheduleParameter,
  IDataToSettingsACH
} from '../interfaces/settings.interface';
import { IParametersToExecuteTransaction } from '../interfaces/ach-transfer.interface';
import {
  ACHSourceAccountBuilder,
  ACHTargetAccountBuilder,
  ACHTransactionBuilder, IACHScheduleResponse
} from '../interfaces/ach-transaction.interface';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import listOfBankRouteJson from '../data/bank-route.json';
import { UtilService } from '../../../../../service/common/util.service';
import { ParameterManagementService } from '../../../../../service/navegation-parameters/parameter-management.service';
import {
  IProviderDetail
} from '../../../../transaction-manager/modules/signature-tracking/interfaces/st-process.interface';
import { IAccount } from '../../../../../models/account.inteface';
import { EFormatRegister, EPaymentType } from '../../../../../enums/payment-type.enum';
import { AdfFormatService, IDataSelect, IPossibleValue } from '@adf/components';
import { HOUR_WIDGET_SPLIT_VALUES } from '../../../../../enums/common-value.enum';
import { TranslateService } from '@ngx-translate/core';
import { IBTTargetAccountBuilderMap } from '../../bulk-transfer/interfaces/bt-transaction.interface';
import { EACHStatusAccount, EACHTypeSchedule } from '../enum/transfer-ach.enum';
import { ACCOUNT_CLIENT_TYPE, ACH_TRANSACTION_TYPE } from '../enum/ach-crud-control-name.enum';
import { ESides } from '../../../interface/table.enum';
import { AchUniParametersExecuteTransaction, AchUniParametersExecuteTransactionBuilder } from '../../transfer-ach-uni/interfaces/ach-uni-parameters-Execute-transaction';

@Injectable({
  providedIn: 'root'
})
export class AtdUtilService {

  constructor(
    private util: UtilService,
    private parameterManagementService: ParameterManagementService,
    private adfFormat: AdfFormatService,
    private translate: TranslateService,
  ) { }

  buildHoursToTransaction(parameters: IBuildScheduleParameter): IDataSelect {
    const { listSchedule, controlName } = parameters;
    const listScheduleResponse = listSchedule ?? [];

    const scheduleOptions: IPossibleValue[] = listScheduleResponse.map((schedule) => ({
      name: this.parseScheduleName(schedule),
      value: schedule?.hour,
    }));

    return {
      controlName: controlName,
      data: [
        {
          name: 'label:select',
          value: '',
        },
        ...scheduleOptions,
      ],
    };
  }

  getCurrentDate(date: NgbDate) {
    const day = date?.day ? String('0' + date?.day).slice(-2) : '';
    const month = date?.month ? String('0' + date?.month).slice(-2) : '';
    const year = date?.year || '';

    return `${day}/${month}/${year}`;
  }

  buildStringDateIntoDate(date: string) {
    const day = this.util.substr(date, 0, 2);
    const month = this.util.substr(date, 2, 2);
    const year = this.util.substr(date, 4, 4);

    return {
      day: Number(day),
      month: Number(month),
      year: Number(year),
    } as NgbDate;
  }

  parseScheduleName(schedule: IACHScheduleResponse) {
    const { hour, minutes } = this.parsedScheduleValue(schedule?.hour);
    const labelHour = this.translate.instant('label:hour');

    return `${hour}:${minutes} ${labelHour}`;
  }

  parsedScheduleValue(value: string) {
    const lengthHour = value.length <= HOUR_WIDGET_SPLIT_VALUES.LENGTH_HOUR ? HOUR_WIDGET_SPLIT_VALUES.MIN_LENGTH_HOUR : HOUR_WIDGET_SPLIT_VALUES.MAX_LENGTH_HOUR;
    const hour = ('0' + value.substring(0, lengthHour)).slice(-2);
    const minutes = value.substring(2, 4);
    const seconds = value.substring(4, 6);

    return {
      hour,
      minutes,
      seconds,
    }
  }

  getParsedScheduleValue(value: string) {
    const { hour, minutes, seconds } = this.parsedScheduleValue(value);

    return `${hour}:${minutes}:${seconds}`;
  }

  parsedAccounts(accounts: IAchAccount[]) {
    return accounts.map(account => ({
      ...account,
      currencyCode: this.util.getCurrencySymbolToIso(account?.currency ?? 'UNDEFINED'),
      typeAccountDescription: this.util.getLabelProduct(Number(Product[account.type])),
      currency: account?.currency,
    }));
  }

  getTargetAccountForMassiveTransferenceMap(parameters: IBTTargetAccountBuilderMap) {
    const { associatedAccountsMap, currentFile, achSettings } = parameters;
    const list: IAChBulkTransferAccount[] = [];

    currentFile.details.forEach(accountFromFile => {
      if (associatedAccountsMap.has(accountFromFile?.account)) {
        const currentAccount = associatedAccountsMap.get(accountFromFile?.account) as IAchAccount;
        list.push({
          ...currentAccount,
          currentAmount: accountFromFile?.amount,
          product: this.util.getLabelProduct(Number(Product[currentAccount?.type])),
          parsedAmount: this.adfFormat.formatAmount(accountFromFile?.amount),
          ...this.getDataToListOfBanks(achSettings, currentAccount)!,
        });
      }
    });

    return list;
  }

  compareAccountsToSort(a: IAchAccount, b: IAchAccount) {
    const first = a.currency?.toLowerCase();
    const second = b.currency?.toLowerCase();

    let comparison = 0;

    if (first > second) {
      comparison = 1;
    } else if (first < second) {
      comparison = -1;
    }
    return comparison;
  }

  getDataToListOfBanks(settings: IACHSettings[], targetAccountSelected: IAchAccount): IDataToSettingsACH | undefined {
    const bankSelected = settings.find((bank) => bank.id === targetAccountSelected?.bank);

    if (!bankSelected) { return; }

    const typeAccount: IACHCurrencies[] = bankSelected.toAccounts[targetAccountSelected?.type] ?? [];
    const currency = typeAccount.find((el) => el.toCurrency === targetAccountSelected?.currency);

    return {
      internalProduct: currency?.internalProduct as string,
      routeCode: currency?.routeCode as string
    };
  }

  dataToExecuteTransaction(parameters: IParametersToExecuteTransaction) {
    const {
      debitedAccount,
      accreditedAccount,
      formValues,
      dataFromSettings,
      hourSelected } = parameters ?? {};
    const currentForm = formValues;
    const idClient = this.parameterManagementService.getParameter('userInfo')?.customerCode;
    const schedule = this.buildScheduleParameter((currentForm?.date as NgbDate), formValues?.hour as string) ?? '';
    const sourceAccountRoute = this.getBankRouteForSourceAccount(accreditedAccount?.currencyCode ?? accreditedAccount?.currency);
    const date = this.calcDateParameters(schedule);
    const hour = this.getRawHour(hourSelected as IACHScheduleResponse);

    const currentSourceAccount = this.getDataSourceAccountToExecuteTransaction(debitedAccount);

    const targetAccount = new ACHTargetAccountBuilder()
      .bankId(dataFromSettings?.routeCode)
      .identification(accreditedAccount?.documentNumber)
      .name(accreditedAccount?.name)
      .email(accreditedAccount?.email)
      .account(accreditedAccount?.account)
      .accountProduct(Product[accreditedAccount?.type])
      .id(sourceAccountRoute)
      .amount(String(this.util.parseAmountStringToNumber(formValues?.amount)))
      .internalProduct(dataFromSettings?.internalProduct)
      .targetBankCode(accreditedAccount?.bank)
      .alias(accreditedAccount?.alias)
      .currency(this.util.getCurrencySymbolToIso(accreditedAccount?.currency))
      .typeClient(ACCOUNT_CLIENT_TYPE[accreditedAccount?.clientType])
      .bankName(accreditedAccount?.bankName)
      .status(EACHStatusAccount[accreditedAccount?.status || 'UNKNOWN'])
      .dateCreated(accreditedAccount?.creationDate.slice(0, 8))
      .userCreated(accreditedAccount?.userOfCreation)
      .dateModified(accreditedAccount?.modificationDate.slice(0, 8))
      .userModified(accreditedAccount?.userOfModification)
      .transferenceType(this.getTypeTransaction(formValues?.amount))
      .transferenceDate(date.transferenceDateRaw)
      .transferenceDateRaw(date.transferenceDate)
      .transferenceHour(hour?.code)
      .transferenceHourRaw(hour?.raw)
      .build();


    return new ACHTransactionBuilder()
      .cif(idClient)
      .paymentType(EPaymentType.ACH_TRANSFER)
      .formatRegister(EFormatRegister.ACH_TRANSFER)
      .currency(this.util.getCurrencySymbolToIso(accreditedAccount?.currency))
      .scheduleDate(schedule)
      .description(formValues?.comment)

      .source(currentSourceAccount.sourceAccount)
      .target(targetAccount)
      .omitASTransaction(parameters?.omitASTransaction)
      .build();
  }

  dataToExecuteTransactionAchUni(parameters: AchUniParametersExecuteTransaction) {
      const {
        sourceProduct,
        sourceSubproduct,
        sourceAccountNumber,
        sourceCurrency,
        sourceAmount,
        targetBank,
        targetProduct,
        targetAccountNumber,
        targetCurrency,
        targetAmount,
        commentary,
        targetAccountIdentificationNumber,
        purpose,
        clientType,
        clientNumber,
        sourceAccountName,
        targetAccountType,
        targetAccountIdentificationType,
        targetAccountName,
        targetAccountStatus,
        targetBankName,
        targetAccountEmail,
        commission,
        targetAccountCreationDate,
        targetAccountModificationDate,
        targetAccountCreationUser,
        targetAccountModificationUser,
        omitASTransaction
      } = parameters ?? {} as AchUniParametersExecuteTransaction;


      const transaction = new AchUniParametersExecuteTransactionBuilder()
      .sourceProduct(sourceProduct)
      .sourceSubproduct(sourceSubproduct)
      .sourceAccountNumber(sourceAccountNumber)
      .sourceCurrency(sourceCurrency)
      .sourceAmount(sourceAmount)
      .targetBank(targetBank)
      .targetProduct(targetProduct)
      .targetAccountNumber(targetAccountNumber)
      .targetCurrency(targetCurrency)
      .targetAmount(targetAmount)
      .commentary(commentary)
      .targetAccountIdentificationNumber(targetAccountIdentificationNumber)
      .targetAccountIdentificationType(targetAccountIdentificationType)
      .purpose(purpose)
      .clientType(clientType)
      .clientNumber(clientNumber)
      .sourceAccountName(sourceAccountName)
      .targetAccountType(targetAccountType)
      .targetAccountName(targetAccountName)
      .targetAccountStatus(targetAccountStatus)
      .targetBankName(targetBankName)
      .targetAccountEmail(targetAccountEmail)
      .commission(commission)
      .targetAccountCreationDate(targetAccountCreationDate)
      .targetAccountModificationDate(targetAccountModificationDate)
      .targetAccountCreationUser(targetAccountCreationUser)
      .targetAccountModificationUser(targetAccountModificationUser)
      .omitASTransaction(false)
      .build();

    return transaction;
  }

  buildScheduleForUseInServiceProcess(date: string, hourDescription: string) {
    const hour = this.buildHourFromDescription(hourDescription);
    const dateFormatted = this.buildDateFromRequestTransaction(date);

    return {
      hour,
      date: this.buildStringDateIntoDate(dateFormatted),
    }
  }

  buildIsTransactionSchedule(date: string, hour: string) {
    return Boolean(date && hour);
  }

  private buildHourFromDescription(description: string) {
    const data = description.slice(0,5).split(':').join('');
    const hour = data.slice(0,2);
    const minutes = data.slice(2,4);

    return `${hour}${minutes}00`;
  }

  buildHourForModifyFlow(hourDescription: string) {
    const data = hourDescription.slice(0,5).split(':').join('');
    const hour = data.slice(0,2).replace(/^0+/, '');
    const minutes = data.slice(2,4);

    return `${hour}${minutes}00`;
  }

  private buildDateFromRequestTransaction(date: string) {
    const year = date.slice(0,4);
    const month = date.slice(4,6);
    const day = date.slice(6,8);

    return `${day}${month}${year}`;
  }


  getTypeClientAccount(type: string) {
    return ACCOUNT_CLIENT_TYPE[type];
  }

  getStatusAccount(status: string) {
    return EACHStatusAccount[status];
  }

  getTypeTransaction(amount: string) {
    if (this.util.parseAmountStringToNumber(amount) > EACHTypeSchedule.LBTR_VALUE) {
      return ACH_TRANSACTION_TYPE.LBTR;
    }

    return ACH_TRANSACTION_TYPE.ACH;
  }

  getRawHour(hour: IACHScheduleResponse) {
    if (!hour) {
      return {
        code: '',
        raw: '',
      }
    }

    return {
      code: this.util.filledSideStrings(String(hour?.code), '0', 6, ESides.LEFT) || '',
      raw: hour?.description || '',
    }
  }

  calcDateParameters(schedule: string) {
    const dateFormatted = this.adfFormat.getFormatDateTime(schedule).date;
    const transferenceHour = dateFormatted.replace(/-/g, 'de').split(' ').slice(0, 4).join(' ');
    return {
      transferenceDate: schedule ? transferenceHour : '',
      transferenceDateRaw: schedule ? this.getRawDateForACHTransaction(schedule) : '',
    }
  }

  private getRawDateForACHTransaction(schedule: string) {
    const date = schedule.slice(0, 8);
    const day = date.slice(0, 2);
    const month = date.slice(2, 4);
    const year = date.slice(4, 8);

    return `${year}${month}${day}`
  }

  buildScheduleParameter(date: NgbDate, hour: string) {
    if (!date && !hour) { return null; }

    const day = ('0' + date?.day).slice(-2);
    const month = ('0' + date?.month).slice(-2);

    return `${day}${month}${date?.year}${this.util.filledSideStrings(hour, '0', 6, ESides.LEFT)}`;
  }

  getBankRouteForSourceAccount(currency: string) {
    const founded = listOfBankRouteJson[this.util.getProfile()];

    if (!founded) { return null; }

    return founded[(currency ?? 'UNDEFINED').toLowerCase()];
  }

  parseProductFromAccount(productName: string) {
    return String(productName || EProductFromCode['01']).toUpperCase();
  }

  getProduct(productName: string) {
    return Product[this.parseProductFromAccount(productName)];
  }

  getDataSourceAccountToExecuteTransaction(account: IAccount) {
    const sourceProduct = ('0' + account?.product).slice(-2);
    const sourceSubProduct = ('0' + account?.subproduct).slice(-2);

    const sourceAccountRoute = this.getBankRouteForSourceAccount(account?.currency);
    const userInfo = this.parameterManagementService.getParameter('userInfo');

    const sourceAccount = new ACHSourceAccountBuilder()
      .bankId(sourceAccountRoute)
      .identification(sourceAccountRoute )
      .name(account?.name)
      .email(userInfo?.email ?? '')
      .account(account?.account)
      .accountProduct(sourceProduct)
      .accountSubProduct(sourceSubProduct)
      .currency(account?.currency)
      .alias(account?.alias)
      .build();

    return {
      sourceAccount,
      sourceProduct,
      sourceSubProduct,
    }
  }

  getInternalProductForPaymentOfProviders(achSettings: IACHSettings[], accountSelected: IProviderDetail, currentCurrency: string) {
    const bankSelected = achSettings.find((bank) => bank.id === Number(accountSelected?.bankId));

    if (!bankSelected) { return '0'; }

    const typeAccount: any[] = bankSelected.toAccounts[this.parseProductFromAccount(accountSelected?.accountType)] ?? [];
    const currency = typeAccount.find((el) => el.toCurrency === this.util.getISOCurrency(currentCurrency));

    return currency ? currency.internalProduct : '0';
  }


}
