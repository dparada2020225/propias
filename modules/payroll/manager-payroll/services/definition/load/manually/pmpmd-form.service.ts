import {Injectable} from '@angular/core';
import {
  FormValidationsBuilder,
  ILayoutAttribute,
  LayoutAttributeBuilder,
  LayoutBuilder,
  LayoutType,
  RegexMessageHandlerBuilder,
  RequiredMessageHandlerBuilder,
  TooltipBuilder,
  ValidationMessageHandlerBuilder
} from '@adf/components';
import {environment} from '../../../../../../../../environments/environment';
import {SpplmdForm} from '../../../../interfaces/pmp-manual-form.interface';
import {ISPLDFormParameters} from '../../../../interfaces/pmp-load-form.interface';
import {UtilService} from '../../../../../../../service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class PmpmdFormService {

  constructor(
    private utils: UtilService,
  ) { }

  buildForm(form: ISPLDFormParameters) {
    const layoutDonationAttributes: ILayoutAttribute[] = [];

    const validationLength= new ValidationMessageHandlerBuilder()
      .validationType('customErrorLength')
      .label("payroll:error_maxlength_account-sv")
      .build();

    const validationAccount = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([validationLength])
      .build();

    const tooltipNumberAccount = new TooltipBuilder()
      .label('payroll:label_tooltip')
      .icon('banca-regional-pregunta')
      .class('tooltip-sv')
      .build();

    const attributeAccount = new LayoutAttributeBuilder()
      .label('payroll:account_label')
      .placeholder('payroll:account_placeholder')
      .class('required account')
      .controlName(SpplmdForm.ACCOUNT)
      .layoutType(LayoutType.INPUT)
      .imaskOptions({
        mask: /^[0-9]{1,12}$/
      })
      .tooltip(tooltipNumberAccount)
      .formValidations(validationAccount)
      .build();

    const messageAmountRequired = new RequiredMessageHandlerBuilder()
      .label('payroll:amount_required_label')
      .build();

    const validationAmount = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([messageAmountRequired])
      .build();

    const attributesAmount = new LayoutAttributeBuilder()
      .label('amount')
      .class('required amount')
      .placeholder(`${environment.currency} 0.00`)
      .controlName(SpplmdForm.AMOUNT)
      .layoutType(LayoutType.INPUT)
      .imaskOptions(this.utils.getAmountMask(environment.currency))
      .formValidations(validationAmount)
      .build();

    const emailValidator = new RegexMessageHandlerBuilder()
      .label('payroll:label_email_error')
      .build();

    const validationEmail = new FormValidationsBuilder()
      .maxLength(50)
      .regex("[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}")
      .validationMessageHandlerList([emailValidator])
      .build();

    const attributeEmail = new LayoutAttributeBuilder()
      .label('payroll:email_example_form')
      .placeholder('payroll:email_placeholder')
      .class('email')
      .controlName(SpplmdForm.EMAIL)
      .layoutType(LayoutType.INPUT)
      .formValidations(validationEmail)
      .build();


    layoutDonationAttributes.push(attributeAccount);
    layoutDonationAttributes.push(attributesAmount);
    layoutDonationAttributes.push(attributeEmail);

    return new LayoutBuilder()
      .title(form.title)
      .subtitle(form.subtitle)
      .attributes(layoutDonationAttributes)
      .build();
  }
}
