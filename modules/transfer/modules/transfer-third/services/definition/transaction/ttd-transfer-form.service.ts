import {
  FormValidationsBuilder,
  ILayout,
  ILayoutAttribute,
  LayoutAttributeBuilder,
  LayoutBuilder,
  LayoutType,
  RegexMessageHandlerBuilder
} from '@adf/components';
import { Injectable } from '@angular/core';
import { UtilService } from 'src/app/service/common/util.service';
import { AttributeThirdFormTransfer } from '../../../enums/third-transfer-control-name.enum';
import { ITTDForm } from '../../../interfaces/third-transfer-definition.interface';

@Injectable({
  providedIn: 'root'
})
export class TtdTransferFormService {

  constructor(
    private util: UtilService,
  ) { }

  buildSimpleThirdTransferLayout(form: ITTDForm): ILayout {
    const { accountAccreditSelected } = form ?? {};

    const attributes: ILayoutAttribute[] = [];

    const validationAccountCreditName = new FormValidationsBuilder()
      .required(!!form?.isModifyMode)
      .disable(!form?.isModifyMode)
      .build();

    const attributeAccountCreditName = new LayoutAttributeBuilder()
      .label('destination-account')
      .placeholder(`${form?.isModifyMode ? 'select-credit-account' : accountAccreditSelected?.account}`)
      .controlName(AttributeThirdFormTransfer.ACCOUNT_ACCREDIT)
      .layoutType(form?.isModifyMode ? LayoutType.SELECT : LayoutType.LABEL)
      .formValidations(validationAccountCreditName)
      .class(`third-input disable v-inline ${form?.isModifyMode ? 'modify-mode' : ''}`)
      .build();

    const validationAccountCreditCurrency = new FormValidationsBuilder()
      .required(true)
      .disable(true)
      .build();

    const attributeAccountCreditCurrency = new LayoutAttributeBuilder()
      .label('account_credit_currency')
      .controlName(AttributeThirdFormTransfer.ACCOUNT_ACCREDIT_CURRENCY)
      .placeholder(this.util.getLabelCurrency(accountAccreditSelected?.currency ?? 'UNDEFINED'))
      .layoutType(LayoutType.LABEL)
      .formValidations(validationAccountCreditCurrency)
      .class('third-input disable v-inline')
      .build();

    const validationAccountAccreditType = new FormValidationsBuilder()
      .required(true)
      .disable(true)
      .build();

    const product = accountAccreditSelected?.type ? Number(accountAccreditSelected?.type ?? 0) : Number(accountAccreditSelected?.product ?? 0);

    const attributeAccountAccreditType = new LayoutAttributeBuilder()
      .label('root-account-type')
      .placeholder(this.util.getLabelProduct(product))
      .controlName(AttributeThirdFormTransfer.ACCOUNT_ACCREDIT_TYPE)
      .layoutType(LayoutType.LABEL)
      .formValidations(validationAccountAccreditType)
      .class('third-input disable v-inline')
      .build();

    const validationAccountCreditAlias = new FormValidationsBuilder()
      .required(true)
      .disable(true)
      .build();

    const attributesAccountCreditAlias = new LayoutAttributeBuilder()
      .label('account_credit_alias')
      .placeholder(accountAccreditSelected?.alias ?? accountAccreditSelected?.name ?? 'UNDEFINED')
      .controlName(AttributeThirdFormTransfer.ACCOUNT_ACCREDIT_ALIAS)
      .layoutType(LayoutType.LABEL)
      .formValidations(validationAccountCreditAlias)
      .class('third-input disable v-inline')
      .build();

    attributes.push(attributeAccountCreditName);
    attributes.push(attributeAccountCreditCurrency);
    attributes.push(attributeAccountAccreditType);
    attributes.push(attributesAccountCreditAlias);

    /* ============ ATTRIBUTES TO ACCREDIT ACCOUNT */

    const accountDebitValidations = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeAccountDebited = new LayoutAttributeBuilder()
      .label('debit-from')
      .placeholder('select-account-debit')
      .controlName(AttributeThirdFormTransfer.ACCOUNT_DEBITED)
      .layoutType(LayoutType.SELECT)
      .formValidations(accountDebitValidations)
      .class('third-input has-border')
      .build();

    const amountValidations = new FormValidationsBuilder()
      .required(true)
      .build();


    const attributeAmount = new LayoutAttributeBuilder()
      .label('amount_to_be_debited')
      .placeholder('amount_to_be_debited')
      .layoutType(LayoutType.INPUT)
      .formValidations(amountValidations)
      .controlName(AttributeThirdFormTransfer.AMOUNT)
      .class('third-input')
      .build();

    const emailValidator = new RegexMessageHandlerBuilder()
      .label('error_email')
      .build();

    const notifyValidations = new FormValidationsBuilder()
      .regex("[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}")
      .validationMessageHandlerList([emailValidator])
      .build();


    const attributeNotify = new LayoutAttributeBuilder()
      .controlName(AttributeThirdFormTransfer.EMAIL)
      .formValidations(notifyValidations)
      .label('notify_to')
      .layoutType(LayoutType.INPUT)
      .imaskOptions(this.util.buildMaskToEmailField())
      .placeholder('email')
      .class('third-input')
      .build();


    const patternValidation = new RegexMessageHandlerBuilder()
      .label('characters_invalid')
      .build();

    const commentValidations = new FormValidationsBuilder()
      .required(false)
      .regex('^[A-Za-z0-9-áéíóúñ,. ]+$')
      .validationMessageHandlerList([patternValidation])
      .maxLength(60)
      .build();

    const attributeComment = new LayoutAttributeBuilder()
      .controlName(AttributeThirdFormTransfer.COMMENT)
      .label('comment')
      .formValidations(commentValidations)
      .layoutType(LayoutType.TEXTAREA)
      .placeholder('enter-your-comment')
      .class('third-input')
      .build();

    attributes.push(attributeAccountDebited);
    attributes.push(attributeAmount);
    attributes.push(attributeNotify);
    attributes.push(attributeComment);

    return new LayoutBuilder()
      .title(form?.title)
      .subtitle(form?.subtitle)
      .class('third-transfer-form padding-side')
      .attributes(attributes)
      .build();
  }
}
