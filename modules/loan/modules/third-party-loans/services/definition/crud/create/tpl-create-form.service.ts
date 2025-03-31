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
import { AttributeFormThirdPartyLoansCrud } from '../../../../enum/third-party-loans-control-name.enum';
import { IConsultThirdPartyLoan } from '../../../../interfaces/crud/crud-third-party-loans-interface';
import { UtilService } from '../../../../../../../../service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class TplCreateFormService {

  constructor(
    private util: UtilService

  ) { }

  buildCreateAccountLayout(numberLoan: string, thirdPartyLoanData: IConsultThirdPartyLoan): ILayout {
    const attributes: ILayoutAttribute[] = [];

    const attributeNumberLoan = new LayoutAttributeBuilder()
      .label('no_loans')
      .placeholder(`${numberLoan}` ?? 'UNDEFINED')
      .controlName(AttributeFormThirdPartyLoansCrud.NUMBER_ACCOUNT)
      .layoutType(LayoutType.LABEL)
      .class('crud_third-input disable v-inline input-uppercase-value third-loans-form')
      .build();

    const attributeTypeLoan = new LayoutAttributeBuilder()
      .label('type_of_loan')
      .placeholder(thirdPartyLoanData?.type ?? 'UNDEFINED')
      .controlName(AttributeFormThirdPartyLoansCrud.TYPE_ACCOUNT)
      .layoutType(LayoutType.LABEL)
      .class('crud_third-input third-text disable v-inline input-uppercase-value hidden third-loans-form')
      .build();

    const attributeNameLoan = new LayoutAttributeBuilder()
      .label('name_loans')
      .placeholder(thirdPartyLoanData?.loanName ?? 'UNDEFINED')
      .controlName(AttributeFormThirdPartyLoansCrud.NAME_ACCOUNT)
      .layoutType(LayoutType.LABEL)
      .class('crud_third-input third-text disable v-inline input-uppercase-value third-loans-form')
      .build();

    const attributeStateAccount = new LayoutAttributeBuilder()
      .label('state')
      .placeholder(thirdPartyLoanData?.status ?? 'UNDEFINED')
      .controlName(AttributeFormThirdPartyLoansCrud.ACCOUNT_STATE)
      .layoutType(LayoutType.LABEL)
      .class('crud_third-input third-text disable v-inline input-uppercase-value third-loans-form')
      .build();

    const attributeCurrency = new LayoutAttributeBuilder()
      .label('currency_loans')
      .placeholder(thirdPartyLoanData?.currency ?? 'UNDEFINED')
      .controlName(AttributeFormThirdPartyLoansCrud.CURRENCY)
      .layoutType(LayoutType.LABEL)
      .class('crud_third-input third-text disable v-inline third-loans-form')
      .build();

    const aliasValidation = new RegexMessageHandlerBuilder()
      .label('characters_invalid')
      .build();


    const aliasRequired = new RequiredMessageHandlerBuilder()
      .label('alias_required')
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
      .class('crud_third-input third-text third-loans-form autocomplete-text')
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
      .class('crud_third-input third-loans-form')
      .imaskOptions(this.util.buildMaskToEmailField())
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
      .subtitle('add_third_party_loans')
      .title('payments_loans')
      .class('third-crate-layout padding-side')
      .attributes(attributes)
      .build();
  }
}
