import { Injectable } from '@angular/core';
import {
  FormValidationsBuilder,
  ILayoutAttribute,
  LayoutAttributeBuilder,
  LayoutBuilder,
  LayoutType, MinLengthMessageHandlerBuilder,
  RegexMessageHandlerBuilder,
  RequiredMessageHandlerBuilder,
  TooltipBuilder
} from '@adf/components';
import { AttributeFormCrudAch } from '../../../../enum/ach-crud-control-name.enum';
import { UtilService } from '../../../../../../../../service/common/util.service';
import { AtdCrudUtilsService } from '../../../utils/atd-crud-utils.service';

@Injectable({
  providedIn: 'root'
})
export class AtdCreateFormService {

  constructor(
    private utils: UtilService,
    private atdCrudUtils: AtdCrudUtilsService,
  ) {}
  buildCreateLayoutForNaturalClient() {
    const attributesForNaturalClient: ILayoutAttribute[] = [];

    const validationTypeClient = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeTypeClient = new LayoutAttributeBuilder()
      .label('type_client')
      .placeholder('select_type_client')
      .controlName(AttributeFormCrudAch.TYPE_CLIENT)
      .layoutType(LayoutType.SELECT)
      .class('ach-select grid-item-x-6 input-uppercase-value')
      .formValidations(validationTypeClient)
      .build();
    attributesForNaturalClient.push(attributeTypeClient);

    const nameValidator = new RegexMessageHandlerBuilder()
      .label('error:ach_name_invalid')
      .build();

    const nameMinLengthValidator = new MinLengthMessageHandlerBuilder()
      .label('error:ach_name_min_length')
      .build();

    const validationNameAccount = new FormValidationsBuilder()
      .required(true)
      .minLength(4)
      .regex('^[-a-zA-Z0-9ñÑ]+ [-a-zA-Z0-9ñÑ]+( [-a-zA-Z0-9ñÑ]+)*$')
      .validationMessageHandlerList([nameValidator, nameMinLengthValidator])
      .build();

    const attributeNameAccount = new LayoutAttributeBuilder()
      .label('ach_name_account')
      .placeholder('enter_full_name')
      .controlName(AttributeFormCrudAch.NAME)
      .imaskOptions(this.atdCrudUtils.buildNameMask())
      .layoutType(LayoutType.INPUT)
      .class('ach-input grid-item-x-6')
      .formValidations(validationNameAccount)
      .build();
    attributesForNaturalClient.push(attributeNameAccount);

    const validationIdentifyBeneficiary = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeIdentifyBeneficiary = new LayoutAttributeBuilder()
      .label('identity_beneficiary')
      .placeholder('enter_id_number')
      .controlName(AttributeFormCrudAch.IDENTIFY_BENEFICIARY)
      .imaskOptions(this.atdCrudUtils.buildIdentifyMask())
      .layoutType(LayoutType.INPUT)
      .class('ach-input grid-item-x-6')
      .formValidations(validationIdentifyBeneficiary)
      .build();
    attributesForNaturalClient.push(attributeIdentifyBeneficiary);

    const validationAlias = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeAlias = new LayoutAttributeBuilder()
      .label('account_alias')
      .placeholder('account_alias')
      .controlName(AttributeFormCrudAch.ALIAS)
      .imaskOptions(this.atdCrudUtils.buildAliasMask())
      .layoutType(LayoutType.INPUT)
      .class('ach-input grid-item-x-6')
      .formValidations(validationAlias)
      .build();
    attributesForNaturalClient.push(attributeAlias);

    const validationBank = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeBankTarget = new LayoutAttributeBuilder()
      .label('bank')
      .placeholder('target_bank')
      .controlName(AttributeFormCrudAch.BANK_NAME)
      .layoutType(LayoutType.SELECT)
      .class('ach-select grid-item-x-6')
      .formValidations(validationBank)
      .build();
    attributesForNaturalClient.push(attributeBankTarget);

    const validationTypeAccount = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeTypeAccount = new LayoutAttributeBuilder()
      .label('root-account-type')
      .placeholder('select_of_type')
      .controlName(AttributeFormCrudAch.TYPE_ACCOUNT)
      .layoutType(LayoutType.SELECT)
      .class('ach-select grid-item-x-6')
      .formValidations(validationTypeAccount)
      .build();
    attributesForNaturalClient.push(attributeTypeAccount);

    const validationCoin = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeCoin = new LayoutAttributeBuilder()
      .label('ach_currency')
      .placeholder('select_currency')
      .controlName(AttributeFormCrudAch.CURRENCY)
      .layoutType(LayoutType.SELECT)
      .class('ach-select grid-item-x-6')
      .formValidations(validationCoin)
      .build();
    attributesForNaturalClient.push(attributeCoin);

    const validationNumberAccount = new FormValidationsBuilder()
      .required(true)
      .build();

    const tooltipNumberAccount = new TooltipBuilder()
      .label('tooltip_amount')
      .icon('banca-regional-pregunta')
      .class('ach-tooltip')
      .build();

    const attributeNumberAccount = new LayoutAttributeBuilder()
      .label('number_account')
      .placeholder('ach_account_number')
      .controlName(AttributeFormCrudAch.NUMBER_ACCOUNT)
      .layoutType(LayoutType.INPUT)
      .class('ach-input grid-item-x-6')
      .imaskOptions(this.atdCrudUtils.buildAccountNumberMask())
      .formValidations(validationNumberAccount)
      .tooltip(tooltipNumberAccount)
      .build();
    attributesForNaturalClient.push(attributeNumberAccount);

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
      .class('ach-input grid-item-x-6')
      .formValidations(validationEmail)
      .imaskOptions(this.utils.buildMaskToEmailField())
      .build();
    attributesForNaturalClient.push(attributeEmail);

    return new LayoutBuilder()
      .subtitle('add_account')
      .title('transfers_other_banks')
      .class('ach-crud-form padding-side')
      .attributes(attributesForNaturalClient)
      .build();
  }

  buildCreateLayoutForLegalClient() {
    const attributeForLawClient: ILayoutAttribute[] = [];

    const validationTypeClient = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeTypeClient = new LayoutAttributeBuilder()
      .label('type_client')
      .placeholder('select_type_client')
      .controlName(AttributeFormCrudAch.TYPE_CLIENT)
      .layoutType(LayoutType.SELECT)
      .class('ach-select grid-item-x-6')
      .formValidations(validationTypeClient)
      .build();
    attributeForLawClient.push(attributeTypeClient);

    const validationLegalNameAccount = new RegexMessageHandlerBuilder()
      .label('error:ach_name_invalid')
      .build();

    const nameMinLengthValidator = new MinLengthMessageHandlerBuilder()
      .label('error:ach_name_min_length')
      .build();

    const validationNameAccount = new FormValidationsBuilder()
      .required(true)
      .minLength(4)
      .regex('^[-a-zA-Z0-9ñÑ]+ [-a-zA-Z0-9ñÑ]+( [-a-zA-Z0-9ñÑ]+)*$')
      .validationMessageHandlerList([validationLegalNameAccount, nameMinLengthValidator])
      .build();

    const attributeNameAccount = new LayoutAttributeBuilder()
      .label('ach_name_account')
      .placeholder('enter_full_name')
      .controlName(AttributeFormCrudAch.NAME)
      .imaskOptions(this.atdCrudUtils.buildNameMask())
      .layoutType(LayoutType.INPUT)
      .class('ach-input grid-item-x-6')
      .formValidations(validationNameAccount)
      .build();
    attributeForLawClient.push(attributeNameAccount);

    const validationCompanyIdentifier = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeCompanyIdentifier = new LayoutAttributeBuilder()
      .label('ach_company_id')
      .placeholder('ach_rtn_company')
      .controlName(AttributeFormCrudAch.COMPANY_IDENTIFIER)
      .imaskOptions(this.atdCrudUtils.buildIdentifyMask())
      .layoutType(LayoutType.INPUT)
      .class('ach-input grid-item-x-6')
      .formValidations(validationCompanyIdentifier)
      .build();
    attributeForLawClient.push(attributeCompanyIdentifier);

    const validationAlias = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeAlias = new LayoutAttributeBuilder()
      .label('account_alias')
      .placeholder('account_alias')
      .controlName(AttributeFormCrudAch.ALIAS)
      .imaskOptions(this.atdCrudUtils.buildAliasMask())
      .layoutType(LayoutType.INPUT)
      .class('ach-input grid-item-x-6')
      .formValidations(validationAlias)
      .build();
    attributeForLawClient.push(attributeAlias);

    const validationBank = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeBankTarget = new LayoutAttributeBuilder()
      .label('bank')
      .placeholder('target_bank')
      .controlName(AttributeFormCrudAch.BANK_NAME)
      .layoutType(LayoutType.SELECT)
      .class('ach-select grid-item-x-6')
      .formValidations(validationBank)
      .build();
    attributeForLawClient.push(attributeBankTarget);

    const validationTypeAccount = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeTypeAccount = new LayoutAttributeBuilder()
      .label('root-account-type')
      .placeholder('select_of_type')
      .controlName(AttributeFormCrudAch.TYPE_ACCOUNT)
      .layoutType(LayoutType.SELECT)
      .class('ach-select grid-item-x-6')
      .formValidations(validationTypeAccount)
      .build();
    attributeForLawClient.push(attributeTypeAccount);

    const validationCoin = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeCoin = new LayoutAttributeBuilder()
      .label('ach_currency')
      .placeholder('select_currency')
      .controlName(AttributeFormCrudAch.CURRENCY)
      .layoutType(LayoutType.SELECT)
      .class('ach-select grid-item-x-6')
      .formValidations(validationCoin)
      .build();
    attributeForLawClient.push(attributeCoin);

    const validationNumberAccount = new FormValidationsBuilder()
      .required(true)
      .build();

    const tooltipNumberAccount = new TooltipBuilder()
      .label('tooltip_amount')
      .icon('banca-regional-pregunta')
      .class('ach-tooltip')
      .build();

    const attributeNumberAccount = new LayoutAttributeBuilder()
      .label('number_account')
      .placeholder('ach_account_number')
      .controlName(AttributeFormCrudAch.NUMBER_ACCOUNT)
      .layoutType(LayoutType.INPUT)
      .tooltip(tooltipNumberAccount)
      .imaskOptions(this.atdCrudUtils.buildAccountNumberMask())
      .class('ach-input grid-item-x-6')
      .formValidations(validationNumberAccount)
      .build();
    attributeForLawClient.push(attributeNumberAccount);

    const emailValidator = new RegexMessageHandlerBuilder()
      .label('error_email')
      .build();

    const emailRequired = new RequiredMessageHandlerBuilder()
      .label('require_email')
      .build();

    const validationEmail = new FormValidationsBuilder()
      .regex('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
      .required(true)
      .validationMessageHandlerList([emailValidator, emailRequired])
      .build();

    const attributeEmail = new LayoutAttributeBuilder()
      .label('notify_toEmail')
      .placeholder('email')
      .controlName(AttributeFormCrudAch.EMAIL)
      .layoutType(LayoutType.INPUT)
      .class('ach-input grid-item-x-6')
      .formValidations(validationEmail)
      .imaskOptions(this.utils.buildMaskToEmailField())
      .build();
    attributeForLawClient.push(attributeEmail);

    return new LayoutBuilder()
      .subtitle('add_account')
      .title('transfers_other_banks')
      .class('ach-crud-form padding-side')
      .attributes(attributeForLawClient)
      .build();
  }
}
