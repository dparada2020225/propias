import {Injectable} from '@angular/core';
import {
  FormValidationsBuilder,
  ILayout,
  ILayoutAttribute,
  LayoutAttributeBuilder,
  LayoutBuilder,
  LayoutType,
  RequiredMessageHandlerBuilder,
  ValidationMessageHandlerBuilder
} from '@adf/components';
import { UtilService } from 'src/app/service/common/util.service';
import { ISPLDFormParameters } from 'src/app/modules/payroll/manager-payroll/interfaces/pmp-load-form.interface';
import { environment } from 'src/environments/environment';
import { SimplePaymentSupplierLoadFormAttributes, SSPPUploadFormAttributes } from '../../enums/form-attributes.enum';
@Injectable({
  providedIn: 'root'
})
export class PsmFormService {

  constructor(
    private utils: UtilService,
  ) { }

  buildFormLayout(form: ISPLDFormParameters): ILayout {
    const layoutDonationAttributes: ILayoutAttribute[] = [];

    const messageAmountRequired = new RequiredMessageHandlerBuilder()
      .label('ps:amount_required_label')
      .build();

    const messageQuantityRegistersRequired = new RequiredMessageHandlerBuilder()
      .label('ps:field_credits')
      .build();

    const validationAmount = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([messageAmountRequired])
      .build();

    const attributesAmount = new LayoutAttributeBuilder()
      .label('ps:total_amount_label')
      .placeholder(`${environment.currency} 0.00`)
      .class('grid-item-md-6 total-amount')
      .controlName(SimplePaymentSupplierLoadFormAttributes.AMOUNT)
      .layoutType(LayoutType.INPUT)
      .formValidations(validationAmount)
      .imaskOptions(this.utils.getAmountMask(environment.currency))
      .build();

    const validationCredits = new ValidationMessageHandlerBuilder()
      .validationType('customErrorCredits')
      .label("ps:field_credits")
      .build();

    const validationQuantityCredits = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([messageQuantityRegistersRequired, validationCredits])
      .build();

    const attributesQuantityCredits = new LayoutAttributeBuilder()
      .label('ps:quantity_credits_label')
      .class('grid-item-md-6 quantity-credits')
      .placeholder('ps:quantity_credits_placeholder')
      .controlName(SimplePaymentSupplierLoadFormAttributes.CREDITS)
      .layoutType(LayoutType.INPUT)
      .imaskOptions({
        mask: /^[0-9]{1,5}$/
      })
      .formValidations(validationQuantityCredits)
      .build();

    const attributeTypeLoad = new LayoutAttributeBuilder()
      .controlName(SimplePaymentSupplierLoadFormAttributes.TYPE_LOAD)
      .layoutType(LayoutType.INJECTABLE)
      .formValidations(validationQuantityCredits)
      .build();

    const attributeTypeFile = new LayoutAttributeBuilder()
      .controlName(SimplePaymentSupplierLoadFormAttributes.TYPE_FILE)
      .layoutType(LayoutType.INJECTABLE)
      .formValidations(validationQuantityCredits)
      .build();

    layoutDonationAttributes.push(attributesAmount);
    layoutDonationAttributes.push(attributesQuantityCredits);
    layoutDonationAttributes.push(attributeTypeLoad);
    layoutDonationAttributes.push(attributeTypeFile);

    return new LayoutBuilder()
      .title(form.title)
      .subtitle(form.subtitle)
      .attributes(layoutDonationAttributes)
      .build();
  }

  buildUploadFormLayout(): ILayout {
    const layoutDonationAttributes: ILayoutAttribute[] = [];

    const validationFileUpload = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeFileUpload = new LayoutAttributeBuilder()
      .controlName(SSPPUploadFormAttributes.FILE)
      .layoutType(LayoutType.INJECTABLE)
      .formValidations(validationFileUpload)
      .build();
    layoutDonationAttributes.push(attributeFileUpload);

    return new LayoutBuilder()
      .attributes(layoutDonationAttributes)
      .build();
  }
}
