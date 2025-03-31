import { Injectable } from '@angular/core';
import {
  FormValidationsBuilder,
  ILayoutAttribute,
  LayoutAttributeBuilder, LayoutBuilder, LayoutType, MaxLengthMessageHandlerBuilder, RegexMessageHandlerBuilder,
  RequiredMessageHandlerBuilder, TooltipBuilder
} from '@adf/components';
import { environment } from '../../../../../../../environments/environment';
import { UtilService } from '../../../../../../service/common/util.service';
import {
  EM365FormControlName,
  EM365FormControlNameEntered,
} from '../../enum/form-control.enum';

@Injectable({
  providedIn: 'root'
})
export class M365FormService {

  constructor(
    private utils: UtilService,
  ) { }

  buildTransactionFormLayoutDefinition() {
    const LayoutAttributeList: ILayoutAttribute[] = [];

    const requiredMessage = new RequiredMessageHandlerBuilder()
      .label('payroll:field_required')
      .build();

    const validationAttributeSourceAccount = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([requiredMessage])
      .build();

    const attributeSourceAccount = new LayoutAttributeBuilder()
      .label('ach:bisv:label_source_account')
      .placeholder('label_select_and_option')
      .controlName(EM365FormControlName.SOURCE_ACCOUNT)
      .layoutType(LayoutType.SELECT)
      .formValidations(validationAttributeSourceAccount)
      .build();
    LayoutAttributeList.push(attributeSourceAccount);

    const validationAttributeBeneficiary = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([requiredMessage])
      .build();

    const attributeBeneficiary = new LayoutAttributeBuilder()
      .label('m365:label_field_beneficiary')
      .placeholder('label_select_and_option')
      .class('grid-item-md-6')
      .controlName(EM365FormControlName.BENEFICIARY)
      .layoutType(LayoutType.SELECT)
      .formValidations(validationAttributeBeneficiary)
      .build();
    LayoutAttributeList.push(attributeBeneficiary);

    const validationAttributeBank = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([requiredMessage])
      .build();

    const attributeBank = new LayoutAttributeBuilder()
      .controlName(EM365FormControlName.BANK)
      .layoutType(LayoutType.INJECTABLE)
      .formValidations(validationAttributeBank)
      .build();
    LayoutAttributeList.push(attributeBank);

    return new LayoutBuilder()
      .attributes(LayoutAttributeList)
      .build();
  }

  private buildBaseAttributes() {
    const requiredMessage = new RequiredMessageHandlerBuilder()
      .label('payroll:field_required')
      .build();

    const validationAttributeAmount = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([requiredMessage])
      .build();

    const tooltipAmountAttribute = new TooltipBuilder()
      .label('ach-uni:label-amount-tooltip')
      .icon('banca-regional-pregunta')
      .class('tooltip-sv')
      .build();


    const attributeAmount = new LayoutAttributeBuilder()
      .label('label.statements.amount')
      .placeholder(`${environment.currency} 0.00`)
      .controlName(EM365FormControlName.AMOUNT)
      .layoutType(LayoutType.INPUT)
      .formValidations(validationAttributeAmount)
      .tooltip(tooltipAmountAttribute)
      .imaskOptions(this.utils.getAmountMask(environment.currency))
      .build();

    const patternValidation = new RegexMessageHandlerBuilder()
      .label('characters_invalid')
      .build();

    const formComment = new FormValidationsBuilder()
      .maxLength(60)
      .required(true)
      .regex('^[A-Za-z0-9-áéíóúñ,. ]+$')
      .validationMessageHandlerList([patternValidation, requiredMessage])
      .build();

    const attributeComment = new LayoutAttributeBuilder()
      .label('comment')
      .placeholder('ach:bisv:label_comment')
      .controlName(EM365FormControlName.COMMENT)
      .layoutType(LayoutType.TEXTAREA)
      .formValidations(formComment)
      .limit(90)
      .build();

    return {
      attributeAmount,
      attributeComment,
    }
  }


  buildAttributesForEnteredOption() {
    const LayoutAttributeList: ILayoutAttribute[] = [];

    const requiredMessage = new RequiredMessageHandlerBuilder()
      .label('payroll:field_required')
      .build();


    const phoneMaxLengthValidator = new MaxLengthMessageHandlerBuilder()
      .label('st:label_ach_phone_max_length')
      .build();

    const phoneValidRegex = new RegexMessageHandlerBuilder()
      .label('st:label_ach_phone_regex')
      .build();

    const validationNumberPhoneAttribute = new FormValidationsBuilder()
      .required(true)
      .maxLength(8)
      .regex('^(?:2|6|7)\\d{7}$')
      .validationMessageHandlerList([requiredMessage, phoneMaxLengthValidator, phoneValidRegex])
      .build();

    const attributeNumberPhone = new LayoutAttributeBuilder()
      .label('m365:label_number_phone')
      .placeholder('m365:placeholder_number_phone')
      .controlName(EM365FormControlName.NUMBER_PHONE)
      .imaskOptions(this.utils.buildNumberMask())
      .layoutType(LayoutType.INPUT)
      .formValidations(validationNumberPhoneAttribute)
      .build();
    LayoutAttributeList.push(attributeNumberPhone);

    const validationAttributeNameBeneficiary = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([requiredMessage])
      .build();

    const attributeNameBeneficiary = new LayoutAttributeBuilder()
      .label('m365:label_beneficiary')
      .placeholder('m365:placeholder_name_beneficiary')
      .class('grid-item-md-6')
      .controlName(EM365FormControlNameEntered.NAME_BENEFICIARY)
      .layoutType(LayoutType.INPUT)
      .formValidations(validationAttributeNameBeneficiary)
      .build();
    LayoutAttributeList.push(attributeNameBeneficiary);

    const validationAttributeEmail = new FormValidationsBuilder()
      .required(true)
      .regex(this.utils.buildEmailRegexToMask())
      .validationMessageHandlerList([requiredMessage])
      .build();

    const attributeEmail = new LayoutAttributeBuilder()
      .label('m365:label_email')
      .placeholder('m365:placeholder_email')
      .class('grid-item-md-6')
      .controlName(EM365FormControlNameEntered.EMAIL)
      .layoutType(LayoutType.INPUT)
      .formValidations(validationAttributeEmail)
      .build();
    LayoutAttributeList.push(attributeEmail);

    const { attributeComment, attributeAmount } = this.buildBaseAttributes();
    LayoutAttributeList.push(attributeAmount);
    LayoutAttributeList.push(attributeComment);

    return new LayoutBuilder()
      .attributes(LayoutAttributeList)
      .build();
  }

  buildAttributesForRegisteredOption() {
    const LayoutAttributeList: ILayoutAttribute[] = [];

    const requiredMessage = new RequiredMessageHandlerBuilder()
      .label('payroll:field_required')
      .build();

    const checkBoxAttributes = new LayoutAttributeBuilder()
      .label('m365:label_show_number_phone_favorites')
      .class('checkbox-365')
      .controlName(EM365FormControlName.IS_SHOW_FAVORITES)
      .layoutType(LayoutType.CHECKBOX_DEFAULT)
      .build();
    LayoutAttributeList.push(checkBoxAttributes);

    const validationAttributeNumberPhone = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([requiredMessage])
      .build();

    const attributeNumberPhone = new LayoutAttributeBuilder()
      .label('m365:label_number_phone')
      .placeholder('label_select_and_option')
      .controlName(EM365FormControlName.NUMBER_PHONE)
      .layoutType(LayoutType.SELECT)
      .formValidations(validationAttributeNumberPhone)
      .build();
    LayoutAttributeList.push(attributeNumberPhone);

    const { attributeComment, attributeAmount } = this.buildBaseAttributes();
    LayoutAttributeList.push(attributeAmount);
    LayoutAttributeList.push(attributeComment);

    return new LayoutBuilder()
      .attributes(LayoutAttributeList)
      .build();
  }
}
