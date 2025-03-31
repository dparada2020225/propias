import {
  FormValidationsBuilder,
  ILayout,
  ILayoutAttribute,
  LayoutBuilder,
  LayoutType,
  RegexMessageHandlerBuilder
} from '@adf/components';
import { Injectable } from '@angular/core';
import { UtilService } from 'src/app/service/common/util.service';
import { AttributeThirdFormTransfer } from '../../../../enums/third-transfer-control-name.enum';
import { ITTDForm } from '../../../../interfaces/third-transfer-definition.interface';
import { IlayoutAttributeBuilder } from 'src/app/models/build.interface';
import { TtdBaseTransferService } from '../base/ttd-base-transfer.service';

@Injectable({
  providedIn: 'root'
})
export class TtdTransferFormService {

  constructor(
    private util: UtilService,
    private base: TtdBaseTransferService
  ) { }

  buildSimpleThirdTransferLayout(form: ITTDForm): ILayout {
    const { accountAccreditSelected } = form ?? {};

    const attributes: ILayoutAttribute[] = [];

    const validationAccountCreditName = new FormValidationsBuilder()
      .required(!!form?.isModifyMode)
      .disable(!form?.isModifyMode)
      .build();

    const attributeAccountCreditName: IlayoutAttributeBuilder = {
      label: 'destination-account',
      class: `third-input disable v-inline ${form?.isModifyMode ? 'modify-mode' : ''}`,
      controlName: AttributeThirdFormTransfer.ACCOUNT_ACCREDIT,
      layoutType: form?.isModifyMode ? LayoutType.SELECT : LayoutType.LABEL,
      formValidations: validationAccountCreditName,
      placeholder: `${form?.isModifyMode ? 'select-credit-account' : accountAccreditSelected?.account}`
    }

    const validationAccountCreditCurrency = new FormValidationsBuilder()
      .required(true)
      .disable(true)
      .build();


    const attributeAccountCreditCurrency: IlayoutAttributeBuilder = {
      label: 'account_credit_currency',
      class: 'third-input disable v-inline',
      controlName: AttributeThirdFormTransfer.ACCOUNT_ACCREDIT_CURRENCY,
      placeholder: this.util.getLabelCurrency(accountAccreditSelected?.currency ?? 'UNDEFINED'),
      layoutType: LayoutType.LABEL,
      formValidations: validationAccountCreditCurrency
    }

    const validationAccountAccreditType = new FormValidationsBuilder()
      .required(true)
      .disable(true)
      .build();

    const product = accountAccreditSelected?.type ? Number(accountAccreditSelected?.type ?? 0) : Number(accountAccreditSelected?.product ?? 0);

    const attributeAccountAccreditType: IlayoutAttributeBuilder = {
      label: 'root-account-type',
      class: 'third-input disable v-inline',
      controlName: AttributeThirdFormTransfer.ACCOUNT_ACCREDIT_TYPE,
      layoutType: LayoutType.LABEL,
      formValidations: validationAccountAccreditType,
      placeholder: this.util.getLabelProduct(product)
    }

    const validationAccountCreditAlias = new FormValidationsBuilder()
      .required(true)
      .disable(true)
      .build();

    const attributesAccountCreditAlias: IlayoutAttributeBuilder = {
      label: 'account_credit_alias',
      class: 'third-input disable v-inline',
      controlName: AttributeThirdFormTransfer.ACCOUNT_ACCREDIT_ALIAS,
      layoutType: LayoutType.LABEL,
      placeholder: accountAccreditSelected?.alias ?? accountAccreditSelected?.name ?? 'UNDEFINED',
      formValidations: validationAccountCreditAlias
    }

    attributes.push(this.base.builderLayoutAttributes(attributeAccountCreditName));
    attributes.push(this.base.builderLayoutAttributes(attributeAccountCreditCurrency));
    attributes.push(this.base.builderLayoutAttributes(attributeAccountAccreditType));
    attributes.push(this.base.builderLayoutAttributes(attributesAccountCreditAlias));

    /* ============ ATTRIBUTES TO ACCREDIT ACCOUNT */

    const accountDebitValidations = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeAccountDebited: IlayoutAttributeBuilder = {
      label: 'debit-from',
      class: 'third-input has-border',
      controlName: AttributeThirdFormTransfer.ACCOUNT_DEBITED,
      layoutType: LayoutType.SELECT,
      formValidations: accountDebitValidations,
      placeholder: 'select-account-debit'
    }

    const amountValidations = new FormValidationsBuilder()
      .required(true)
      .build();


    const attributeAmount: IlayoutAttributeBuilder = {
      label: 'amount_to_be_debited',
      class: 'third-input',
      controlName: AttributeThirdFormTransfer.AMOUNT,
      layoutType: LayoutType.INPUT,
      formValidations: amountValidations,
      placeholder: 'amount_to_be_debited'
    }

    const emailValidator = new RegexMessageHandlerBuilder()
      .label('error_email')
      .build();

    const notifyValidations = new FormValidationsBuilder()
      .regex("[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}")
      .validationMessageHandlerList([emailValidator])
      .build();

    const attributeNotify: IlayoutAttributeBuilder = {
      label: 'notify_to',
      class: 'third-input',
      controlName: AttributeThirdFormTransfer.EMAIL,
      layoutType: LayoutType.INPUT,
      formValidations: notifyValidations,
      imaskOptions: {
        mask: String,
        prepare: function (str) {
          return str.toLowerCase();
        },
      },
      placeholder: 'email'
    }

    const patternValidation = new RegexMessageHandlerBuilder()
      .label('characters_invalid')
      .build();

    const commentValidations = new FormValidationsBuilder()
      .required(false)
      .regex('^[A-Za-z0-9-áéíóúñ,. ]+$')
      .validationMessageHandlerList([patternValidation])
      .maxLength(60)
      .build();

    const attributeComment: IlayoutAttributeBuilder = {
      label: 'comment',
      class: 'third-input',
      controlName: AttributeThirdFormTransfer.COMMENT,
      layoutType: LayoutType.TEXTAREA,
      formValidations: commentValidations,
      placeholder: 'enter-your-comment'
    }

    attributes.push(this.base.builderLayoutAttributes(attributeAccountDebited));
    attributes.push(this.base.builderLayoutAttributes(attributeAmount));
    attributes.push(this.base.builderLayoutAttributes(attributeNotify));
    attributes.push(this.base.builderLayoutAttributes(attributeComment));

    return new LayoutBuilder()
      .title(form?.title)
      .subtitle(form?.subtitle)
      .class('third-transfer-form padding-side')
      .attributes(attributes)
      .build();
  }
}
