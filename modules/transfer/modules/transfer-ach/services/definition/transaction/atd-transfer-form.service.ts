import {
  FormValidationsBuilder,
  ILayout,
  ILayoutAttribute,
  LayoutAttributeBuilder,
  LayoutBuilder,
  LayoutType,
  RegexMessageHandlerBuilder,
  ValidationMessageHandlerBuilder
} from '@adf/components';
import { Injectable } from '@angular/core';
import { AttributeFormTransferAch } from '../../../enum/ach-transfer-control-name.enum';
import { IATEFormStartupParameters } from '../../../interfaces/ach-transfer-definition.inteface';
import { Product } from '../../../../../../../enums/product.enum';
import { UtilService } from 'src/app/service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class AtdTransferFormService {

  constructor(
    private util: UtilService,
  ) { }

  buildAchTransferLayout(startupParameters: IATEFormStartupParameters): ILayout {
    const LayoutAttributeList: ILayoutAttribute[] = [];
    const { targetAccountSelected, isModify } = startupParameters ?? {};

    const formAccountCreditName = new FormValidationsBuilder()
      .required(startupParameters.isModify)
      .disable(!startupParameters.isModify)
      .build();

    const attributeAccountCreditName = new LayoutAttributeBuilder()
      .label('account_credit_name')
      .placeholder(`${isModify ? 'select-credit-account' : targetAccountSelected?.account}`)
      .class(`${startupParameters?.isModify ? 'modify-mode' : 'disable'}  v-inline`)
      .controlName(AttributeFormTransferAch.ACCOUNT_CREDIT_NAME)
      .layoutType(startupParameters?.isModify ? LayoutType.SELECT : LayoutType.LABEL)
      .formValidations(formAccountCreditName)
      .build();
    LayoutAttributeList.push(attributeAccountCreditName);


    const formAccountCreditCurrency = new FormValidationsBuilder()
      .required(true)
      .disable(true)
      .build();

    const attributeAccountCreditCurrency = new LayoutAttributeBuilder()
      .label('account_credit_currency')
      .class('disable v-inline')
      .placeholder(this.util.getLabelCurrency(targetAccountSelected?.currency ?? 'UNDEFINED'))
      .controlName(AttributeFormTransferAch.ACCOUNT_CREDIT_CURRENCY)
      .layoutType(LayoutType.LABEL)
      .formValidations(formAccountCreditCurrency)
      .build();

    LayoutAttributeList.push(attributeAccountCreditCurrency);


    const formAccountCreditType = new FormValidationsBuilder()
      .required(true)
      .disable(true)
      .build();

    const attributeAccountCreditType = new LayoutAttributeBuilder()
      .label('account_credit_type')
      .class('disable v-inline')
      .placeholder('hello world')
      .placeholder(this.util.getLabelProduct(Number(Product[targetAccountSelected?.type ?? '00'])))
      .controlName(AttributeFormTransferAch.ACCOUNT_CREDIT_TYPE)
      .layoutType(LayoutType.LABEL)
      .formValidations(formAccountCreditType)
      .build();


    LayoutAttributeList.push(attributeAccountCreditType);


    const formAccountCreditBank = new FormValidationsBuilder()
      .required(true)
      .disable(true)
      .build();

    const attributeAccountCreditBank = new LayoutAttributeBuilder()
      .label('account_credit_bank')
      .class('disable v-inline')
      .placeholder(targetAccountSelected?.bankName ?? 'UNDEFINED')
      .controlName(AttributeFormTransferAch.ACCOUNT_CREDIT_BANK)
      .layoutType(LayoutType.LABEL)
      .formValidations(formAccountCreditBank)
      .build();

    LayoutAttributeList.push(attributeAccountCreditBank);


    const formAccountCreditAlias = new FormValidationsBuilder()
      .required(true)
      .disable(true)
      .build();

    const attributeAccountCreditAlias = new LayoutAttributeBuilder()
      .label('account_alias')
      .class('disable v-inline')
      .placeholder(targetAccountSelected?.alias ?? targetAccountSelected?.name ?? 'UNDEFINED')
      .controlName(AttributeFormTransferAch.ACCOUNT_CREDIT_ALIAS)
      .layoutType(LayoutType.LABEL)
      .formValidations(formAccountCreditAlias)
      .build();

    LayoutAttributeList.push(attributeAccountCreditAlias);


    const formAccountDebited = new FormValidationsBuilder()
      .required(true)
      .build();



    const attributeAccountDebited = new LayoutAttributeBuilder()
      .label('debit-from')
      .placeholder('select-account-debit')
      .class('account-debit has-border')
      .controlName(AttributeFormTransferAch.ACCOUNT_DEBITED)
      .layoutType(LayoutType.SELECT)
      .formValidations(formAccountDebited)
      .build();

    LayoutAttributeList.push(attributeAccountDebited);


    const formAmount = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeAmount = new LayoutAttributeBuilder()
      .label('label.statements.amount')
      .placeholder('amount_to_be_debited')
      .class('amount')
      .controlName(AttributeFormTransferAch.AMOUNT)
      .layoutType(LayoutType.INPUT)
      .formValidations(formAmount)
      .build();

    LayoutAttributeList.push(attributeAmount);


    const patternValidation = new RegexMessageHandlerBuilder()
      .label('characters_invalid')
      .build();

    const formComment = new FormValidationsBuilder()
      .maxLength(60)
      .regex('^[A-Za-z0-9-áéíóúñ,. ]+$')
      .validationMessageHandlerList([patternValidation])
      .build();

    const attributeComment = new LayoutAttributeBuilder()
      .label('comment')
      .class('ach-comment has-block-end-border')
      .placeholder('enter-your-comment')
      .controlName(AttributeFormTransferAch.COMMENT)
      .layoutType(LayoutType.TEXTAREA)
      .formValidations(formComment)
      .limit(90)
      .build();

    LayoutAttributeList.push(attributeComment);


    const checkBoxValidations = new FormValidationsBuilder()
      .required(false)
      .build();

    const checkBoxAttributes = new LayoutAttributeBuilder()
      .label('schedule-transfer-ach')
      .class('grid-item-md-2 check-attribute')
      .controlName(AttributeFormTransferAch.SCHEDULE)
      .layoutType(LayoutType.CHECKBOX_SWITCH)
      .formValidations(checkBoxValidations)
      .build();
    LayoutAttributeList.push(checkBoxAttributes);

    const dateInvalidMessageBuilder = new ValidationMessageHandlerBuilder()
      .validationType('date_not_allowed')
      .label('date_not_allowed')
      .build();


    const validationDate = new FormValidationsBuilder()
      .required(false)
      .regex('^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$')
      .disable(true)
      .validationMessageHandlerList([dateInvalidMessageBuilder])
      .build();

    const attributeDate = new LayoutAttributeBuilder()
      .label('label.statements.date-modal')
      .class('grid-item-md-5 datepicker-attribute')
      .placeholder('dd/mm/aaaa')
      .controlName(AttributeFormTransferAch.DATE)
      .layoutType(LayoutType.DATEPICKER)
      .formValidations(validationDate)
      .limit(90)
      .build();
    LayoutAttributeList.push(attributeDate);

    const hourInvalidMessageBuilder = new ValidationMessageHandlerBuilder()
      .validationType('hour_not_allowed')
      .label('hour_not_allowed')
      .build();


    const validationSelectHour = new FormValidationsBuilder()
      .validationMessageHandlerList([hourInvalidMessageBuilder])
      .required(false)
      .disable(true)
      .build();

    const attributeSelectHours = new LayoutAttributeBuilder()
      .label('hour')
      .placeholder('label:select')
      .class('grid-item-md-5 padding-end-side-4 select_hour-attribute')
      .controlName(AttributeFormTransferAch.HOUR)
      .layoutType(LayoutType.SELECT)
      .formValidations(validationSelectHour)
      .build();
    LayoutAttributeList.push(attributeSelectHours);

    return new LayoutBuilder()
      .title(startupParameters.title)
      .subtitle(startupParameters.subtitle)
      .class('transfers-ach padding-side')
      .attributes(LayoutAttributeList)
      .build();
  }

}
