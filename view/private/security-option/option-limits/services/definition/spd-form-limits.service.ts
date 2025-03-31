import { Injectable } from '@angular/core';
import { UtilService } from '../../../../../../service/common/util.service';
import {
  FormValidationsBuilder,
  ILayout,
  ILayoutAttribute,
  LayoutAttributeBuilder,
  LayoutBuilder,
  LayoutType
} from '@adf/components';

export enum ESPFormDefinition {
  MAX_MONTHLY = 'amount_max_monthly',
  MAX_DAILY = 'amount_max_daily',
  PER_TRANSACTION = 'amount_per_transaction',
}


@Injectable({
  providedIn: 'root'
})
export class SpdFormLimitsService {
  constructor(
    private utils: UtilService,
  ) { }

  builderFormDefinition(): ILayout {
    const layoutDonationAttributes: ILayoutAttribute[] = [];

    const formValidationPerTransaction = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributePerTransaction = new LayoutAttributeBuilder()
      .label('label:peer_transaction')
      .placeholder('0')
      .class('grid-item-x-6')
      .controlName(ESPFormDefinition.PER_TRANSACTION)
      .layoutType(LayoutType.INPUT)
      .imaskOptions(this.utils.getAmountMask(''))
      .formValidations(formValidationPerTransaction)
      .build();

    const formValidationMaxDaily = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeMaxDaily = new LayoutAttributeBuilder()
      .label('label:max_daily')
      .placeholder('0')
      .class('grid-item-x-6')
      .controlName(ESPFormDefinition.MAX_DAILY)
      .layoutType(LayoutType.INPUT)
      .imaskOptions(this.utils.getAmountMask(''))
      .formValidations(formValidationMaxDaily)
      .build();

    const formValidationMaxMonthly = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeMaxMonthly = new LayoutAttributeBuilder()
      .label('label:max_monthly')
      .placeholder('0')
      .class('grid-item-x-6')
      .controlName(ESPFormDefinition.MAX_MONTHLY)
      .layoutType(LayoutType.INPUT)
      .imaskOptions(this.utils.getAmountMask(''))
      .formValidations(formValidationMaxMonthly)
      .build();

    layoutDonationAttributes.push(attributePerTransaction);
    layoutDonationAttributes.push(attributeMaxDaily);
    layoutDonationAttributes.push(attributeMaxMonthly);

    return new LayoutBuilder()
      .attributes(layoutDonationAttributes)
      .build();
  }
}
