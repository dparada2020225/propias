import { Injectable } from '@angular/core';
import {
  FormValidationsBuilder,
  ILayoutAttribute,
  LayoutAttributeBuilder,
  LayoutBuilder,
  LayoutType,
  TooltipBuilder
} from '@adf/components';
import { AttributeFormTransferAch } from '../../../enum/ach-transfer-control-name.enum';

@Injectable({
  providedIn: 'root'
})
export class AtdFormFilterService {
  buildFilterLayout() {
    const attributes: ILayoutAttribute[] = [];

    const filterBoxValidations = new FormValidationsBuilder()
      .required(false)
      .build();

    const filterBoxAttribute = new LayoutAttributeBuilder()
      .placeholder('search_name_alias')
      .class('grid-item-x-9')
      .controlName(AttributeFormTransferAch.FILTER_SEARCH)
      .layoutType(LayoutType.INPUT)
      .formValidations(filterBoxValidations)
      .build();
    attributes.push(filterBoxAttribute);

    const validationSelectTypeSearch = new FormValidationsBuilder()
      .required(false)
      .build();

    const tooltipTypeSearch = new TooltipBuilder()
      .label('tooltip_search')
      .icon('banca-regional-pregunta')
      .class('transfer-ach')
      .build();


    const selectTypeSearch = new LayoutAttributeBuilder()
      .placeholder('advanced_search')
      .class('advanced_search grid-item-x-3')
      .controlName(AttributeFormTransferAch.SELECT_TYPE_FILTER)
      .layoutType(LayoutType.SELECT)
      .tooltip(tooltipTypeSearch)
      .formValidations(validationSelectTypeSearch)
      .build();
    attributes.push(selectTypeSearch);

    return new LayoutBuilder()
      .attributes(attributes)
      .build();
  }




}
