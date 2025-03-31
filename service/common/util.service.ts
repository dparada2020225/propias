import {AdfFormatService, AlertAttributeBuilder, AlertBuilder, ILayout} from '@adf/components';
import {StorageService} from '@adf/security';
import {Injectable} from '@angular/core';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import moment from 'moment';
import {NgxSpinnerService} from 'ngx-spinner';
import {ESides} from 'src/app/modules/transfer/interface/table.enum';
import {environment} from 'src/environments/environment';
import equivalenciesCurrency from '../../../assets/data/equivalencies-currency.json';
import equivalenciesProduct from '../../../assets/data/equivalencies-product.json';
import equivalenciesSimpleProduct from '../../../assets/data/equivalencies-simple-product.json';
import equivalenciesTranslation from '../../../assets/data/equivalencies-translation.json';
import {ParameterManagementService} from '../navegation-parameters/parameter-management.service';
import {Base64Service} from './base64.service';
import {LoaderBuilderService} from './loader-builder.service';
import {FindServiceCodeService} from './find-service-code.service';
import {
  EACHTransferUrlNavigationCollection
} from '../../modules/transfer/modules/transfer-ach/enum/navigation-parameter.enum';
import {
  EThirdTransferUrlNavigationCollection
} from '../../modules/transfer/modules/transfer-third/enums/third-transfer-navigate-parameters.enum';
import {
  EOwnTransferUrlNavigationCollection
} from '../../modules/transfer/modules/transfer-own/enum/navigation-parameter.enum';
import {IMenuLicensesResponse, MENU_OPTION_LICENSES_MAP} from '../../models/menu-option-licenses.interface';
import {EProfile} from "../../enums/profile.enum";
import {CACH_TYPE_MOVEMENTS} from '../../modules/transfer/modules/consult-ach/const/cach-common.enum';
import {
  ICACHDebitRegisters,
  ICOResponseAccount
} from '../../modules/transfer/modules/consult-ach/interfaces/consult-ach-definition.interface';
import { IAccount } from '../../models/account.inteface';
import {TypeFileLoaded} from "../../models/load-sheet.file.interface";
import { Product } from '../../enums/product.enum';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  profile = environment.profile;
  private scrollDuration = 200;

  constructor(
    private base64: Base64Service,
    private loaderBuilder: LoaderBuilderService,
    private persistStepStateService: ParameterManagementService,
    private translate: TranslateService,
    private storageService: StorageService,
    private spinner: NgxSpinnerService,
    private findServiceCode: FindServiceCodeService,
    private formatService: AdfFormatService,
  ) {
  }

  formatAmount(value: string | number) {
    const parsed = this.parseNumberAsFloat(value);
    return String(this.formatService.formatAmount(parsed));
  }

  getEmissionDate() {
    const date = moment().format('DD/MM/YYYY')
    const hour = moment().format('HH')
    const minute = moment().format('mm')

    const finalHour = `${hour}:${minute}:00`

    return {
      hour: finalHour,
      date,
    }
  }

  parseDateToFormat() {
    const { hour, date } = this.getEmissionDate();

    const [rawHour, minutes] = hour.split(':');
    const [day, mont, year] = date.split('/');
    const formatHour = `${rawHour}${minutes}00`
    const formatDate = `${year}${mont}${day}`

    return `${formatDate}${formatHour}`
  }

  parseACHOperationsResponseByProof(items: any[], movement: string) {
    if (movement === CACH_TYPE_MOVEMENTS.DEBIT) {
      const debitMovementItems = items as ICACHDebitRegisters[];
      return debitMovementItems.map(item => ({
        operation: item.operation,
        transfer: item.operationType,
        senderBeneficiary: item.beneficiary,
        issuingDestination: item.receivingBank,
        status: item.status,
        currency: item?.currency,
        amount: item?.amount,
        dateTime: item.date,
      }));
    }

    const credits: Array<ICOResponseAccount> = items;

    return credits.map(item => ({
      ...item,
      dateTime: this.formatService.getFormatDateTime(item?.creationDate).standard,
    }));
  }

  injectMask(currency: string, controlName: string, attributes: any[]) {
    const currencyMask = this.getAmountMask(currency ?? environment.currency);

    return attributes.map(attr => {
      if (attr.controlName === controlName) {
        return {
          ...attr,
          imaskOptions: currencyMask,
          placeholder: `${currency} 0.00`,
        }
      }

      return attr;
    })

  }

  findSourceAccount<T>(accountNumber: string, listAccountToSearch: T[], keyToSearch?: string): T | undefined {
    const DEFAULT_KEY_TO_SEARCH = 'account';
    return listAccountToSearch.find((account: T) => account[keyToSearch ?? DEFAULT_KEY_TO_SEARCH] === accountNumber);
  }

  buildMaskToEmailField() {
    return {
      mask: String,
      prepare: function (str) {
        return str.toLowerCase();
      },
    }
  }

  buildNumberMask() {
    return {
      mask: /^\d+$/
    }
  }

  buildEmailMask() {
    return /\w+([.]\w+)*@\w+([.]\w+)*[.][a-zA-Z]{2,5}/
  }

  buildEmailRegexToMask() {
    return '[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}';
  }

  formatAmountWithCurrency(amount: string, currency?: string) {
    const currencyToUse = currency ?? environment.currency;
    return `${currencyToUse} ${this.formatAmount(amount)}`
  }

  parseSourceAccountToVoucher(sourceAccount: IAccount) {
    const sourceAccountProductAcronym = this.getProductAcronym(sourceAccount.product);
    return `${sourceAccountProductAcronym} - ${sourceAccount.account}`;
  }

  parseCustomNumber(value: number | string) {
    const n = Number(value);
    return isNaN(n) ? 0 : n;
  }

  parseNumberAsFloat(value: number | string) {
    const n = parseFloat(value as string);
    return isNaN(n) ? 0 : n;
  }

  parseNumberAsFloatFixed(value: number | string) {
    const n = parseFloat(value as string);
    return isNaN(n) ? 0 : n.toFixed(2);
  }


  removeLeftPadZeros(str: string) {
    if (!str) {
      return '';
    }

    return str.replace(/^0+/, '');
  }

  showPulseLoader() {
    this.spinner.show().then(() => {});
  }

  hidePulseLoader() {
    this.spinner.hide().then(() => {
    });
  }

  showLoader() {
    this.spinner.show('main-spinner').then(() => {
    });
  }

  hideLoader() {
    this.spinner.hide('main-spinner').then(() => {
    });
  }

  valueIsIncludeInBlackList(blackList: string[], urlToValid: string) {
    return blackList.some((url) => urlToValid.indexOf(url) > -1);
  }

  substr(str: string, start: number, length: number) {
    const init = start < 0 ? 0 : start;
    const adjustedLength = length === undefined ? str.length - init : length;
    const positiveLength = adjustedLength < 0 ? 0 : adjustedLength;
    const end = init + positiveLength;

    return str.substring(init, end);
  }


  validateCurrentDate(date: NgbDate) {
    if (!date) return false;

    const now = moment();
    const currentDate = moment({
      year: date.year,
      month: date.month - 1,
      day: date.day,
      hour: +moment().format('H'),
      minute: +moment().format('m') + 1,
    });


    moment({
      year: date.year,
      month: date.month - 1,
      day: date.day,
      hour: +moment().format('H'),
      minute: +moment().format('m'),
    });

    return currentDate && (currentDate < now);
  }

  parseAmountStringToNumber(amount: string | number) {
    if (!amount) {
      return 0
    }

    const amountValue = String(amount).replace(/,/g, '');
    return Number(amountValue);
  }

  getTableOption(menuLicenses: string[], options: string[]): string[] {
    return options.filter(option => menuLicenses.includes(option));
  }


  getLicensesTransactions(optionMenuLicenses: IMenuLicensesResponse): string[] {
    return Object.entries(optionMenuLicenses).reduce((menuOptions: string[], [key, value]) => {
      if (value && MENU_OPTION_LICENSES_MAP[key]) {
        menuOptions.push(MENU_OPTION_LICENSES_MAP[key]);
      }
      return menuOptions;
    }, []);
  }

  isTransactionAvailable(menuLicenses: string[], option: string): boolean {
    return menuLicenses.includes(option);
  }

  separatorValidation(value1, value2): string {
    if (value1 && value2) {
      return '/';
    } else {
      return '';
    }
  }

  parsePercent(value: string): string {
    const valueNumber = Number(value);
    const stringValue = String(valueNumber);

    if (stringValue[stringValue.length - 2] === '.') {
      return `${valueNumber}0%`;
    }

    return value ? `${Number(value)}%` : '';
  }

  getProfile() {
    return environment.profile;
  }

  getLoader(message?: string): string {
    return this.loaderBuilder.getLoader(message);
  }

  getLoaderSimple(): string {
    return this.loaderBuilder.getLoaderSimple();
  }

  hyphenationValidation(value1, value2): string {
    return value1 && value2 ? '-' : '';
  }

  getAmountMask(currency?: string, min: number = 0.01) {
    return {
      mask: `${currency} num`,
      blocks: {
        num: {
          mask: Number,
          thousandsSeparator: ',',
          scale: 2,
          signed: false,
          radix: '.',
          padFractionalZeros: true,
          min,
          max: 99999999999.99,
        },
      },
    };
  }

  getAmountMaskAchUni(currency?: string, min: number = 0.00) {
    return {
      mask: `${currency} num`,
      blocks: {
        num: {
          mask: Number,
          thousandsSeparator: ',',
          scale: 2,
          signed: false,
          radix: '.',
          padFractionalZeros: true,
          min,
          max: 99999999999.99,
        },
      },
    };
  }

  scrollToTop(): void {
    !window.requestAnimationFrame ? window.scrollTo(0, 0) : this.scrollUtility(0, this.scrollDuration);
  }

  private scrollUtility(final: number, duration: number) {
    const start = window.scrollY || document.documentElement.scrollTop;
    let currentTime = 0;

    const animatedScroll = (timestamp: number) => {
      if (!currentTime) {
        currentTime = timestamp;
      }

      let progress = timestamp - currentTime;

      if (progress > duration) {
        progress = duration;
      }

      const val = this.helperToCalcYAxis(progress, start, final - start, duration);

      window.scrollTo(0, val);

      if (progress < duration) {
        window.requestAnimationFrame(animatedScroll);
      }

    };

    window.requestAnimationFrame(animatedScroll);
  }


  private helperToCalcYAxis(t: number, b: number, c: number, d: number) {
    t /= d / 2;
    if (t < 1) {
      return (c / 2) * t * t + b;
    }
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  getUserName(): string {
    return this.storageService.getItem('userName') ?? 'not_found';
  }

  getProfileHeadBand(): string {
    return equivalenciesTranslation[environment.profile].PROFILE_HEAD_BAND ?? 'not_found';
  }

  getLabelProductSimple(code: number): string{
    let name;
    for (const element of equivalenciesSimpleProduct[this.profile]) {
      if (element.code === code) {
        name = element.name;
        break;
      }
    }
    return name;
  }

  getLabelProduct(code: number): string {
    const label = this.getProductKeyTranslation(code);
    return this.translate.instant(label);
  }

  getClientTypeName(clientType: 'j' | 'n') {
    const mapped = {
      ['j']: this.translate.instant('tm-ach-uni:client-type-j'),
      ['n']: this.translate.instant('tm-ach-uni:client-type-n'),
    }

    return (mapped[clientType] ?? clientType).toUpperCase();
  }

  getProductAcronym(code: number): string {
    const label = this.getProductKeyTranslation(code);
    return this.translate.instant(`acronym_${label}`);
  }

  getLabelTypeClient(typeClient: string) {
    return this.translate.instant(`label_client_type_${typeClient.toLowerCase()}`);
  }

  getProductKeyTranslation(code: number) {
    let name;
    for (const element of equivalenciesProduct) {
      if (element.code === code) {
        name = element.name;
        break;
      }
    }

    return equivalenciesTranslation[environment.profile][name ?? ''] ?? String(code);
  }

  getProductNameFromEquivalence(product: string) {
    const hasProduct = Product[product ?? 0];

    if (!hasProduct) return product

    return this.getLabelProduct(Number(Product[product])).toUpperCase()
  }

  getProductKeyName(code: number) {
    let name: string = '';
    for (const element of equivalenciesProduct) {
      if (element.code === code) {
        name = element.name;
        break;
      }
    }

    return name.toLowerCase() ?? 'not_found';
  }

  getProductName(code: number): string {
    for (const element of equivalenciesProduct) {
      if (element.code === code) {
        return element.name;
      }
    }
    return 'no_found';
  }

  getLabelCurrency(code: string): string {
    return this.translate.instant(`label_${code}`);
  }

  getISOCurrency(currency: string): string {
    for (const i in equivalenciesCurrency) {

      if (equivalenciesCurrency[i].currency === currency) {
        return equivalenciesCurrency[i].ISOCurrency;
      }
    }

    return 'no_found';
  }

  getLabelStatus(code: string): string {
    return this.translate.instant(`label_statu_${code}`) ?? code;
  }

  geCurrencSymbol(code): string {
    return this.translate.instant(code);
  }


  getCurrencySymbolToIso(code: string) {
    return this.translate.instant(`currency_iso_${(code ?? 'undefined').toLowerCase()}`);
  }

  getTokenType() {
    const currentToken = this.storageService.getItem('currentToken');
    if (!currentToken) {
      return null;
    }

    const jwt: string = JSON.parse(currentToken)[`access_token`];
    const decodedJwt = this.base64.decoded(jwt.split('.')[1]);
    return JSON.parse(decodedJwt)[`typeToken`];
  }

  searchByMultipleAttributes<T = any>(listWhereSearch: T[], query: string, propertiesToSearch: string[]) {
    if (!Array.isArray(listWhereSearch) || !listWhereSearch) {
      return [];
    }

    return listWhereSearch.filter((item) => {
      return propertiesToSearch.some((property) => {
        return String(item[property]).toLowerCase().includes((query ?? '').toLowerCase());
      });
    });
  }


  removeLayoutSelect(layout: ILayout, controlName: string) {
    layout.attributes.forEach((item) => {
      if (item.controlName === controlName) {
        item.layoutSelect = [];
      }
    });
  }

  alertScheduleServiceLayout(errorMessage?: string) {
    const iconAlertAttribute = new AlertAttributeBuilder()
      .label('banca-regional-warning')
      .build();

    const titleAlertAttribute = new AlertAttributeBuilder()
      .label('alert-title')
      .build();

    const messageAlertAttribute = new AlertAttributeBuilder()
      .label(errorMessage ?? 'label:no_schedule')
      .build();

    const nextButtonAlertAttribute = new AlertAttributeBuilder()
      .label('schedule-alert-accept')
      .build();

    return new AlertBuilder()
      .icon(iconAlertAttribute)
      .title(titleAlertAttribute)
      .message(messageAlertAttribute)
      .nextButtonMessage(nextButtonAlertAttribute)
      .build();
  }

  resetStorage() {
    this.persistStepStateService.sendParameters({
      state: null,
      b2bRequestState: null,
      b2bPaymentState: null,
      stepState: null,
      selectedState: null,
      navigateStateParameters: null,
    });
  }

  fillStrings(context: string, fillValue: string, maxLength: number): string {
    let filledValue = '';
    let diff = 0;
    try {
      if (context.length <= maxLength) {
        diff = maxLength - context.length;
        filledValue = `${context}${fillValue.repeat(diff >= 0 ? diff : 0)}`;
      } else {
        filledValue = context.slice(0, maxLength >= 0 ? maxLength : 0);
      }
    } catch (e) {
      console.log(e);
    }
    return filledValue;
  }

  getUrlTransferOwn(): string {
    return this.findServiceCode.getUrl(EOwnTransferUrlNavigationCollection.HOME);
  }

  getUrlTransferThird(): string {
    const mapTransferThirdUrl = {
      [EProfile.HONDURAS]: EThirdTransferUrlNavigationCollection.HOME,
      [EProfile.SALVADOR]: EThirdTransferUrlNavigationCollection.HOMESV,
    }

    return this.findServiceCode.getUrl(mapTransferThirdUrl[this.profile] || EThirdTransferUrlNavigationCollection.HOME);
  }

  getUrlTransferAch(): string {
    const urlMapped = {
      [EProfile.HONDURAS]: this.findServiceCode.getUrl(EACHTransferUrlNavigationCollection.HOME),
      [EProfile.PANAMA]: this.findServiceCode.getUrl(EACHTransferUrlNavigationCollection.HOME),
      [EProfile.SALVADOR]: 'transfer/ach-uni',
    }
    return this.findServiceCode.getUrl(urlMapped[this.profile]);
  }

  filledSideStrings(context: string, fillValue: string, maxLength: number, side: ESides = ESides.RIGHT): string {
    let filledValue = '';
    let diff = 0;
    try {
      if (context.length <= maxLength) {
        diff = maxLength - context.length;
        const valueToRepeat = diff >= 0 ? diff : 0;
        filledValue = side === ESides.RIGHT ? `${context}${fillValue.repeat(valueToRepeat)}` : `${fillValue.repeat(valueToRepeat)}${context}`;
      } else {
        filledValue = context.slice(0, maxLength >= 0 ? maxLength : 0);
      }
    } catch (e) {
    }
    return filledValue;
  }

  deleteDecimalDots(value: string) {

    if (value.includes('.')) {
      return value.replace('.', '');
    } else {
      return value.concat('00');
    }

  }

  getDate(){
    return moment().format('DDMMYYYYHHmmss');
  }

  getDateWithoutHour(){
    return moment().format('MM/DD/YYYY');
  }

  getClientTypeKeyFromValue(value: string) {
    const clientTypeMapped = {
      'NATURAL': 'N',
      'LEGAL': 'J'
    }

    return clientTypeMapped[value];
  }

  getClientType() {
    return this.persistStepStateService.getParameter('clientType');
  }

  testDownLoadCSVFileToUpload(csvData: string) {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `TEST_${Date.now()}`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
