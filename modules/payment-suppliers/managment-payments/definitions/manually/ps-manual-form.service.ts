import {Injectable} from '@angular/core';
import {
  FormValidationsBuilder,
  ILayoutAttribute,
  LayoutAttributeBuilder,
  LayoutBuilder,
  LayoutType,
  MaxLengthMessageHandlerBuilder,
  RegexMessageHandlerBuilder,
  RequiredMessageHandlerBuilder,
  TooltipBuilder,
  ValidationMessageHandlerBuilder
} from '@adf/components';
import { UtilService } from 'src/app/service/common/util.service';
import { ISPLDFormParameters } from 'src/app/modules/payroll/manager-payroll/interfaces/pmp-load-form.interface';
import { PsMForm } from './ps-manual-form.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpmdFormService {

  constructor(
    private utils: UtilService,
  ) { }

  buildForm(form: ISPLDFormParameters) {
    const layoutDonationAttributes: ILayoutAttribute[] = [];

    const validationLength= new ValidationMessageHandlerBuilder()
      .validationType('customErrorLength')
      .label("ps:error_maxlength_account-sv")
      .build();

    const validationAccount = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([validationLength])
      .build();

    const tooltipNumberAccount = new TooltipBuilder()
      .label('ps:label_tooltip')
      .icon('banca-regional-pregunta')
      .class('tooltip-sv')
      .build();

    const attributeAccount = new LayoutAttributeBuilder()
      .label('ps:account_label')
      .placeholder('ps:account_placeholder')
      .controlName(PsMForm.ACCOUNT)
      .layoutType(LayoutType.INPUT)
      .imaskOptions({
        mask: /^[0-9]{1,12}$/
      })
      .tooltip(tooltipNumberAccount)
      .formValidations(validationAccount)
      .build();

    const messageAmountRequired = new RequiredMessageHandlerBuilder()
      .label('ps:amount_required_label')
      .build();

    const validationAmount = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([messageAmountRequired])
      .build();

    const attributesAmount = new LayoutAttributeBuilder()
      .label('amount')
      //.placeholder(`${environment.currency} 0.00`)
      .placeholder('ps:enter-amount')
      .controlName(PsMForm.AMOUNT)
      .layoutType(LayoutType.INPUT)
      .imaskOptions(this.utils.getAmountMask(environment.currency))
      .formValidations(validationAmount)
      .build();

    const emailValidator = new RegexMessageHandlerBuilder()
      .label('ps:label_email_error')
      .build();

    const validationEmail = new FormValidationsBuilder()
      .maxLength(50)
      .regex("[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}")
      .validationMessageHandlerList([emailValidator])
      .build();

    const attributeEmail = new LayoutAttributeBuilder()
      .label('ps:email_example_form')
      .placeholder('ps:email_placeholder')
      .class('email')
      .controlName(PsMForm.EMAIL)
      .layoutType(LayoutType.INPUT)
      .formValidations(validationEmail)
      .build();

      const patternValidation = new RegexMessageHandlerBuilder()
      .label('characters_invalid')
      .build();

      const commentMaxLengthValidator = new MaxLengthMessageHandlerBuilder()
      .label('ps:detail_length')
      .build();

      const formComment = new FormValidationsBuilder()
      .maxLength(40)
      .regex('^[A-Za-z0-9-áéíóúñ,. ]+$')
      .validationMessageHandlerList([patternValidation, commentMaxLengthValidator])
      .build();

      const attributeDescription = new LayoutAttributeBuilder()
      .label('ps:label_detail')
      .placeholder('ps:detail_placeholder')
      .class('description')
      .controlName(PsMForm.DETAIL)
      .layoutType(LayoutType.INPUT)
      .formValidations(formComment)
      .limit(40)
      .build();

    layoutDonationAttributes.push(attributeAccount);
    layoutDonationAttributes.push(attributesAmount);
    layoutDonationAttributes.push(attributeEmail);
    layoutDonationAttributes.push(attributeDescription);

    return new LayoutBuilder()
      .title(form.title)
      .subtitle(form.subtitle)
      .attributes(layoutDonationAttributes)
      .build();
  }
}
