import { ILayoutAttribute, LayoutAttributeBuilder, LayoutBuilder, LayoutType } from '@adf/components';
import { Injectable } from '@angular/core';
import { AttributeOwnThirdPartyLoansTable } from '../../../enum/own-third-party-loans-control-name.enum';
import { IFormFilterParameters } from '../../../interfaces/tpld-table-definition.interface';

@Injectable({
  providedIn: 'root'
})
export class TpldFormFilterService {
  buildFilterLayout(parameters: IFormFilterParameters) {
    const attributes: ILayoutAttribute[] = [];

    const filterBoxAttribute = new LayoutAttributeBuilder()
      .label('advanced_search_filter')
      .placeholder('number-or-name-loan')
      .class('grid-item-x-6')
      .imaskOptions({
        mask: /^.{0,60}x*$/
      })
      .controlName(AttributeOwnThirdPartyLoansTable.FILTER)
      .layoutType(LayoutType.INPUT)
      .build();

    attributes.push(filterBoxAttribute);

    return new LayoutBuilder()
      .title(parameters?.title)
      .subtitle(parameters?.subtitle)
      .class('padding-side')
      .attributes(attributes)
      .build();
  }
}




