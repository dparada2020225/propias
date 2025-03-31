import {
  FormValidationsBuilder,
  ILayout,
  ILayoutAttribute,
  LayoutAttributeBuilder,
  LayoutBuilder,
  LayoutType,
  ValidationMessageHandlerBuilder
} from '@adf/components';
import {Injectable} from '@angular/core';
import {AttributeFormConsultAch} from '../../interfaces/consult-ach-form.interface';
import { UtilService } from '../../../../../../service/common/util.service';
import { environment } from '../../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CadFormService {

  constructor(
    private utils: UtilService,
  ) { }

  buildFormDefinition(): ILayout {
    const layoutAttributeList: ILayoutAttribute[] = [];

    const dateInvalidMessageBuilder = new ValidationMessageHandlerBuilder()
      .validationType('non.existent_date_range')
      .label('non.existent_date_range')
      .build();

    const validationDate = new FormValidationsBuilder()
      .validationMessageHandlerList([dateInvalidMessageBuilder])
      .build();

    const attributeInitialDatePicker = new LayoutAttributeBuilder()
      .label('initial_date')
      .class('grid-item-x-6')
      .placeholder('DD/MM/AAA')
      .minDate({ day: 1, month: 1, year: 1968 })
      .controlName(AttributeFormConsultAch.InitDate)
      .layoutType(LayoutType.DATEPICKER)
      .formValidations(validationDate)
      .build();
    layoutAttributeList.push(attributeInitialDatePicker);

    const attributeEndDatePicker = new LayoutAttributeBuilder()
      .label('final_date')
      .class('grid-item-x-6')
      .placeholder('DD/MM/AAA')
      .minDate({ day: 1, month: 1, year: 1968 })
      .controlName(AttributeFormConsultAch.FinalDate)
      .layoutType(LayoutType.DATEPICKER)
      .formValidations(validationDate)
      .build();

    layoutAttributeList.push(attributeEndDatePicker);

    const amountInvalidMessageBuilder = new ValidationMessageHandlerBuilder()
      .validationType('non.existent_range')
      .label('non.existent_range')
      .build();

    const formValidationAttributeMinRange = new FormValidationsBuilder()
      .minLength(1)
      .maxLength(11)
      .validationMessageHandlerList([amountInvalidMessageBuilder])
      .build();

    const attributeMinRangeValue = new LayoutAttributeBuilder()
      .label('range_value')
      .imaskOptions(this.utils.getAmountMask(environment.currency))
      .placeholder('minimum')
      .class('grid-item-x-6')
      .controlName(AttributeFormConsultAch.MinRange)
      .layoutType(LayoutType.INPUT)
      .formValidations(formValidationAttributeMinRange)
      .build();
    layoutAttributeList.push(attributeMinRangeValue);

    const formValidationAttributeMaxRange = new FormValidationsBuilder()
      .minLength(1)
      .maxLength(11)
      .validationMessageHandlerList([amountInvalidMessageBuilder])
      .build();

    const attributeMaxRangeValue = new LayoutAttributeBuilder()
      .label('maximum')
      .imaskOptions(this.utils.getAmountMask(environment.currency))
      .placeholder('maximum')
      .class('grid-item-x-6 maxRange hidden-label')
      .controlName(AttributeFormConsultAch.MaxRange)
      .layoutType(LayoutType.INPUT)
      .formValidations(formValidationAttributeMaxRange)
      .build();
    layoutAttributeList.push(attributeMaxRangeValue);

    const formTypeOfMovement = new FormValidationsBuilder()
      .build();

    const attributeTypeOfMovement = new LayoutAttributeBuilder()
      .label('movement_type')
      .placeholder('type_credit_movement')
      .class('grid-item-x-6')
      .controlName(AttributeFormConsultAch.TypeOfMovement)
      .layoutType(LayoutType.SELECT)
      .formValidations(formTypeOfMovement)
      .build();
    layoutAttributeList.push(attributeTypeOfMovement);

    const formTypeOfOperation = new FormValidationsBuilder()
      .build();

    const attributeTypeOfOperation = new LayoutAttributeBuilder()
      .label('operation_type')
      .placeholder('without_filter')
      .class('grid-item-x-6')
      .controlName(AttributeFormConsultAch.TypeOfOperation)
      .layoutType(LayoutType.SELECT)
      .formValidations(formTypeOfOperation)
      .build();

    layoutAttributeList.push(attributeTypeOfOperation);

    const attributeFilterValue = new LayoutAttributeBuilder()
    .class('grid-item-x-6 filter-item')
    .controlName('filterValue')
    .layoutType(LayoutType.INJECTABLE)
    .formValidations(formTypeOfOperation)
    .build();

  layoutAttributeList.push(attributeFilterValue);

    return new LayoutBuilder()
      .title('consult_operations_other_banks')
      .subtitle('transaction_detail')
      .class('container-form padding-side')
      .attributes(layoutAttributeList)
      .build();
  }
}
