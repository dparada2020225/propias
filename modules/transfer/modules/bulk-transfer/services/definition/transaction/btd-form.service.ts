import { Injectable } from '@angular/core';
import {
  FormValidationsBuilder,
  ILayout,
  ILayoutAttribute,
  LayoutAttributeBuilder,
  LayoutBuilder,
  LayoutType,
  ValidationMessageHandlerBuilder
} from '@adf/components';
import { environment } from '../../../../../../../../environments/environment';
import { EProfile } from '../../../../../../../enums/profile.enum';
import { EBulkTransferControlName } from '../../../enum/bt-control-name.enum';

@Injectable({
  providedIn: 'root'
})
export class BtdFormService {

  buildFormLayout(isShowFullForm = false): ILayout {
    const attributes: ILayoutAttribute[] = [];

    if (environment.profile !== EProfile.HONDURAS) {
      const validationAccountDebit = new FormValidationsBuilder()
        .required(true)
        .build();

      const accountDebitAttribute = new LayoutAttributeBuilder()
        .controlName(EBulkTransferControlName.ACCOUNT_DEBIT)
        .label('account_to_be_debited')
        .class('account-debit')
        .formValidations(validationAccountDebit)
        .layoutType(LayoutType.SELECT)
        .placeholder('select_your_account')
        .build();
      attributes.push(accountDebitAttribute);

      const validationTotalAmount = new FormValidationsBuilder()
        .required(true)
        .build();

      const totalAmountAttribute = new LayoutAttributeBuilder()
        .controlName(EBulkTransferControlName.TOTAL_AMOUNT)
        .label('total_amount')
        .class('total-amount')
        .formValidations(validationTotalAmount)
        .layoutType(LayoutType.INPUT)
        .placeholder('1')
        .build();
      attributes.push(totalAmountAttribute);

      const validationTotalAccounts = new FormValidationsBuilder()
        .required(true)
        .build();

      const totalAccountsAttribute = new LayoutAttributeBuilder()
        .controlName(EBulkTransferControlName.TOTAL_ACCOUNTS_ACCREDIT)
        .label('total_accounts_accredit')
        .class('total-accounts')
        .formValidations(validationTotalAccounts)
        .layoutType(LayoutType.INPUT)
        .placeholder('1')
        .build();
      attributes.push(totalAccountsAttribute);

    }

    if (isShowFullForm) {
      const checkBoxValidations = new FormValidationsBuilder()
        .required(false)
        .build();

      const checkBoxAttributes = new LayoutAttributeBuilder()
        .label('schedule-transfer-ach')
        .class('grid-item-md-2 check-attribute')
        .controlName(EBulkTransferControlName.SCHEDULE)
        .layoutType(LayoutType.CHECKBOX_SWITCH)
        .formValidations(checkBoxValidations)
        .build();
      attributes.push(checkBoxAttributes);

      const dateInvalidMessageBuilder = new ValidationMessageHandlerBuilder()
        .validationType('date_not_allowed')
        .label('date_not_allowed')
        .build();

      const validationDate = new FormValidationsBuilder()
        .validationMessageHandlerList([dateInvalidMessageBuilder])
        .required(false)
        .disable(true)
        .build();

      const attributeDate = new LayoutAttributeBuilder()
        .label('date')
        .class('grid-item-md-5 datepicker-attribute')
        .placeholder('dd/mm/aaaa')
        .controlName(EBulkTransferControlName.DATE)
        .layoutType(LayoutType.DATEPICKER)
        .formValidations(validationDate)
        .limit(90)
        .build();
      attributes.push(attributeDate);

      const hourInvalidMessageBuilder = new ValidationMessageHandlerBuilder()
        .validationType('hour_not_allowed')
        .label('hour_not_allowed')
        .build();


      const validationSelectHour = new FormValidationsBuilder()
        .validationMessageHandlerList([hourInvalidMessageBuilder])
        .required(false)
        .disable(true)
        .build();

      const attributeSelectHours = new LayoutAttributeBuilder()
        .label('hour')
        .placeholder('select')
        .class('grid-item-md-5  select_hour-attribute')
        .controlName(EBulkTransferControlName.HOUR)
        .layoutType(LayoutType.SELECT)
        .formValidations(validationSelectHour)
        .build();
      attributes.push(attributeSelectHours);
    }

    const validationUploadFile = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeUploadFile = new LayoutAttributeBuilder()
      .controlName(EBulkTransferControlName.UPLOAD_FILE)
      .layoutType(LayoutType.INJECTABLE)
      .formValidations(validationUploadFile)
      .build();
    attributes.push(attributeUploadFile);

    return new LayoutBuilder()
      .attributes(attributes)
      .class('bt-home-layout padding-side')
      .title('transfers_other_banks')
      .subtitle('upload_files')
      .build();
  }
}
