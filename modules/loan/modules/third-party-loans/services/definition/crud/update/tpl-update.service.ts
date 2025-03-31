import {
  LayoutAttributeBuilder,
  ILayoutAttribute,
  FormValidationsBuilder,
  RegexMessageHandlerBuilder,
  LayoutBuilder,
  LayoutType,
  RequiredMessageHandlerBuilder,
  ILayout
} from '@adf/components';
import { Injectable } from '@angular/core';
import { AttributeFormThirdPartyLoansCrud } from '../../../../enum/third-party-loans-control-name.enum';
import { IThirdPartyLoanAssociate } from '../../../../interfaces/crud/crud-third-party-loans-interface';

@Injectable({
  providedIn: 'root'
})
export class TplUpdateService {
  buildUpdateAccountLayout(accountTPL: IThirdPartyLoanAssociate): ILayout {

    const attributes: ILayoutAttribute[] = [];

    const attributeNumberLoan = new LayoutAttributeBuilder()
      .label('no_loans')
      .placeholder(accountTPL.identifier!)
      .controlName(AttributeFormThirdPartyLoansCrud.NUMBER_ACCOUNT)
      .layoutType(LayoutType.LABEL)
      .class('crud_third-input disable v-inline input-uppercase-value third-loans-form')
      .build();

    const attributeTypeLoan = new LayoutAttributeBuilder()
      .label('type_of_loan')
      .placeholder(accountTPL.type!)
      .controlName(AttributeFormThirdPartyLoansCrud.TYPE_ACCOUNT)
      .layoutType(LayoutType.LABEL)
      .class('crud_third-input third-text disable v-inline input-uppercase-value hidden third-loans-form')
      .build();

    const attributeNameLoan = new LayoutAttributeBuilder()
      .label('name_loans')
      .placeholder(accountTPL.name!)
      .controlName(AttributeFormThirdPartyLoansCrud.NAME_ACCOUNT)
      .layoutType(LayoutType.LABEL)
      .class('crud_third-input third-text disable v-inline input-uppercase-value third-loans-form')
      .build();

    const attributeStateAccount = new LayoutAttributeBuilder()
      .label('state')
      .placeholder(accountTPL.status!)
      .controlName(AttributeFormThirdPartyLoansCrud.ACCOUNT_STATE)
      .layoutType(LayoutType.LABEL)
      .class('crud_third-input third-text disable v-inline input-uppercase-value third-loans-form')
      .build();

    const attributeCurrency = new LayoutAttributeBuilder()
      .label('currency_loans')
      .placeholder(accountTPL.currency!)
      .controlName(AttributeFormThirdPartyLoansCrud.CURRENCY)
      .layoutType(LayoutType.LABEL)
      .class('crud_third-input third-text disable v-inline third-loans-form')
      .build();

    const aliasRequired = new RequiredMessageHandlerBuilder()
      .label('alias_required')
      .build();

    const aliasValidation = new RegexMessageHandlerBuilder()
      .label('characters_invalid')
      .build();

    const validationAlias = new FormValidationsBuilder()
      .disable(false)
      .required(true)
      .validationMessageHandlerList([aliasValidation, aliasRequired])
      .build();

    const attributeAlias = new LayoutAttributeBuilder()
      .label('alias*')
      .placeholder('account_credit_alias')
      .controlName(AttributeFormThirdPartyLoansCrud.ALIAS)
      .layoutType(LayoutType.INPUT)
      .class('crud_third-input third-text third-loans-form')
      .formValidations(validationAlias)
      .imaskOptions({
        mask: /^[A-Za-z0-9áéíóúñ ]+$/
      })
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
      .controlName(AttributeFormThirdPartyLoansCrud.EMAIL)
      .layoutType(LayoutType.INPUT)
      .imaskOptions({
        mask: String,
        prepare: function (str) {
          return str.toLowerCase();
        },
      })
      .class('crud_third-input third-loans-form autocomplete-text')
      .formValidations(validationEmail)
      .build();

    attributes.push(attributeNumberLoan);
    attributes.push(attributeNameLoan);
    attributes.push(attributeTypeLoan);
    attributes.push(attributeStateAccount);
    attributes.push(attributeCurrency);
    attributes.push(attributeAlias);
    attributes.push(attributeEmail);

    return new LayoutBuilder()
      .subtitle('edit_third_party_loan')
      .title('payments_loans')
      .class('third-crate-layout padding-side')
      .attributes(attributes)
      .build();
  }
}
