import { Injectable } from '@angular/core';
import {
  FormValidationsBuilder,
  ILayout,
  ILayoutAttribute,
  LayoutAttributeBuilder, LayoutBuilder, LayoutType, MaxLengthMessageHandlerBuilder, RegexMessageHandlerBuilder,
  RequiredMessageHandlerBuilder
} from '@adf/components';
import { AM365FormControlName } from '../../enum/form-control-name.enum';

@Injectable({
  providedIn: 'root'
})
export class AmdM365CreateFormService {

  constructor() { }

  buildFormLayout(): ILayout {
    const LayoutAttributeList: ILayoutAttribute[] = [];

    const requiredMessage = new RequiredMessageHandlerBuilder()
      .label('payroll:field_required')
      .build();

    const validationAttributeRequired = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([requiredMessage])
      .build();

    const attributeBank = new LayoutAttributeBuilder()
      .label('target-bank')
      .placeholder('label_select_and_option')
      .controlName(AM365FormControlName.BANK)
      .layoutType(LayoutType.SELECT)
      .class('grid-item-md-6')
      .formValidations(validationAttributeRequired)
      .build();
    LayoutAttributeList.push(attributeBank);

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
      .class('grid-item-md-6')
      .controlName(AM365FormControlName.NUMBER_PHONE)
      .layoutType(LayoutType.INPUT)
      .formValidations(validationNumberPhoneAttribute)
      .build();
    LayoutAttributeList.push(attributeNumberPhone);

    const validationNameAttribute = new FormValidationsBuilder()
      .required(true)
      .maxLength(21)
      .validationMessageHandlerList([requiredMessage])
      .build();

    const attributeName = new LayoutAttributeBuilder()
      .label('ac:365_label_beneficiary_name')
      .placeholder('m365:placeholder_name_beneficiary')
      .class('grid-item-md-6')
      .controlName(AM365FormControlName.NAME)
      .layoutType(LayoutType.INPUT)
      .formValidations(validationNameAttribute)
      .build();
    LayoutAttributeList.push(attributeName);

    const emailValidator = new RegexMessageHandlerBuilder()
      .label('error_email')
      .build();

    const validationEmail = new FormValidationsBuilder()
      .required(true)
      .maxLength(60)
      .regex("[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}")
      .validationMessageHandlerList([requiredMessage, emailValidator])
      .build();

    const attributeEmail = new LayoutAttributeBuilder()
      .label('notify_toEmail')
      .placeholder('ac:placeholder_email')
      .class('grid-item-md-6')
      .controlName(AM365FormControlName.EMAIL)
      .layoutType(LayoutType.INPUT)
      .formValidations(validationEmail)
      .build();
    LayoutAttributeList.push(attributeEmail);

    return new LayoutBuilder()
      .attributes(LayoutAttributeList)
      .build();
  }
}
