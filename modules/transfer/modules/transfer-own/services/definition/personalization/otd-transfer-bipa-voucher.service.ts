import { AdfFormatService, IDataReading, IGroupAttributes, DataReadingBuilder } from '@adf/components';
import { Injectable } from '@angular/core';
import { IBasicAttributeVC } from 'src/app/models/build.interface';
import { IUserDataTransaction } from 'src/app/models/util-work-flow.interface';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { UtilService } from 'src/app/service/common/util.service';
import { IOTDVoucher } from '../../../interfaces/own-transfer-definition.interface';
import { OtdTransferBaseVoucherService } from '../base/otd-transfer-base-voucher.service';

@Injectable({
  providedIn: 'root'
})
export class OtdTransferBipaVoucherService {

    constructor(
      private baseVoucher: OtdTransferBaseVoucherService,
      private utilWorkFlow: UtilWorkFlowService,
      private formatService: AdfFormatService,
      private util: UtilService,
    ) { }

    builderLayoutVoucher(voucher: IOTDVoucher, isSignatureTrackingUpdate?: boolean): IDataReading {
      const accountDebited = voucher?.accountDebited;
      const accountCredit = voucher?.accountCredit;
      const formValues = voucher?.formValues;

      const comment = formValues?.comment;
      const amount = formValues?.amount;
      const finalAmount = this.formatService.formatAmount(amount);

      const groupList: IGroupAttributes[] = [];
      const groupGrid: IGroupAttributes = {
        view: 'v-custom',
        attributes: [],
      };

      const userDataDebited: IUserDataTransaction = {
        account: accountDebited?.account,
        alias: accountDebited?.alias,
        name: accountDebited?.name,
        currency: accountDebited?.currency,
        product: +accountDebited?.product
      };

      const userDebited = this.utilWorkFlow.getUserDataTransaction(userDataDebited);


      const DataAccountDebited: IBasicAttributeVC =  {
        label: 'account_to_be_debited',
        class: 'order-lg-1 col-12 col-lg-6 list-to-column',
        values: userDebited,
      }

      groupGrid.attributes.push(this.baseVoucher.buildData(DataAccountDebited));

      const userDataCredit: IUserDataTransaction = {
        account: accountCredit?.account,
        alias: accountCredit?.alias,
        name: accountCredit?.name,
        currency: accountCredit?.currency,
        product: +accountCredit?.product
      };
      const DataCredit = this.utilWorkFlow.getUserDataTransaction(userDataCredit);

      const attributeAccountCredit: IBasicAttributeVC =  {
        label: 'account_to_be_credited',
        class:'order-lg-3 col-12 col-lg-6 list-to-column',
        values: DataCredit,
      }

      groupGrid.attributes.push(this.baseVoucher.buildData(attributeAccountCredit));

      const attributeAmountsDebited: IBasicAttributeVC =  {
        label: 'amount',
        class: 'order-lg-2 col-12 col-lg-6 list-to-column',
        values: [`${this.util.geCurrencSymbol(accountDebited?.currency)}. ${finalAmount}`],
      }

      groupGrid.attributes.push(this.baseVoucher.buildData(attributeAmountsDebited));



      if (comment !== '') {
      const attributeCommentVoucherBISVProfile: IBasicAttributeVC =  {
        label: 'comment',
        class:'order-lg-5 col-12 col-lg-6 list-to-column',
        values: [comment!],
      }
      groupGrid.attributes.push(this.baseVoucher.buildData(attributeCommentVoucherBISVProfile));
    }

      groupList.push(groupGrid);
      return new DataReadingBuilder()
        .title(`${voucher?.title}`)
        .subtitle(' ')
        .groupList(groupList)
        .class('padding-side')
        .build();
    }

}
