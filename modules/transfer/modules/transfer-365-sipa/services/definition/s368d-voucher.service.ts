import { Injectable } from '@angular/core';
import { IS365ConfirmationVoucherParameters } from '../../interfaces/voucher-definition.interface';
import { AdfFormatService, AttributeReadingBuilder, DataReadingBuilder, IGroupAttributes } from '@adf/components';
import { UtilService } from '../../../../../../service/common/util.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class S368dVoucherService {

  constructor(
    private utils: UtilService,
    private adfFormatService: AdfFormatService,
  ) { }

  buildConfirmationVoucherLayout(parameters: IS365ConfirmationVoucherParameters) {
    const {
      sourceAccountSelected,
      targetAccountSelected,
      formValues,
      scheduleFormValues,
      reasonSelected,
      commission,
      totalValue,
    } = parameters;
    const { amount, comment } = formValues;

    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const sourceProductAcronym = this.utils.getProductAcronym(sourceAccountSelected.product);
    const sourceProductAmount = this.utils.formatAmountWithCurrency(`${sourceAccountSelected.availableAmount}`);

    const attributeSourceAccount = new AttributeReadingBuilder()
      .label('root_account')
      .values([`${sourceProductAcronym} - ${sourceAccountSelected.account}`])
      .build();
    groupGrid.attributes.push(attributeSourceAccount);

    const attributeSourceAccountName = new AttributeReadingBuilder()
      .label('accountName')
      .values([`${sourceAccountSelected.name}`])
      .build();
    groupGrid.attributes.push(attributeSourceAccountName);

    const attributeSourceAccountAvailable = new AttributeReadingBuilder()
      .label('label.home.available')
      .values([`${sourceProductAmount}`])
      .build();
    groupGrid.attributes.push(attributeSourceAccountAvailable);

    const attributeTargetAccount = new AttributeReadingBuilder()
      .label('account_credit_name')
      .values([`${targetAccountSelected.account}`])
      .build();
    groupGrid.attributes.push(attributeTargetAccount);

    const attributeBankName = new AttributeReadingBuilder()
      .label('target-bank')
      .values([`${targetAccountSelected.bankName}`])
      .build();
    groupGrid.attributes.push(attributeBankName);

    const attributeS365Amount = new AttributeReadingBuilder()
      .label('amount')
      .values([this.utils.formatAmountWithCurrency(amount)])
      .build();
    groupGrid.attributes.push(attributeS365Amount);

    const attributeCommission = new AttributeReadingBuilder()
      .label('sp365:label_commission2')
      .values([`${sourceAccountSelected.currency} ${commission}`])
      .build();
    groupGrid.attributes.push(attributeCommission);

    const attributeTotalToDebit = new AttributeReadingBuilder()
      .label('sp365:total_to_debit2')
      .values([`${totalValue}`])
      .build();
    groupGrid.attributes.push(attributeTotalToDebit);

    const attributeReason = new AttributeReadingBuilder()
      .label('sp365:label_reason')
      .values([`${reasonSelected.description}`])
      .build();
    groupGrid.attributes.push(attributeReason);

    const attributeComment = new AttributeReadingBuilder()
      .label('comment')
      .values([comment])
      .build();
    groupGrid.attributes.push(attributeComment);

    const date = this.parseScheduleDate(scheduleFormValues.date);

    if (formValues.isSchedule) {
      const attributeSchedule = new AttributeReadingBuilder()
        .label('sp365:label_schedule_transaction')
        .values([date])
        .build();
      groupGrid.attributes.push(attributeSchedule);
    }

    groupList.push(groupGrid);
    return new DataReadingBuilder()
      .groupList(groupList)
      .build();
  }

  parseScheduleDate(date: string | NgbDate) {
    if (!date || typeof  date === 'string') return '';
    const day = String(date.day).padStart(2, '0');
    const month = String(date.month).padStart(2, '0');
    const dateStr = `${day}${month}${date.year}000000`
    const format = this.adfFormatService.getFormatDateTime(dateStr);
    return `${format.standard} ${format.hour.toLowerCase()}.`;
  }
}
