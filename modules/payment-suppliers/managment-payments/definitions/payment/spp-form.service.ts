import {Injectable} from '@angular/core';
import {
  AdfFormatService,
  AttributeReadingBuilder,
  ConfirmationModalBuilder,
  DataLayoutSelectBuilder,
  DataReadingBuilder,
  FormValidationsBuilder,
  IDataLayoutSelect,
  IGroupAttributes,
  IHeadBandAttribute,
  ILayout,
  ILayoutAttribute,
  LayoutAttributeBuilder,
  LayoutBuilder,
  LayoutType,
} from '@adf/components';
import { SpFormAttributes, SPFormParameters, SpFormVoucherAttributes } from '../../interfaces/ps-form.interface';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { IOwnAccount } from 'src/app/modules/transfer/modules/transfer-own/interfaces/own-transfer.interface';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { IHeadBandLayout } from 'src/app/models/util-work-flow.interface';
import { UtilService } from 'src/app/service/common/util.service';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SppFormService {

  constructor(
    private adfFormatService: AdfFormatService,
    private utilWorkFlow: UtilWorkFlowService,
    private utils: UtilService,
    private translate: TranslateService
  ) { }

  buildFormLayout(form: SPFormParameters): ILayout {
    const { credits, amount, date } = form
    const fecha = date ? new Date(date) : new Date();

    const datePipe = new DatePipe('en-US');
    const fechaFormateada = datePipe.transform(fecha ?? new Date(), 'dd/MM/yyyy');
    const dateParsed = fechaFormateada;

    const layoutDonationAttributes: ILayoutAttribute[] = [];

    const attributeDate = new LayoutAttributeBuilder()
      .label('ps:label_date_file_load')
      .placeholder(`${dateParsed}`)
      .class('grid-item-md-6 order-1')
      .controlName(SpFormAttributes.DATE)
      .layoutType(LayoutType.LABEL)
      .build();

    const attributeCredits = new LayoutAttributeBuilder()
      .label('ps:label_credits_load')
      .placeholder(`${credits}`)
      .class('grid-item-md-6 order-3 order-md-2 order-lg-2')
      .controlName(SpFormAttributes.CREDITS)
      .layoutType(LayoutType.LABEL)
      .build();

    const attributeAmount = new LayoutAttributeBuilder()
      .label('ps:label_amount_load')
      .placeholder(`${this.adfFormatService.formatAmount(amount)}`)
      .class('grid-item-md-6 order-2 order-md-3 order-lg-3')
      .controlName(SpFormAttributes.AMOUNT)
      .layoutType(LayoutType.LABEL)
      .build();

    const validationAmount = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeSourceAccount = new LayoutAttributeBuilder()
      .label('ps:root-account')
      .class('source-account_selector order-4 order-md-4 order-lg-4')
      .placeholder(`select-account-debit`)
      .controlName(SpFormAttributes.SOURCE_ACCOUNT)
      .layoutType(LayoutType.SELECT)
      .formValidations(validationAmount)
      .build();

    layoutDonationAttributes.push(attributeDate);
    layoutDonationAttributes.push(attributeCredits);
    layoutDonationAttributes.push(attributeAmount);
    layoutDonationAttributes.push(attributeSourceAccount);

    return new LayoutBuilder()
      .title(form.title)
      .subtitle(form.subtitle ?? '')
      .attributes(layoutDonationAttributes)
      .build();
  }

  buildFormLayoutVoucher(form): ILayout {
    const { credits, amount, date, account } = form
    const fecha = new Date(date);

    const datePipe = new DatePipe('en-US');
    const fechaFormateada = datePipe.transform(fecha ?? new Date(), 'dd/MM/yyyy');
    const dateParsed = fechaFormateada;

    const layoutDonationAttributes: ILayoutAttribute[] = [];
    const acronym = this.utils.getProductAcronym(account.product);


    const attributeDate = new LayoutAttributeBuilder()
      .label('ps:label_date_file_load')
      .placeholder(`${dateParsed}`)
      .class('grid-item-md-6')
      .controlName(SpFormVoucherAttributes.DATE)
      .layoutType(LayoutType.LABEL)
      .build();

    const attributeCredits = new LayoutAttributeBuilder()
      .label('ps:label_credits_load')
      .placeholder(`${credits}`)
      .class('grid-item-md-6')
      .controlName(SpFormVoucherAttributes.CREDITS)
      .layoutType(LayoutType.LABEL)
      .build();

    const attributeAmount = new LayoutAttributeBuilder()
      .label('ps:label_amount_load')
      .placeholder(`${this.adfFormatService.formatAmount(+amount)}`)
      .class('grid-item-md-6')
      .controlName(SpFormVoucherAttributes.AMOUNT)
      .layoutType(LayoutType.LABEL)
      .build();


      const attributeNumberAccount = new LayoutAttributeBuilder()
      .label('ps:root-account')
      .placeholder(`${acronym} - ${account.account}`)
      .class('grid-item-md-6')
      .controlName(SpFormVoucherAttributes.ACCOUNT_NUMBER)
      .layoutType(LayoutType.LABEL)
      .build();

      const attributeNombreAccount = new LayoutAttributeBuilder()
      .label('ps:account-name-label')
      .placeholder(`${account.name}`)
      .class('grid-item-md-6')
      .controlName(SpFormVoucherAttributes.ACCOUNT_NAME)
      .layoutType(LayoutType.LABEL)
      .build();

    layoutDonationAttributes.push(attributeDate);
    layoutDonationAttributes.push(attributeCredits);
    layoutDonationAttributes.push(attributeAmount);
    layoutDonationAttributes.push(attributeNumberAccount);
    layoutDonationAttributes.push(attributeNombreAccount);


    return new LayoutBuilder()
      .title(form.title)
      .attributes(layoutDonationAttributes)
      .build();
  }

  buildFormLayoutVoucherPrint(form) {
    const { credits, amount, date, account, reference, title } = form
    const fecha = new Date(date);

    const listGroup: any[] = [];
    const imageList = this.utilWorkFlow.buildImagesToModal();
    const groupOriginAccount: IGroupAttributes = {
      view: 'v-list',
      attributes: [],
    };

    const attributeDate = new AttributeReadingBuilder()
      .label('ps:label_date_file_payment')
      .class('list-grid')
      .values([`${date}`])
      .build();

    const attributeCredits = new AttributeReadingBuilder()
      .label('ps:label_credits_payments')
      .values([`${credits}`])
      .class('list-grid credits')
      .build();

    const attributeAmount = new AttributeReadingBuilder()
      .label('ps:total_amount_label')
      .values([`${this.adfFormatService.formatAmount(+amount)}`])
      .class('list-grid')
      .build();


      const attributeNumberAccount = new AttributeReadingBuilder()
      .label('ps:root-account')
      .values([`${account.account}`])
      .class('list-grid')
      .build();

      const attributeCurrency = new AttributeReadingBuilder()
      .label('ps:currency')
      .values([`${environment.currency}`])
      .class('list-grid')
      .build();
      groupOriginAccount.attributes.push(attributeNumberAccount);
      groupOriginAccount.attributes.push(attributeAmount);
      groupOriginAccount.attributes.push(attributeCurrency);
      groupOriginAccount.attributes.push(attributeCredits);
      groupOriginAccount.attributes.push(attributeDate);

      listGroup.push(groupOriginAccount);
      const dateFormat = this.adfFormatService.getFormatDateTime(this.utils.getDate());
      const headBandLayout: IHeadBandLayout = {
        date: dateFormat,
        reference: reference,
      };

    const footerAttributes: IHeadBandAttribute[] = this.utilWorkFlow.getHeadBandLayout(headBandLayout);

    let referenceLabel = this.translate.instant('reference');
    let docLabel = this.translate.instant('document');

    return new ConfirmationModalBuilder()
      .title(title)
      .subtitle(`${referenceLabel}: ${reference}`)
      .attributeList(listGroup)
      .view('v-list')
      .containerTitle(`${docLabel}: ${reference ?? ''}`)
      .containerValue('note_list-sv')
      .images(imageList)
      .headBandAttributes(footerAttributes)
      .build();
  }


  buildCreditAccountSelectAttributes(account: IOwnAccount): IDataLayoutSelect[] {
    const accountCreditDataSelectList: IDataLayoutSelect[] = [];
    const accountCreditNameDataSelect = new DataLayoutSelectBuilder()
      .label('ps:account-name')
      .class('order-1 nameAccount')
      .value(account?.name ?? '')
      .build();

    accountCreditDataSelectList.push(accountCreditNameDataSelect);
    return accountCreditDataSelectList
  }

  buildFormLayoutVoucherTrack(form) {
    const { sourceAccount, transactionSelected, transactionDetail, title, subtitle, amount} = form

    const listGroup: any[] = [];
    const groupOriginAccount: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributeNumberAccount = new AttributeReadingBuilder()
    .label('ps:root-account-track')
    .values([`${sourceAccount.account}`])
    .build();

    const attributeNameAccount = new AttributeReadingBuilder()
    .label('table.userName')
    .values([`${sourceAccount.name}`])
    .build();

    const attributeAmount = new AttributeReadingBuilder()
      .label('ps:total_amount_label')
      .values([`${this.adfFormatService.formatAmount(+amount)}`])
      .build();


      const attributeCurrency = new AttributeReadingBuilder()
      .label('ps:currency')
      .values([`${environment.currency}`])
      .build();


    const attributeCredits = new AttributeReadingBuilder()
      .label('ps:quantity_credits_label')
      .values([`${transactionDetail.countAccounts}`])
      .build();


      groupOriginAccount.attributes.push(attributeNumberAccount);
      groupOriginAccount.attributes.push(attributeNameAccount);
      groupOriginAccount.attributes.push(attributeAmount);
      groupOriginAccount.attributes.push(attributeCurrency);
      groupOriginAccount.attributes.push(attributeCredits);

      listGroup.push(groupOriginAccount);


      return new DataReadingBuilder()
      .subtitle('ps:title')
      .groupList(listGroup)
      .build();
  }
}
