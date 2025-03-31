import { Injectable } from '@angular/core';
import {
  FormValidationsBuilder,
  ILayout,
  ILayoutAttribute,
  LayoutAttributeBuilder, LayoutBuilder, LayoutType, MaxLengthMessageHandlerBuilder, RegexMessageHandlerBuilder,
  RequiredMessageHandlerBuilder
} from '@adf/components';
import { AM365FormControlName } from '../../../t365-movil/enum/form-control-name.enum';
import { EAC365MFormControl } from '../../enum/form-control-name.enum';

@Injectable({
  providedIn: 'root'
})
export class T365mFormService {

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

    const attributeSourceAccount = new LayoutAttributeBuilder()
      .label('ac:365m_label_bi_accounts')
      .placeholder('label_select_and_option')
      .controlName(EAC365MFormControl.ACCOUNT)
      .layoutType(LayoutType.SELECT)
      .class('grid-item-md-6')
      .formValidations(validationAttributeRequired)
      .build();
    LayoutAttributeList.push(attributeSourceAccount);

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
      .label('ac:365m_label_number_phone_associated')
      .placeholder('ac:365m_placeholder_enter_number_phone')
      .class('grid-item-md-6')
      .controlName(EAC365MFormControl.NUMBER_PHONE)
      .layoutType(LayoutType.INPUT)
      .formValidations(validationNumberPhoneAttribute)
      .build();
    LayoutAttributeList.push(attributeNumberPhone);

    return new LayoutBuilder()
      .attributes(LayoutAttributeList)
      .build();
  }
}
