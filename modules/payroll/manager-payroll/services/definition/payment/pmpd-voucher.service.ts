import {Injectable} from '@angular/core';
import {SPPDVoucherParameters, SPPESignatureTrackingParameters} from '../../../interfaces/pmp-voucher.interface';
import {
  AdfFormatService,
  AttributeReadingBuilder,
  DataReadingBuilder,
  IDataReading,
  IGroupAttributes
} from '@adf/components';
import {environment} from '../../../../../../../environments/environment';
import {IUserDataTransaction} from '../../../../../../models/util-work-flow.interface';
import {UtilWorkFlowService} from '../../../../../../service/common/util-work-flow.service';

@Injectable({
  providedIn: 'root'
})
export class PmpdVoucherService {

  constructor(
    private adfFormat: AdfFormatService,
    private utilWorkFlow: UtilWorkFlowService,
  ) { }

  buildConfirmationVoucher(parameters: SPPDVoucherParameters): IDataReading {
    const { title, subtitle, credits, amount, sourceAccount, date } = parameters;
    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const dateParse = this.adfFormat.getFormatDateTime(date)
    const attributeDate = new AttributeReadingBuilder()
      .label('payroll:label_date_file_load')
      .values([dateParse.standard])
      .build();

    const attributeCredits = new AttributeReadingBuilder()
      .label('payroll:label_credits_load')
      .values([`${credits}`])
      .build();

    const attributeAmount = new AttributeReadingBuilder()
      .label('payroll:label_amount_load')
      .values([`${environment.currency} ${this.adfFormat.formatAmount(amount)}`])
      .build();

    const userDataDebited: IUserDataTransaction = {
      account: sourceAccount?.account,
      alias: sourceAccount?.alias,
      name: sourceAccount?.name,
      currency: sourceAccount?.currency,
      product: +sourceAccount?.product
    };

    const userDebited = this.utilWorkFlow.getUserDataTransaction(userDataDebited);

    const attributeSourceAccount = new AttributeReadingBuilder()
      .label('account_to_be_debited')
      .values(userDebited)
      .build();

    groupGrid.attributes.push(attributeDate)
    groupGrid.attributes.push(attributeCredits)
    groupGrid.attributes.push(attributeAmount)
    groupGrid.attributes.push(attributeSourceAccount)


    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .title(title)
      .subtitle(subtitle)
      .groupList(groupList)
      .build();
  }

  buildVoucherForSignatureTracking(parameters: SPPESignatureTrackingParameters): IDataReading {
    const { credits, amount, sourceAccount } = parameters;
    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributeCurrency = new AttributeReadingBuilder()
      .label('currency')
      .values([environment.currency])
      .build();

    const attributeCredits = new AttributeReadingBuilder()
      .label('total_accounts_accredit')
      .values([`${credits}`])
      .build();


    const amountParsed = this.adfFormat.formatAmount(amount);

    const attributeAmount = new AttributeReadingBuilder()
      .label('total_amount')
      .values([`${amountParsed}`])
      .build();

    const userDataDebited: IUserDataTransaction = {
      account: sourceAccount?.account,
      alias: sourceAccount?.alias,
      name: sourceAccount?.name,
      currency: sourceAccount?.currency,
      product: +sourceAccount?.product
    };

    const userDebited = this.utilWorkFlow.getUserDataTransaction(userDataDebited);

    const attributeSourceAccount = new AttributeReadingBuilder()
      .label('account_to_be_debited')
      .values(userDebited)
      .build();

    groupGrid.attributes.push(attributeSourceAccount)
    groupGrid.attributes.push(attributeCurrency)
    groupGrid.attributes.push(attributeAmount)
    groupGrid.attributes.push(attributeCredits)


    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .subtitle('payroll:title')
      .groupList(groupList)
      .build();
  }
}
