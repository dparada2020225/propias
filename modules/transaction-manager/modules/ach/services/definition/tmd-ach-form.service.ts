import { Injectable } from '@angular/core';
import {
  FormValidationsBuilder,
  ILayout,
  ILayoutAttribute,
  LayoutAttributeBuilder, LayoutBuilder, LayoutType,
  RequiredMessageHandlerBuilder, ValidationMessageHandlerBuilder
} from '@adf/components';
import { ETMACHFormControl } from '../../enum/form-control-name.enum';

@Injectable({
  providedIn: 'root'
})
export class TmdAchFormService {
  buildFormLayout(): ILayout {
    const LayoutAttributeList: ILayoutAttribute[] = [];

    const requiredMessage = new RequiredMessageHandlerBuilder()
      .label('payroll:field_required')
      .build();

    const validationAttributeRequired = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([requiredMessage])
      .build();

    const attributeService = new LayoutAttributeBuilder()
      .controlName(ETMACHFormControl.SERVICE)
      .layoutType(LayoutType.INJECTABLE)
      .class('grid-item-md-6')
      .formValidations(validationAttributeRequired)
      .build();
    LayoutAttributeList.push(attributeService);

    const attributeTypeService = new LayoutAttributeBuilder()
      .controlName(ETMACHFormControl.TYPE_SERVICE)
      .layoutType(LayoutType.INJECTABLE)
      .class('grid-item-md-6')
      .formValidations(validationAttributeRequired)
      .build();
    LayoutAttributeList.push(attributeTypeService);

    const attributeTypeTransaction = new LayoutAttributeBuilder()
      .controlName(ETMACHFormControl.TYPE_TRANSACTION)
      .layoutType(LayoutType.INJECTABLE)
      .class('grid-item-md-6')
      .formValidations(validationAttributeRequired)
      .build();
    LayoutAttributeList.push(attributeTypeTransaction);

    const dateInvalidMessageBuilder = new ValidationMessageHandlerBuilder()
      .validationType('non.existent_date_range')
      .label('non.existent_date_range')
      .build();

    const validationDate = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([dateInvalidMessageBuilder, requiredMessage])
      .build();

    const attributeInitialDatePicker = new LayoutAttributeBuilder()
      .label('initial_date')
      .class('grid-item-md-6')
      .placeholder('dd/mm/aaaa')
      .minDate({ day: 1, month: 1, year: 1968 })
      .controlName(ETMACHFormControl.INITIAL_DATE)
      .layoutType(LayoutType.DATEPICKER)
      .formValidations(validationDate)
      .build();
    LayoutAttributeList.push(attributeInitialDatePicker);

    const attributeEndDatePicker = new LayoutAttributeBuilder()
      .label('final_date')
      .class('grid-item-md-6')
      .placeholder('dd/mm/aaaa')
      .minDate({ day: 1, month: 1, year: 1968 })
      .controlName(ETMACHFormControl.FINAL_DATE)
      .layoutType(LayoutType.DATEPICKER)
      .formValidations(validationDate)
      .build();
    LayoutAttributeList.push(attributeEndDatePicker);

    return new LayoutBuilder()
      .attributes(LayoutAttributeList)
      .build();
  }
}
