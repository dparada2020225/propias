import {Injectable} from '@angular/core';
import {
  AdfFormatService,
  FormValidationsBuilder,
  ILayout,
  ILayoutAttribute,
  LayoutAttributeBuilder,
  LayoutBuilder,
  LayoutType,
} from '@adf/components';
import {environment} from '../../../../../../../environments/environment';
import {ISPPLDFormParameters, SppdFormAttributes} from '../../../interfaces/pmp-form.interface';

@Injectable({
  providedIn: 'root'
})
export class PmpdFormService {

  constructor(
    private adfFormatService: AdfFormatService
  ) { }

  buildFormLayout(form: ISPPLDFormParameters): ILayout {
    const { credits, amount, date } = form
    const dateParsed = this.adfFormatService.getFormatDateTime(date);

    const layoutDonationAttributes: ILayoutAttribute[] = [];

    const attributeDate = new LayoutAttributeBuilder()
      .label('payroll:label_date_file_load')
      .placeholder(`${dateParsed.standard}`)
      .class('grid-item-md-4')
      .controlName(SppdFormAttributes.DATE)
      .layoutType(LayoutType.LABEL)
      .build();

    const attributeCredits = new LayoutAttributeBuilder()
      .label('payroll:label_credits_load')
      .placeholder(`${credits}`)
      .class('grid-item-md-4')
      .controlName(SppdFormAttributes.CREDITS)
      .layoutType(LayoutType.LABEL)
      .build();

    const attributeAmount = new LayoutAttributeBuilder()
      .label('payroll:label_amount_load')
      .placeholder(`${environment.currency} ${this.adfFormatService.formatAmount(amount)}`)
      .class('grid-item-md-4')
      .controlName(SppdFormAttributes.AMOUNT)
      .layoutType(LayoutType.LABEL)
      .build();

    const validationAmount = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeSourceAccount = new LayoutAttributeBuilder()
      .label('debit-from')
      .class('source-account_selector')
      .placeholder(`select-account-debit`)
      .controlName(SppdFormAttributes.SOURCE_ACCOUNT)
      .layoutType(LayoutType.SELECT)
      .formValidations(validationAmount)
      .build();

    layoutDonationAttributes.push(attributeDate);
    layoutDonationAttributes.push(attributeCredits);
    layoutDonationAttributes.push(attributeAmount);
    layoutDonationAttributes.push(attributeSourceAccount);

    return new LayoutBuilder()
      .title(form.title)
      .subtitle(form.subtitle)
      .attributes(layoutDonationAttributes)
      .build();
  }
}
