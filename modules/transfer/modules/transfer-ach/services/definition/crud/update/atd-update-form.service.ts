import { Injectable } from '@angular/core';
import { AttributeFormCrudAch } from '../../../../enum/ach-crud-control-name.enum';
import {
  FormValidationsBuilder,
  ILayoutAttribute,
  LayoutAttributeBuilder,
  LayoutBuilder,
  LayoutType, MinLengthMessageHandlerBuilder,
  RegexMessageHandlerBuilder,
  RequiredMessageHandlerBuilder
} from '@adf/components';
import { IAchAccount } from '../../../../interfaces/ach-account-interface';
import { Product } from '../../../../../../../../enums/product.enum';
import { UtilService } from 'src/app/service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class AtdUpdateFormService {

  constructor(
    private util: UtilService,
  ) { }

  private buildUpdateBaseLayout(account: IAchAccount) {
    const attributes: ILayoutAttribute[] = [];

    const attributeTypeClient = new LayoutAttributeBuilder()
      .label('type_client')
      .placeholder(this.util.getLabelTypeClient(account?.clientType ?? 'UNDEFINED').toUpperCase())
      .controlName(AttributeFormCrudAch.TYPE_CLIENT)
      .layoutType(LayoutType.LABEL)
      .class('disable grid-item-md-6 uppercase-value')
      .build();
    attributes.push(attributeTypeClient);

    const attributeTypeAccount = new LayoutAttributeBuilder()
      .label('root-account-type')
      .placeholder(this.util.getLabelProduct(Number(Product[account?.type ?? '00'])))
      .controlName(AttributeFormCrudAch.TYPE_ACCOUNT)
      .layoutType(LayoutType.LABEL)
      .class('disable  grid-item-md-6')
      .build();
    attributes.push(attributeTypeAccount);

    const attributeTargetBank = new LayoutAttributeBuilder()
      .label('ach_target_bank')
      .placeholder(`${account?.bankName ?? 'UNDEFINED'}`)
      .controlName(AttributeFormCrudAch.TARGET_BANK)
      .layoutType(LayoutType.LABEL)
      .class('disable  grid-item-md-6')
      .build();
    attributes.push(attributeTargetBank);

    const attributeNumberAccount = new LayoutAttributeBuilder()
      .label('number_account')
      .placeholder(account?.account ?? 'UNDEFINED')
      .controlName(AttributeFormCrudAch.NUMBER_ACCOUNT)
      .layoutType(LayoutType.LABEL)
      .imaskOptions({
        mask: /^[a-zA-Z0-9]{0,14}$/
      })
      .class('disable grid-item-md-6')
      .build();
    attributes.push(attributeNumberAccount);

    const attributeCurrency = new LayoutAttributeBuilder()
      .label('currency.title')
      .placeholder(this.util.getLabelCurrency(account?.currency ?? 'UNDEFINED'))
      .controlName(AttributeFormCrudAch.CURRENCY)
      .layoutType(LayoutType.LABEL)
      .class('disable  grid-item-md-6')
      .build();
    attributes.push(attributeCurrency);

    const nameValidatorToUpdate = new RegexMessageHandlerBuilder()
      .label('error:ach_name_invalid')
      .build();

    const nameMinLengthUpdateValidator = new MinLengthMessageHandlerBuilder()
      .label('error:ach_name_min_length')
      .build();

    const validationNameAccount = new FormValidationsBuilder()
      .required(true)
      .minLength(4)
      .regex('^[-a-zA-Z0-9ñÑ]+ [-a-zA-Z0-9ñÑ]+( [-a-zA-Z0-9ñÑ]+)*$')
      .validationMessageHandlerList([nameValidatorToUpdate, nameMinLengthUpdateValidator])
      .build();

    const attributeName = new LayoutAttributeBuilder()
      .label('ach_name_account')
      .placeholder('enter_full_name')
      .controlName(AttributeFormCrudAch.NAME)
      .imaskOptions({
        mask: /^.{0,22}x*$/
      })
      .layoutType(LayoutType.INPUT)
      .class('ach-input grid-item-x-6')
      .formValidations(validationNameAccount)
      .build();
    attributes.push(attributeName);

    const validationStateAccount = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeStateAccount = new LayoutAttributeBuilder()
      .label('state')
      .placeholder('state')
      .controlName(AttributeFormCrudAch.STATUS)
      .layoutType(LayoutType.SELECT)
      .class('ach-input padding-block-side grid-item-x-6')
      .formValidations(validationStateAccount)
      .build();
    attributes.push(attributeStateAccount);

    const validationAlias = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeAlias = new LayoutAttributeBuilder()
      .label('account-aliases')
      .placeholder('account_credit_alias')
      .controlName(AttributeFormCrudAch.ALIAS)
      .imaskOptions({
        mask: /^[a-zA-Z0-9\s]{0,25}$/
      })
      .layoutType(LayoutType.INPUT)
      .class('ach-input padding-block-side grid-item-x-6')
      .formValidations(validationAlias)
      .build();
    attributes.push(attributeAlias);


    return attributes;
  }

  buildUpdateLayoutAccountLegalClient(account: IAchAccount) {
    const attributes = this.buildUpdateBaseLayout(account);

    const validationIdentifyBeneficiary = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributesIdentifyBeneficiary = new LayoutAttributeBuilder()
      .label('ach_company_id')
      .placeholder('ach_rtn_company')
      .controlName(AttributeFormCrudAch.COMPANY_IDENTIFIER)
      .layoutType(LayoutType.INPUT)
      .imaskOptions({
        mask: /^[a-zA-Z0-9]{0,13}$/
      })
      .class('ach-input padding-block-side grid-item-x-6')
      .formValidations(validationIdentifyBeneficiary)
      .build();
    attributes.push(attributesIdentifyBeneficiary);

    const emailValidator = new RegexMessageHandlerBuilder()
      .label('error_email')
      .build();

    const emailRequired = new RequiredMessageHandlerBuilder()
      .label('require_email')
      .build();

    const validationEmail = new FormValidationsBuilder()
      .regex("[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}")
      .required(true)
      .validationMessageHandlerList([emailValidator, emailRequired])
      .build();

    const attributeEmail = new LayoutAttributeBuilder()
      .label('notify_toEmail')
      .placeholder(AttributeFormCrudAch.EMAIL)
      .controlName('email')
      .layoutType(LayoutType.INPUT)
      .class('ach-input padding-block-side grid-item-x-6')
      .formValidations(validationEmail)
      .imaskOptions(this.util.buildMaskToEmailField())
      .build();
    attributes.push(attributeEmail);

    return new LayoutBuilder()
      .subtitle('modify_account')
      .title('transfers_other_banks')
      .class('ach-container padding-side')
      .attributes(attributes)
      .build();
  }

  buildUpdateLayoutAccountNaturalClient(account: IAchAccount) {
    const attributes = this.buildUpdateBaseLayout(account);

    const validationIdentifyBeneficiary = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributesIdentifyBeneficiary = new LayoutAttributeBuilder()
      .label('identity_beneficiary')
      .placeholder('placeholder_identify_beneficiary')
      .controlName(AttributeFormCrudAch.IDENTIFY_BENEFICIARY)
      .imaskOptions({
        mask: /^[a-zA-Z0-9]{0,14}$/
      })
      .layoutType(LayoutType.INPUT)
      .class('ach-input padding-block-side grid-item-x-6')
      .formValidations(validationIdentifyBeneficiary)
      .build();
    attributes.push(attributesIdentifyBeneficiary);

    const emailValidator = new RegexMessageHandlerBuilder()
      .label('error_email')
      .build();

    const emailRequired = new RequiredMessageHandlerBuilder()
      .label('require_email')
      .build();

    const validationEmail = new FormValidationsBuilder()
      .regex("[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}")
      .required(true)
      .validationMessageHandlerList([emailValidator, emailRequired])
      .build();

    const attributeEmail = new LayoutAttributeBuilder()
      .label('notify_toEmail')
      .placeholder('email')
      .controlName(AttributeFormCrudAch.EMAIL)
      .layoutType(LayoutType.INPUT)
      .class('ach-input padding-block-side grid-item-x-6')
      .imaskOptions(this.util.buildMaskToEmailField())
      .formValidations(validationEmail)
      .build();
    attributes.push(attributeEmail);

    return new LayoutBuilder()
      .subtitle('modify_account')
      .title('transfers_other_banks')
      .class('ach-container padding-side')
      .attributes(attributes)
      .build();
  }
}
