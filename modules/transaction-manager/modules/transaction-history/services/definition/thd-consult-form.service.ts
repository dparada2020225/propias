import { Injectable } from '@angular/core';
import {
  FormValidationsBuilder, ILayoutAttribute,
  LayoutAttributeBuilder,
  LayoutBuilder,
  LayoutType,
  ValidationMessageHandlerBuilder
} from '@adf/components';
import { AttributeFormTransactionHistory } from '../../enums/transaction-history-control-name.enum';

@Injectable({
  providedIn: 'root'
})
export class ThdConsultFormService {
  buildConsultForm(isShowFullForm: boolean = false) {
    const attributes: ILayoutAttribute[] = [];

    const dateInvalidMessageBuilder = new ValidationMessageHandlerBuilder()
      .validationType('non.existent_date_range')
      .label('non.existent_date_range')
      .build();


    const attributeInitialDateValidations = new FormValidationsBuilder()
      .validationMessageHandlerList([dateInvalidMessageBuilder])
      .required(true)
      .build();

    const attributeInitialDate = new LayoutAttributeBuilder()
      .label('initial_date')
      .placeholder('dd/mm/aaaa')
      .class('grid-item-x-6')
      .layoutType(LayoutType.DATEPICKER)
      .minDate({
        day: 1,
        month: 1,
        year: 1968,
      })
      .controlName(AttributeFormTransactionHistory.INITIAL_DATE)
      .formValidations(attributeInitialDateValidations)
      .build();
    attributes.push(attributeInitialDate);

    const attributeEndDateValidations = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([dateInvalidMessageBuilder])
      .build();

    const attributeEndDate = new LayoutAttributeBuilder()
      .label('final_date')
      .placeholder('dd/mm/aaaa')
      .class('grid-item-x-6')
      .layoutType(LayoutType.DATEPICKER)
      .controlName(AttributeFormTransactionHistory.FINAL_DATE)
      .minDate({
        day: 1,
        month: 1,
        year: 1968,
      })
      .formValidations(attributeEndDateValidations)
      .build();
    attributes.push(attributeEndDate);

    if (isShowFullForm) {
      const attributeService = new LayoutAttributeBuilder()
        .label('label:service')
        .placeholder('label:selected')
        .class('grid-item-x-6')
        .layoutType(LayoutType.SELECT)
        .controlName(AttributeFormTransactionHistory.SERVICE)
        .build();
      attributes.push(attributeService);



      const attributeSearch = new LayoutAttributeBuilder()
        .label('label:fast_search')
        .placeholder('label_enter_Service')
        .class('grid-item-x-6')
        .layoutType(LayoutType.INPUT)
        .controlName(AttributeFormTransactionHistory.SEARCH)
        .build();
      attributes.push(attributeSearch);

    }

    return new LayoutBuilder()
      .title('label:transaction-history')
      .class('padding-side')
      .attributes(attributes)
      .build();
  }
}
