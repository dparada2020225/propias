import {
  FormValidationsBuilder,
  ILayout,
  ILayoutAttribute,
  LayoutAttributeBuilder,
  LayoutBuilder,
  LayoutType,
  RegexMessageHandlerBuilder,
  RequiredMessageHandlerBuilder
} from '@adf/components';
import { Injectable } from '@angular/core';
import { UtilService } from 'src/app/service/common/util.service';
import { AttributeFormCrud } from '../../../../enums/third-transfer-control-name.enum';
import { IGetThirdTransferResponse } from '../../../../interfaces/third-transfer-service';

@Injectable({
  providedIn: 'root'
})
export class TTDCreateFormService {

  constructor(
    private util: UtilService
  ) { }

  buildCreateAccountLayout(account: IGetThirdTransferResponse): ILayout {

    const attributes: ILayoutAttribute[] = [];
    const validationsCreateACcount = new FormValidationsBuilder()
      .disable(true)
      .required(true)
      .build();

    const attributeNumberAccount = new LayoutAttributeBuilder()
      .label('account-number')
      .placeholder(`${account?.account}`)
      .controlName(AttributeFormCrud.NUMBER_ACCOUNT)
      .layoutType(LayoutType.INPUT)
      .class('crud_third-input disable v-inline input-uppercase-value')
      .formValidations(validationsCreateACcount)
      .build();

    const validationsTypeAccount = new FormValidationsBuilder()
      .disable(true)
      .required(true)
      .build();

    const attributeTypeAccount = new LayoutAttributeBuilder()
      .label('root-account-type')
      .placeholder(this.util.getLabelProduct(+account?.productType ?? 0))
      .controlName(AttributeFormCrud.TYPE_ACCOUNT)
      .layoutType(LayoutType.INPUT)
      .class('crud_third-input third-text disable v-inline input-uppercase-value hidden')
      .formValidations(validationsTypeAccount)
      .build();

    const validationNameAccount = new FormValidationsBuilder()
      .disable(true)
      .required(true)
      .build();

    const attributeName = new LayoutAttributeBuilder()
      .label('ach-name')
      .placeholder(`${account?.name ?? ''}`)
      .controlName(AttributeFormCrud.NAME_ACCOUNT)
      .layoutType(LayoutType.INPUT)
      .class('crud_third-input third-text disable v-inline input-uppercase-value')
      .formValidations(validationNameAccount)
      .build();

    const validationStateAccount = new FormValidationsBuilder()
      .disable(true)
      .required(true)
      .build();

    const attributeStateAccount = new LayoutAttributeBuilder()
      .label('state')
      .placeholder(`${this.util.getLabelStatus(account?.status ?? '')}`)
      .controlName(AttributeFormCrud.ACCOUNT_STATE)
      .layoutType(LayoutType.INPUT)
      .class('crud_third-input third-text disable v-inline input-uppercase-value')
      .formValidations(validationStateAccount)
      .build();

    const validationCurrency = new FormValidationsBuilder()
      .disable(true)
      .required(true)
      .build();

    const attributeCurrency = new LayoutAttributeBuilder()
      .label('ach_currency')
      .placeholder(`${this.util.getLabelCurrency(account?.currency ?? '').toUpperCase()}`)
      .controlName(AttributeFormCrud.CURRENCY)
      .layoutType(LayoutType.INPUT)
      .class('crud_third-input third-text disable v-inline')
      .formValidations(validationCurrency)
      .build();

    const validationRequired = new RequiredMessageHandlerBuilder()
      .label('alias_required')
      .build();

    const validationAlias = new FormValidationsBuilder()
      .disable(false)
      .required(true)
      .validationMessageHandlerList([validationRequired])
      .build();

    const attributeAlias = new LayoutAttributeBuilder()
      .label('alias*')
      .placeholder('account_credit_alias')
      .controlName(AttributeFormCrud.ALIAS)
      .layoutType(LayoutType.INPUT)
      .class('crud_third-input third-text')
      .formValidations(validationAlias)
      .build();

    const emailValidator = new RegexMessageHandlerBuilder()
      .label('error_email')
      .build();

    const emailRequire = new RequiredMessageHandlerBuilder()
      .label('require_email')
      .build();

    const validationEmail = new FormValidationsBuilder()
      .regex("[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}")
      .validationMessageHandlerList([emailValidator, emailRequire])
      .build();

    const attributeEmail = new LayoutAttributeBuilder()
      .label('email')
      .placeholder('email')
      .controlName(AttributeFormCrud.EMAIL)
      .layoutType(LayoutType.INPUT)
      .imaskOptions(this.util.buildMaskToEmailField())
      .class('crud_third-input')
      .formValidations(validationEmail)
      .build();

    attributes.push(attributeNumberAccount);
    attributes.push(attributeTypeAccount);
    attributes.push(attributeName);
    attributes.push(attributeStateAccount);
    attributes.push(attributeCurrency);
    attributes.push(attributeAlias);
    attributes.push(attributeEmail);

    return new LayoutBuilder()
      .subtitle('add_third_party_account')
      .title('transfers-third-title')
      .class('third-crate-layout padding-side')
      .attributes(attributes)
      .build();
  }
}
