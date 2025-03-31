import {
  FormValidationsBuilder,
  ILayoutAttribute,
  LayoutAttributeBuilder,
  LayoutBuilder,
  LayoutType,
  TooltipBuilder
} from '@adf/components';
import { Injectable } from '@angular/core';
import { AttributeThirdPartyLoansTable } from '../../../../enum/third-party-loans-control-name.enum';

@Injectable({
  providedIn: 'root'
})
export class CtpldFormService {
  buildConsultLoansLayout() {
    const attributes: ILayoutAttribute[] = [];

    const filterBoxValidations = new FormValidationsBuilder()
      .required(true)
      .build();

    const numberAccountTooltip = new TooltipBuilder()
      .label('tooltip_consultTPL')
      .icon('banca-regional-pregunta')
      .class('third-party-loans-tooltip')
      .build();

    const filterBoxAttribute = new LayoutAttributeBuilder()
      .label('number_loan')
      .placeholder('enter_loan_number')
      .class('grid-item-x-6')
      .controlName(AttributeThirdPartyLoansTable.FILTER)
      .layoutType(LayoutType.INPUT)
      .imaskOptions({
        mask: /^[a-zA-Z0-9]+$/
      })
      .tooltip(numberAccountTooltip)
      .formValidations(filterBoxValidations)
      .build();

    attributes.push(filterBoxAttribute);

    return new LayoutBuilder()
      .title('payments_loans')
      .subtitle('add_third_party_loans')
      .class('padding-side')
      .attributes(attributes)
      .build();
  }


}
