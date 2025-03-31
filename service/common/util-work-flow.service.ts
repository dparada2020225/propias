import {
  AdfFormatService,
  AlertAttributeBuilder,
  AlertBuilder,
  DataLayoutSelectBuilder,
  HeadBandBuilder,
  IAlert,
  IDataLayoutSelect,
  IHeadBandAttribute,
  IImagesConfirmationModal,
  ImageConfirmationModalBuilder,
  IObjectFormat
} from '@adf/components';
import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {
  IHeadBandLayout,
  IHeadBandLayoutConfirm,
  IUserDataModalPdf,
  IUserDataTransaction,
  IUtilModalParameter
} from '../../models/util-work-flow.interface';
import {UtilService} from './util.service';
import {SmartidNavigationService, StorageService} from '@adf/security';
import {EProfile} from 'src/app/enums/profile.enum';
import {IAccount} from '../../models/account.inteface';
import {environment} from '../../../environments/environment';
import {EVersionHandler} from '../../enums/version-handler.enum';

@Injectable({
  providedIn: 'root'
})
export class UtilWorkFlowService {

  constructor(
    private translate: TranslateService,
    private util: UtilService,
    private storage: StorageService,
    private smartIdNavigationService: SmartidNavigationService,
    private adfFormatService: AdfFormatService,
  ) {
  }


  getUserDataTransaction(userData: IUserDataTransaction): string[] {
    const separatorTypeAlias = this.util.hyphenationValidation(userData?.product, userData?.alias);
    const separatorAliasAccount = this.util.separatorValidation(separatorTypeAlias !== '', userData?.account);
    if (environment.profile === EProfile.SALVADOR || EProfile.PANAMA) {
      return [
        `
      ${this.util.getProductAcronym(userData?.product ?? 0)}
      ${separatorTypeAlias}
      ${userData?.currency}
      ${userData?.alias ?? ''}`,
        `${userData?.name ?? ''}`,
      ];
    }

    return [
      `
      ${userData?.alias ?? ''}
      ${separatorAliasAccount}
      ${userData?.account ?? ''}`,
      `${userData?.name ?? ''}`,
    ];
  }

  getUserDataTransactionAchUniAccountInfo(userData: IUserDataTransaction): string[] {
    const separatorTypeAlias = this.util.hyphenationValidation(userData?.product, userData?.alias);
    return [
      `${this.util.getProductAcronym(userData?.product ?? 0)}
      ${separatorTypeAlias}
      ${userData?.account ?? ''}`
    ];
  }

  getUserDataTransactionAchUniNameInfo(userData: IUserDataTransaction): string[] {
    const separatorTypeAlias = this.util.hyphenationValidation(userData?.product, userData?.alias);
    const separatorAliasAccount = this.util.separatorValidation(separatorTypeAlias !== '', userData?.account);
    if (environment.profile === EProfile.SALVADOR || EProfile.PANAMA) {
      return [
        `${userData?.name ?? ''}`,
      ];
    }

    return [
      `${userData?.name ?? ''}`,
    ];
  }

  getUserDataTransactionAchUniAccountCreditInfo(userData: IUserDataTransaction): string[] {
    const separatorTypeAlias = this.util.hyphenationValidation(userData?.product, userData?.alias);
    const separatorAliasAccount = this.util.separatorValidation(separatorTypeAlias !== '', userData?.account);
    if (environment.profile === EProfile.SALVADOR || EProfile.PANAMA) {
      return [
        `${userData?.account ?? ''}`,
      ];
    }

    return [
      `${userData?.account ?? ''}`,
    ];
  }

  getUserDataTransactionAchUniTypeAccountCreditInfo(userData: IUserDataTransaction): string[] {
    const separatorTypeAlias = this.util.hyphenationValidation(userData?.product, userData?.alias);
    const separatorAliasAccount = this.util.separatorValidation(separatorTypeAlias !== '', userData?.account);
    if (environment.profile === EProfile.SALVADOR || EProfile.PANAMA) {
      return [
        `${userData?.account ?? ''}`,
      ];
    }

    return [
      `${userData?.account ?? ''}`,
    ];
  }

  getUserDataModalPdf(userData: IUserDataModalPdf): string {
    return `${userData?.account ?? ''} ${this.util.separatorValidation(userData?.account, userData?.name)} ${userData?.name ?? ''}`;
  }

  getHeadBandLayout(userData: IHeadBandLayout): IHeadBandAttribute[] {
    switch (environment.profile) {
      case EProfile.HONDURAS:
        return this.buildHedBandAttributes(userData);
      case EProfile.SALVADOR:
        return this.buildHeadBandAttributesForBISVProfile(userData);
      case EProfile.PANAMA:
        return this.buildHeadBandAttributesForBipaProfile(userData);

      default:
        return this.buildHedBandAttributes(userData);
    }
  }

  private buildHeadBandAttributesForBipaProfile(userData: IHeadBandLayout) {
    const attributes: IHeadBandAttribute[] = [];

    const {date} = userData;
    const currentDate = date?.standard + ' ' + date?.hour;
    const reference = userData?.reference;

    const attributeDate = new HeadBandBuilder()
      .value(currentDate)
      .class('date')
      .build();

    const attributeUser = new HeadBandBuilder()
      .label(this.translate.instant('copy_generate_for'))
      .value(`${userData.numberAccount} - ${this.util.getUserName()}`)
      .class('user-name')
      .build();

    const referenceAttribute = new HeadBandBuilder()
      .class('reference')
      .value(`BI-MON-${reference}`)
      .build();

    attributes.push(attributeDate);
    attributes.push(attributeUser);
    attributes.push(referenceAttribute);

    return attributes;
  }

  private buildHeadBandAttributesForBISVProfile(userData: IHeadBandLayout) {
    const attributes: IHeadBandAttribute[] = [];

    const {date} = userData;
    const currentDate = date?.standard + ' ' + date?.hour;

    const attributeDate = new HeadBandBuilder()
      .label(this.translate.instant('label.term-deposit.issue-date'))
      .value(currentDate)
      .class('date')
      .build();

    const attributeUser = new HeadBandBuilder()
      .label(this.translate.instant('label.statements.copy-by'))
      .value(this.util.getUserName())
      .class('user-name')
      .build();

    const attributeBankName = new HeadBandBuilder()
      .value('BEL/El Salvador')
      .class('bank')
      .build();

    attributes.push(attributeDate);
    attributes.push(attributeUser);
    attributes.push(attributeBankName);

    return attributes;
  }

  private buildHedBandAttributes(userData: IHeadBandLayout) {
    const attributes: IHeadBandAttribute[] = [];

    const userName = this.util.getUserName();
    const dateTime = userData?.date;
    const reference = userData?.reference;

    const userNameBand = new HeadBandBuilder()
      .class('user-name')
      .value(`${userName}`)
      .build();

    const dateAttribute = new HeadBandBuilder()
      .class('date')
      .value(`${dateTime?.date}`)
      .build();

    const hourAttribute = new HeadBandBuilder()
      .class('hour')
      .value(`${dateTime?.hour}`)
      .build();

    const referenceAttribute = new HeadBandBuilder()
      .class('reference')
      .value(`${this.translate.instant('authorization')}:${reference}`)
      .build();

    attributes.push(userNameBand);
    attributes.push(dateAttribute);
    attributes.push(hourAttribute);
    attributes.push(referenceAttribute);

    return attributes;
  }

  getHeadBandLayoutConfirmUni(userData: IHeadBandLayoutConfirm): IHeadBandAttribute[] {
    const profile = this.util.getProfileHeadBand();
    const dateTime = userData?.date;
    const reference = userData?.reference;
    const userName = this.util.getUserName();
    const headBandAttributes: IHeadBandAttribute[] = [];
    let date = dateTime?.standard + ' ' + this.formatTime(dateTime?.object);

    switch (environment.profile) {
      case EProfile.HONDURAS:
        const attributeBanking = new HeadBandBuilder().value(profile ?? '').build();
        const attributeDate = new HeadBandBuilder().value(dateTime?.date ?? '').build();
        const attributeHour = new HeadBandBuilder().value(dateTime?.hour ?? '').build();
        const attributeReference = new HeadBandBuilder()
          .label('reference_no')
          .class('row-view')
          .value(reference ?? '')
          .build();
        headBandAttributes.push(attributeBanking);
        headBandAttributes.push(attributeDate);
        headBandAttributes.push(attributeHour);
        headBandAttributes.push(attributeReference);
        break;
      case EProfile.SALVADOR:
        const attributeDateSv = new HeadBandBuilder()
          .label(this.translate.instant('label.term-deposit.issue-date'))
          .value(date ?? '')
          .build();
        const atributeUser = new HeadBandBuilder()
          .label(this.translate.instant('label.statements.copy-by'))
          .value(userName ?? '')
          .build();
        const attributeBankingSv = new HeadBandBuilder().value('BEL/El Salvador').build();
        const attributeReferenceSv = new HeadBandBuilder()
          .label(this.translate.instant("label.reference-sv"))
          .class('row-view')
          .value(reference ?? '')
          .build();
        headBandAttributes.push(attributeDateSv);
        headBandAttributes.push(atributeUser);
        headBandAttributes.push(attributeBankingSv);
        headBandAttributes.push(attributeReferenceSv);
        break;
      case EProfile.PANAMA:

        const attributeDatePA = new HeadBandBuilder()
          .value(date ?? '')
          .build();
        const atributeUserPA = new HeadBandBuilder()
          .label(this.translate.instant('copy_generate_for'))
          .value(`${userData.numberAccount} - ${userName}` ?? '')
          .build();
        const attributeReferencePA = new HeadBandBuilder()
          .class('row-view')
          .value(`BI-MON-${reference}` ?? '')
          .build();
        headBandAttributes.push(attributeDatePA);
        headBandAttributes.push(atributeUserPA);
        headBandAttributes.push(attributeReferencePA);
        break;

    }
    return headBandAttributes;
  }

  formatTime(datetime: IObjectFormat): string {
    let { hour, minute, second } = datetime;
    let period = 'a.m.';

    if (hour === 0) {
      hour = 12; // Medianoche en formato de 12 horas
    } else if (hour >= 12) {
      period = 'p.m.';
      if (hour > 12) {
        hour -= 12; // Convertir de 24 horas a 12 horas
      }
    }

    // Asegurar que los minutos y segundos tengan dos dígitos
    const minuteStr = minute < 10 ? `0${minute}` : `${minute}`;
    const secondStr = second < 10 ? `0${second}` : `${second}`;

    return `${datetime.hour}:${minuteStr}:${secondStr} ${period}`;
  }

  getHeadBandLayoutConfirm(userData: IHeadBandLayoutConfirm): IHeadBandAttribute[] {
    const profile = this.util.getProfileHeadBand();
    const dateTime = userData?.date;
    const reference = userData?.reference;
    const userName = this.util.getUserName();
    const headBandAttributes: IHeadBandAttribute[] = [];
    let date = dateTime?.standard + ' ' + dateTime?.hour;
    switch (environment.profile) {
      case EProfile.HONDURAS:
        const attributeBanking = new HeadBandBuilder().value(profile ?? '').build();
        const attributeDate = new HeadBandBuilder().value(dateTime?.date ?? '').build();
        const attributeHour = new HeadBandBuilder().value(dateTime?.hour ?? '').build();
        const attributeReference = new HeadBandBuilder()
          .label('reference_no')
          .class('row-view')
          .value(reference ?? '')
          .build();
        headBandAttributes.push(attributeBanking);
        headBandAttributes.push(attributeDate);
        headBandAttributes.push(attributeHour);
        headBandAttributes.push(attributeReference);
        break;
      case EProfile.SALVADOR:
        const attributeDateSv = new HeadBandBuilder()
          .label(this.translate.instant('label.term-deposit.issue-date'))
          .value(date ?? '')
          .build();
        const atributeUser = new HeadBandBuilder()
          .label(this.translate.instant('label.statements.copy-by'))
          .value(userName ?? '')
          .build();
        const attributeBankingSv = new HeadBandBuilder().value('BEL/El Salvador').build();
        const attributeReferenceSv = new HeadBandBuilder()
          .label(this.translate.instant("label.reference-sv"))
          .class('row-view')
          .value(reference ?? '')
          .build();
        headBandAttributes.push(attributeDateSv);
        headBandAttributes.push(atributeUser);
        headBandAttributes.push(attributeBankingSv);
        headBandAttributes.push(attributeReferenceSv);
        break;
      case EProfile.PANAMA:

        const attributeDatePA = new HeadBandBuilder()
          .value(date ?? '')
          .build();
        const atributeUserPA = new HeadBandBuilder()
          .label(this.translate.instant('copy_generate_for'))
          .value(`${userData.numberAccount} - ${userName}` ?? '')
          .build();
        const attributeReferencePA = new HeadBandBuilder()
          .class('row-view')
          .value(`BI-MON-${reference}` ?? '')
          .build();
        headBandAttributes.push(attributeDatePA);
        headBandAttributes.push(atributeUserPA);
        headBandAttributes.push(attributeReferencePA);
        break;

    }

    console.log('headBandAttributes', headBandAttributes)
    return headBandAttributes;
  }

  handleMarkSecureNavigation(url: string) {
    const parameters = JSON.parse(this.storage.getItem('securityParameters'));
    const isSmartIdEnabled = parameters['configs']['smart-id']['enabled'];
    const trackingEnabled = JSON.parse(this.storage.getItem('trackingEnabled'));

    if (isSmartIdEnabled && trackingEnabled) {
      const indexOcurrence = url.indexOf('?') === -1 ? url.length : url.indexOf('?');
      const isEmbeddedOb = url.includes('embedded-ob');
      const action = isEmbeddedOb ? url.substring(indexOcurrence + 1, url.length) : url.substring(0, indexOcurrence);
      this.smartIdNavigationService.markNavigation(action);
    }

    if (!trackingEnabled && url === '/home') {
      this.storage.addItem('trackingEnabled', 'true');
    }

  }

  buildDeleteFavoriteAlert(): IAlert {
    const iconAlertAttribute = new AlertAttributeBuilder()
      .label('banca-regional-warning')
      .build();

    const titleAlertAttribute = new AlertAttributeBuilder()
      .label('delete')
      .build();

    const messageAlertAttribute = new AlertAttributeBuilder()
      .label('delete_message_modal_favorite')
      .build();

    const nextButtonAlertAttribute = new AlertAttributeBuilder()
      .label('agree')
      .build();

    const cancelButtonAlertAttribute = new AlertAttributeBuilder()
      .label('cancel')
      .build();

    return new AlertBuilder()
      .icon(iconAlertAttribute)
      .title(titleAlertAttribute)
      .message(messageAlertAttribute)
      .nextButtonMessage(nextButtonAlertAttribute)
      .cancelButtonMessage(cancelButtonAlertAttribute)
      .build();
  }

  buildDeleteAchAlert(icon?: string, message?: string, nextButtonMessage?: string): IAlert {
    const iconAlertAttribute = new AlertAttributeBuilder()
      .label(icon ?? 'banca-regional-warning')
      .build();

    const titleAlertAttribute = new AlertAttributeBuilder()
      .label('delete')
      .build();

    const messageAlertAttribute = new AlertAttributeBuilder()
      .label(message ?? 'delete_message_modal')
      .build();

    const nextButtonAlertAttribute = new AlertAttributeBuilder()
      .label(nextButtonMessage ?? 'agree')
      .build();

    const cancelButtonAlertAttribute = new AlertAttributeBuilder()
      .label('cancel')
      .build();

    return new AlertBuilder()
      .icon(iconAlertAttribute)
      .title(titleAlertAttribute)
      .message(messageAlertAttribute)
      .nextButtonMessage(nextButtonAlertAttribute)
      .cancelButtonMessage(cancelButtonAlertAttribute)
      .build();
  }

  buildAlertToUpdate(message?: string): IAlert {
    const iconAlertAttribute = new AlertAttributeBuilder()
      .label('banca-regional-warning')
      .build();

    const titleAlertAttribute = new AlertAttributeBuilder()
      .label('confirmation')
      .build();

    const messageAlertAttribute = new AlertAttributeBuilder()
      .label(message ?? 'update_message_modal')
      .build();

    const nextButtonAlertAttribute = new AlertAttributeBuilder()
      .label('agree')
      .build();

    const cancelButtonAlertAttribute = new AlertAttributeBuilder()
      .label('cancel')
      .build();

    return new AlertBuilder()
      .icon(iconAlertAttribute)
      .title(titleAlertAttribute)
      .message(messageAlertAttribute)
      .nextButtonMessage(nextButtonAlertAttribute)
      .cancelButtonMessage(cancelButtonAlertAttribute)
      .build();
  }

  buildAccountResumeAttributeForSelectAccounts(account: IAccount): IDataLayoutSelect[] {
    const accountDebitSelectedOptions: IDataLayoutSelect[] = [];

    const accountNameOption = new DataLayoutSelectBuilder()
    .label('account-name')
    .value(`${account?.name}`)
    .build();

  const accountAvailableOption = new DataLayoutSelectBuilder()
    .label('available')
    .value(`${this.util.geCurrencSymbol(account?.currency)} ${this.adfFormatService.formatAmount(account?.availableAmount)}`)
    .build();

  accountDebitSelectedOptions.push(accountNameOption);
  accountDebitSelectedOptions.push(accountAvailableOption);
    return accountDebitSelectedOptions;
  }

  buildImagesToModal(parameters?: IUtilModalParameter): IImagesConfirmationModal[] {
    const {firstImage, secondImage} = parameters ?? {};
    const imageList: IImagesConfirmationModal[] = [];

    const secondaryImage = new ImageConfirmationModalBuilder()
      .class('secondary_logo')
      .label('secondary logo')
      .url(`assets/images/logos/${environment.profile}_logo_${EVersionHandler.ASSETS}.png`)
      .build();

    const mainImage = new ImageConfirmationModalBuilder()
      .class('main_logo')
      .label('primary logo')
      .url(`assets/images/logos/${environment.profile}_bp_logo_${EVersionHandler.ASSETS}.png`)
      .build();

    imageList.push(secondImage ?? secondaryImage);
    imageList.push(firstImage ?? mainImage);

    return imageList;
  }

  rebuildAmount(amount: string) {
    // * Verify if the current amount includes a dot. This means contains a decimal number;
    const hasIncludeDecimal = amount.split('').includes('.');

    /**
     * * From form only allow entering a single decimal.
     * * Example 305.5 = 350.50
     * * for this reason verify if amount contains decimal verify if contain only one
     * * add 0 to the right side.
     * Otherwise, returned an empty value
     */
    const addLastDecimal = amount.split('.')[1]?.length === 1 ? '0' : '';

    /**
     * * Verify in hasIncludeDecimal is true:
     * * Return number with decimals without a dot.
     * * otherwise is false returned current amount accompanied wit two ceros (decimales)
     */
    const finalAmount = hasIncludeDecimal
      ? `${amount.split('.').join('').replace(/,/g, '')}${addLastDecimal}`
      : `${amount}00`;

    // * Finally, is based con finalAmount calc number of ceros to accompany amount for request attribute
    let zeros = '';
    for (let i = 0; i < (13 - finalAmount.length); i++) {
      zeros = zeros + '0';
    }
    return `${zeros}${finalAmount}`;
  }

}
