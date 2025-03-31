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
import { IThirdTransfersAccounts } from '../../../../../../interface/transfer-data-interface';
import { AttributeFormCrud } from '../../../../enums/third-transfer-control-name.enum';

@Injectable({
  providedIn: 'root'
})
export class TTDUpdateFormService {

  constructor(
    private util: UtilService
  ) { }

  buildUpdateAccountLayout(account: IThirdTransfersAccounts): ILayout {

    const attributes: ILayoutAttribute[] = [];
    const validationNumberAccount = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributeNumberAccount = new LayoutAttributeBuilder()
      .label('account-number')
      .placeholder(`${account?.account ?? 'UNDEFINED'}`)
      .controlName(AttributeFormCrud.NUMBER_ACCOUNT)
      .layoutType(LayoutType.LABEL)
      .class('crud_third-input disable v-inline input-uppercase-value')
      .formValidations(validationNumberAccount)
      .build();

    const validationTypeAccount = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributeTypeAccount = new LayoutAttributeBuilder()
      .label('root-account-type')
      .placeholder(`${account?.productLabel ?? 'UNDEFINED'}`)
      .controlName(AttributeFormCrud.TYPE_ACCOUNT)
      .layoutType(LayoutType.LABEL)
      .class('crud_third-input disable v-inline input-uppercase-value')
      .formValidations(validationTypeAccount)
      .build();

    const validationName = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributeName = new LayoutAttributeBuilder()
      .label('ach-name')
      .placeholder(`${account?.name ?? 'UNDEFINED'}`)
      .controlName(AttributeFormCrud.NAME_ACCOUNT)
      .layoutType(LayoutType.LABEL)
      .class('crud_third-input disable v-inline input-uppercase-value')
      .formValidations(validationName)
      .build();

    const validationStateAccount = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributeStateAccount = new LayoutAttributeBuilder()
      .label('state')
      .placeholder(`${this.util.getLabelStatus(account?.status ?? '')}`)
      .controlName(AttributeFormCrud.ACCOUNT_STATE)
      .layoutType(LayoutType.LABEL)
      .class('crud_third-input disable v-inline input-uppercase-value')
      .formValidations(validationStateAccount)
      .build();

    const validationCurrency = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributeCurrency = new LayoutAttributeBuilder()
      .label('ach_currency')
      .placeholder(`${this.util.getLabelCurrency(account?.currency ?? '').toUpperCase()}`)
      .controlName(AttributeFormCrud.CURRENCY)
      .layoutType(LayoutType.LABEL)
      .class('crud_third-input disable v-inline input-uppercase-value')
      .formValidations(validationCurrency)
      .build();

    const validationAlias = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeAlias = new LayoutAttributeBuilder()
      .label('account_credit_alias')
      .placeholder('account_credit_alias')
      .controlName(AttributeFormCrud.ALIAS)
      .layoutType(LayoutType.INPUT)
      .class('crud_third-input ')
      .formValidations(validationAlias)
      .build();

    const emailValidator = new RegexMessageHandlerBuilder()
      .label('error_email')
      .build();

    const validationEmail = new FormValidationsBuilder()
      .regex("[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}")
      .validationMessageHandlerList([emailValidator])
      .build();

    const attributeUpdateFormEmail = new LayoutAttributeBuilder()
      .label('email')
      .placeholder('email')
      .controlName(AttributeFormCrud.EMAIL)
      .layoutType(LayoutType.INPUT)
      .imaskOptions(this.util.buildMaskToEmailField())
      .formValidations(validationEmail)
      .build();

    attributes.push(attributeNumberAccount);
    attributes.push(attributeTypeAccount);
    attributes.push(attributeName);
    attributes.push(attributeStateAccount);
    attributes.push(attributeCurrency);
    attributes.push(attributeAlias);
    attributes.push(attributeUpdateFormEmail);

    return new LayoutBuilder()
      .subtitle('title.edit_third_party_account')
      .title('transfers-third-title')
      .class('third-edit-layout padding-side')
      .attributes(attributes)
      .build();
  }
}
