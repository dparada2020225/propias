import {
  AdfFormatService,
  AttributeReadingBuilder,
  DataReadingBuilder,
  IDataReading,
  IGroupAttributes
} from '@adf/components';
import { Injectable } from '@angular/core';
import { IDonationDataExecute, IDTDVoucherSample } from '../../interfaces/donation-definition.interface';
import { IDonationExecute } from '../../interfaces/donation-execute.interface';
import { UtilService } from 'src/app/service/common/util.service';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { TokenizerAccountsService } from 'src/app/service/token/tokenizer-accounts.service';
import { IUserDataTransaction } from 'src/app/models/util-work-flow.interface';

@Injectable({
  providedIn: 'root',
})
export class DtdTransferVoucherService {
  constructor(
    private util: UtilService,
    private formatService: AdfFormatService,
    private utilWorkFlow: UtilWorkFlowService,
    private tokenizerEncrypt: TokenizerAccountsService
  ) {}

  buildAccountToExecuteDonation(properties: IDonationDataExecute): IDonationExecute {
    const { fundationAccount, debitedAccount, formValues } = properties ?? {};

    return {
      sourceProduct: `${debitedAccount?.product ?? ''}`,
      sourceSubProduct: `${debitedAccount?.subproduct ?? ''}`,
      sourceAccount: `${this.tokenizerEncrypt.tokenizer(debitedAccount?.account) ?? ''}`,
      sourceCurrency: `${debitedAccount?.currency ?? ''}`,
      sourceAmount: +formValues.amount,
      targetProduct: `${fundationAccount?.productCode ?? ''}`,
      targetSubProduct: `${fundationAccount?.subProductCode ?? ''}`,
      targetAccount: `${this.tokenizerEncrypt.tokenizer(fundationAccount?.account) ?? ''}`,
      targetCurrency: `${fundationAccount?.currency ?? ''}`,
      targetAmount: +formValues?.amount,
      description: formValues?.comment ?? '',
    };
  }

  builderLayoutVoucher(voucherProperties: IDTDVoucherSample, isSignatureTrackingUpdate?: boolean): IDataReading {
    const { referenceNumber, dateTime, accountDebited, fundationAccount, amount } = voucherProperties ?? {};

    const groupList: IGroupAttributes[] = [];
    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    if (referenceNumber) {
      const attributeReference = new AttributeReadingBuilder()
        .class(`reading-text-uppercase order-lg-1`)
        .label('reference_no')
        .values([referenceNumber])
        .build();
      groupGrid.attributes.push(attributeReference);
    }

    const userDataDebit: IUserDataTransaction = {
      account: accountDebited?.account,
      alias: accountDebited?.alias,
      currency: accountDebited?.currency,
      name: accountDebited?.name,
      product: accountDebited?.product,
    };

    const userDebit = this.utilWorkFlow.getUserDataTransaction(userDataDebit);

    const attributesAccountDevited = new AttributeReadingBuilder()
      .label(isSignatureTrackingUpdate ? 'account_to_be_debited' : 'account_debited')
      .class(`reading-text-uppercase 'order-lg-3`)
      .values(userDebit)
      .build();

    const attributeAmountCredited = new AttributeReadingBuilder()
      .label('amount')
      .class(`reading-text-uppercase ${isSignatureTrackingUpdate ? 'order-lg-2' : 'order-lg-4'}`)
      .values([`${this.util.geCurrencSymbol(accountDebited?.currency ?? '')}. ${this.formatService.formatAmount(amount)}`])
      .build();

    const attributesFundationAccount = new AttributeReadingBuilder()
      .label('credited_fundation')
      .class(`reading-text-uppercase ${isSignatureTrackingUpdate ? 'order-lg-4' : 'order-lg-5'}`)
      .values([`${fundationAccount?.name ?? ''}`])
      .build();

    groupGrid.attributes.push(attributesAccountDevited);
    groupGrid.attributes.push(attributesFundationAccount);

    if (!isSignatureTrackingUpdate && dateTime) {
      const attributesDateTime = new AttributeReadingBuilder()
        .label('date_and_time')
        .class('order-lg-2')
        .values([dateTime])
        .build();

      groupGrid.attributes.push(attributesDateTime);
    }

    groupGrid.attributes.push(attributeAmountCredited);

    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .title(voucherProperties?.title)
      .subtitle(voucherProperties?.subtitle)
      .class('padding-side')
      .groupList(groupList)
      .build();
  }
}
