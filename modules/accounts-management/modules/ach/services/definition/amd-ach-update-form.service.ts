import { Injectable } from '@angular/core';
import {
  FormValidationsBuilder,
  ILayout,
  ILayoutAttribute,
  LayoutAttributeBuilder, LayoutBuilder, LayoutType,
  MaxLengthMessageHandlerBuilder,
  RegexMessageHandlerBuilder,
  RequiredMessageHandlerBuilder
} from '@adf/components';
import { ACAchCreateFromControl } from '../../enum/form-control.enum';
import { IAACHUpdateFormParameters } from '../../interfaces/form.interface';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../../../../../service/common/util.service';
import { Product } from '../../../../../../enums/product.enum';

@Injectable({
  providedIn: 'root'
})
export class AmdAchUpdateFormService {

  constructor(
    private translate: TranslateService,
    private utils: UtilService,
  ) { }

  buildFormLayout(parameters: IAACHUpdateFormParameters): ILayout {
    const { account, isOwnAccount, bank, documentType } = parameters;
    const LayoutAttributeList: ILayoutAttribute[] = [];

    const userLabelKey = `ac:ach_label_person_${account.clientType.slice(0,1).toLowerCase()}`
    const userLabel = this.translate.instant(userLabelKey);

    const requiredMessage = new RequiredMessageHandlerBuilder()
      .label('payroll:field_required')
      .build();

    const validationAttributeRequired = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([requiredMessage])
      .build();

    const attributeTypeCustomer = new LayoutAttributeBuilder()
      .label('type_client')
      .placeholder(userLabel)
      .layoutType(LayoutType.LABEL)
      .class('grid-item-md-6')
      .build();
    LayoutAttributeList.push(attributeTypeCustomer);

    const attributeBank = new LayoutAttributeBuilder()
      .label('bank')
      .placeholder(account.bankName)
      .layoutType(LayoutType.LABEL)
      .class('grid-item-md-6')
      .build();
    LayoutAttributeList.push(attributeBank);

    const attributeTypeAccount = new LayoutAttributeBuilder()
      .label('type_account')
      .placeholder(this.utils.getProductNameFromEquivalence(account.type).toUpperCase())
      .layoutType(LayoutType.LABEL)
      .class('grid-item-md-6')
      .build();
    LayoutAttributeList.push(attributeTypeAccount);

    const attributeCurrency = new LayoutAttributeBuilder()
      .label('currency')
      .placeholder(account.currency)
      .layoutType(LayoutType.LABEL)
      .class('grid-item-md-6')
      .build();
    LayoutAttributeList.push(attributeCurrency);

    const attributeStatus = new LayoutAttributeBuilder()
      .label('status')
      .placeholder(((account.status && account.status === 'ACTIVA') ? this.translate.instant('label_statu_A') : this.translate.instant('label_statu_I')).toUpperCase())
      .layoutType(LayoutType.LABEL)
      .class('grid-item-md-6')
      .build();
    LayoutAttributeList.push(attributeStatus);

    const attributeNumberAccountUpdated = new LayoutAttributeBuilder()
      .label('no_account')
      .placeholder(account.account)
      .class('grid-item-md-6 no_account')
      .layoutType(LayoutType.LABEL)
      .build();
    LayoutAttributeList.push(attributeNumberAccountUpdated);

    if (isOwnAccount) {
      const attributeOwnAccountChecked = new LayoutAttributeBuilder()
        .label('ac:ach_label_own_account')
        .class('checkbox-am-ach grid-item-md-6')
        .controlName(ACAchCreateFromControl.OWN_ACCOUNT)
        .layoutType(LayoutType.CHECKBOX_DEFAULT)
        .build();
      LayoutAttributeList.push(attributeOwnAccountChecked);
    }

    const nameMaxLengthValidator = new MaxLengthMessageHandlerBuilder()
    .label('admin-ach-name_length')
    .build();

    const nameValidator = new RegexMessageHandlerBuilder()
      .label('ach:admin-ach-account')
      .build();

    const validationNameAttribute = new FormValidationsBuilder()
      .required(true)
      .maxLength(21)
      .regex("^[a-zA-Z\\s]+$")
      // .regex("^[a-zA-Z0-9\\s]*$")
      .validationMessageHandlerList([requiredMessage, nameMaxLengthValidator, nameValidator])
      .build();

    const attributeName = new LayoutAttributeBuilder()
      .label('b2b-name')
      .placeholder('ac:placeholder_account_name')
      .class('grid-item-md-6')
      .controlName(ACAchCreateFromControl.NAME)
      .layoutType(LayoutType.INPUT)
      .formValidations(validationNameAttribute)
      .build();
    LayoutAttributeList.push(attributeName);

    const emailMaxLengthValidator = new MaxLengthMessageHandlerBuilder()
    .label('admin-ach-mail_length')
    .build();

    const emailValidator = new RegexMessageHandlerBuilder()
      .label('error_email')
      .build();

    const validationEmail = new FormValidationsBuilder()
      .required(true)
      .maxLength(60)
      .regex("[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}")
      .validationMessageHandlerList([requiredMessage, emailValidator, emailMaxLengthValidator])
      .build();

    const attributeEmail = new LayoutAttributeBuilder()
      .label('mail')
      .placeholder('ac:placeholder_email')
      .class('grid-item-md-6')
      .controlName(ACAchCreateFromControl.EMAIL)
      .layoutType(LayoutType.INPUT)
      .formValidations(validationEmail)
      .build();
    LayoutAttributeList.push(attributeEmail);

    const attributeTypeIdentify = new LayoutAttributeBuilder()
      .label('ac:label_type_identify')
      .placeholder('label_select_and_option')
      .controlName(ACAchCreateFromControl.TYPE_IDENTIFIER)
      .layoutType(LayoutType.SELECT)
      .class('grid-item-md-6')
      .formValidations(validationAttributeRequired)
      .build();
    LayoutAttributeList.push(attributeTypeIdentify);

    const noIdMaxLengthValidator = new MaxLengthMessageHandlerBuilder()
    .label('admin-ach-id_length')
    .build();

    const validationNoIdentify = new FormValidationsBuilder()
      .required(true)
      .maxLength(18)
      .validationMessageHandlerList([requiredMessage, noIdMaxLengthValidator])
      .build();

    const attributeIdentify = new LayoutAttributeBuilder()
      .label('ac:label_no_identify')
      .placeholder('ac:placeholder_identify')
      .class('grid-item-md-6')
      .controlName(ACAchCreateFromControl.NO_IDENTIFY)
      .layoutType(LayoutType.INPUT)
      .formValidations(validationNoIdentify)
      .build();
    LayoutAttributeList.push(attributeIdentify);

    const attributeReason = new LayoutAttributeBuilder()
      .label('ac:label_reason')
      .placeholder('label_select_and_option')
      .controlName(ACAchCreateFromControl.REASON)
      .layoutType(LayoutType.SELECT)
      .formValidations(validationAttributeRequired)
      .build();
    LayoutAttributeList.push(attributeReason);

    return new LayoutBuilder()
      .attributes(LayoutAttributeList)
      .build();
  }
}
