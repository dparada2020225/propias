import { Injectable } from '@angular/core';
import { IATDVoucher } from '../../../interfaces/ach-transfer-definition.inteface';
import {
  AdfFormatService,
  AttributeReadingBuilder,
  DataReadingBuilder,
  IDataReading,
  IGroupAttributes
} from '@adf/components';
import { IUserDataTransaction } from '../../../../../../../models/util-work-flow.interface';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { AtdUtilService } from '../../atd-util.service';

@Injectable({
  providedIn: 'root'
})
export class AtdTransferVoucherService {

  constructor(
    private adfFormat: AdfFormatService,
    private  utilWorkFlow: UtilWorkFlowService,
    private atdUtils: AtdUtilService,
  ) { }

  buildVoucherConfirmationLayout(properties: IATDVoucher): IDataReading {
    const { transactionResponse, formValues, sourceAccount, targetAccount } = properties ?? {};

    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributeReference = new AttributeReadingBuilder()
      .label('reference_no')
      .class('reference-item')
      .values([transactionResponse?.reference ?? 'UNDEFINED'])
      .build();
    groupGrid.attributes.push(attributeReference);

    const attributeDate = new AttributeReadingBuilder()
      .label('date_and_time')
      .values([this.adfFormat.getFormatDateTime(transactionResponse?.dateTime).fullFormat])
      .build();
    groupGrid.attributes.push(attributeDate);

    const userDataDebited: IUserDataTransaction = {
      account: sourceAccount?.account,
      alias: sourceAccount?.alias,
      name: sourceAccount?.name,
      currency: sourceAccount?.currency,
      product: sourceAccount?.product,
    };

    const userDebited = this.utilWorkFlow.getUserDataTransaction(userDataDebited);

    const attributeAccountDebited = new AttributeReadingBuilder()
      .label('account-debited')
      .values(userDebited)
      .build();
    groupGrid.attributes.push(attributeAccountDebited);

    const attributeTargetBank = new AttributeReadingBuilder()
      .label('target-bank')
      .values([`${targetAccount?.bankName ?? 'UNDEFINED'}`])
      .build();
    groupGrid.attributes.push(attributeTargetBank);

    const userDataCredit: IUserDataTransaction = {
      account: targetAccount?.account,
      alias: targetAccount?.alias,
      name: targetAccount?.name,
      currency: targetAccount?.currency,
      product: this.atdUtils.getProduct(targetAccount?.type || '0'),
    };

    const userCredit = this.utilWorkFlow.getUserDataTransaction(userDataCredit);

    const attributeAccountCredit = new AttributeReadingBuilder()
      .label('credited-account')
      .values(userCredit)
      .build();

    groupGrid.attributes.push(attributeAccountCredit);

    const attributeAmountDebited = new AttributeReadingBuilder()
      .label('amount-debited')
      .values([`${sourceAccount?.currency ?? 'UNDEFINED'} ${this.adfFormat.formatAmount(formValues?.amount)}`])
      .build();
    groupGrid.attributes.push(attributeAmountDebited);

    if (formValues?.comment) {
      const attributeComment = new AttributeReadingBuilder()
        .label('comment')
        .values([formValues?.comment ?? 'UNDEFINED'])
        .build();
      groupGrid.attributes.push(attributeComment);
    }

    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .title(properties?.title)
      .subtitle(properties?.subtitle)
      .class('padding-side')
      .groupList(groupList)
      .build();
  }

}
