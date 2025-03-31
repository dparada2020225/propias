import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  AdfFormatService,
  AttributeReadingBuilder,
  ConfirmationModalBuilder,
  IGroupAttributes,
  IHeadBandAttribute
} from '@adf/components';
import { IBulkTransferModal } from '../../../models/bulk-transfer.interface';
import { IHeadBandLayout, IUserDataModalPdf } from '../../../../../../../models/util-work-flow.interface';
import { UtilService } from 'src/app/service/common/util.service';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';

@Injectable({
  providedIn: 'root'
})
export class BtdModalService {

  constructor(
    private util: UtilService,
    private utilWorkFlow: UtilWorkFlowService,
    private translate: TranslateService,
    private formatService: AdfFormatService,
    private utilService: UtilService,

  ) { }

  builderLayoutVoucherModal(modalProperties: IBulkTransferModal) {
    const { currentFile, dateTime, reference, sourceAccount } = modalProperties ?? {};
    const { heading } = currentFile ?? {};

    const listGroup: any[] = [];
    const imageList = this.utilWorkFlow.buildImagesToModal();
    const groupOriginAccount: IGroupAttributes = {
      view: 'v-list',
      attributes: [],
    };


    const originAccountAttributes = new AttributeReadingBuilder()
      .label('root-account')
      .class('head-columns')
      .build();

    const operationDateAttribute = new AttributeReadingBuilder()
      .label('operation-date')
      .values([`${dateTime?.numberFormat} ${dateTime?.hourSuffix}`])
      .class('content-voucher list-grid')

      .build();

    const typeAccount = new AttributeReadingBuilder()
      .label('type_account')
      .values([`${this.util.getLabelProduct(Number(sourceAccount?.product ?? '00'))}`])
      .class('content-voucher list-grid')
      .build();

    const userDataDebit: IUserDataModalPdf = {
      account: sourceAccount?.account,
      name: sourceAccount?.name
    };

    const userDebit = this.utilWorkFlow.getUserDataModalPdf(userDataDebit);

    const accountDebitAttribute = new AttributeReadingBuilder()
      .label('account_debited_modal')
      .values([userDebit])
      .class('content-voucher list-grid')
      .build();

    const amountDebitAttribute = new AttributeReadingBuilder()
      .label('amount-debited')
      .values([`${this.util.geCurrencSymbol(sourceAccount?.currency ?? '')}. ${this.formatService.formatAmount(heading?.totalAmount)}`])
      .class('content-voucher list-grid')
      .build();

    const amountCreditsAttribute = new AttributeReadingBuilder()
      .label('amount_credits')
      .values([`${heading?.credits ?? 0}`])
      .class('content-voucher list-grid')
      .build();

    const currencyDebitAttribute = new AttributeReadingBuilder()
      .label('currency')
      .values([this.utilService.getLabelCurrency(heading?.currency ?? '') ?? 'undefined'])
      .class('lastPropertyCredit list-grid')
      .build();

    groupOriginAccount.attributes.push(originAccountAttributes);
    groupOriginAccount.attributes.push(operationDateAttribute);
    groupOriginAccount.attributes.push(typeAccount);
    groupOriginAccount.attributes.push(accountDebitAttribute);
    groupOriginAccount.attributes.push(amountDebitAttribute);
    groupOriginAccount.attributes.push(amountCreditsAttribute);
    groupOriginAccount.attributes.push(currencyDebitAttribute);

    listGroup.push(groupOriginAccount);



    const headBandLayout: IHeadBandLayout = {
      date: dateTime,
      reference,
    };

    const footerAttributes: IHeadBandAttribute[] = this.utilWorkFlow.getHeadBandLayout(headBandLayout);

    return new ConfirmationModalBuilder()
      .title('transfers_other_banks')
      .subtitle(`No. ${reference ?? 'UNDEFINED'}`)
      .attributeList(listGroup)
      .view('v-list')
      .containerTitle(`${this.translate.instant('document')}: ${reference ?? ''}`)
      .containerValue('note_list')
      .images(imageList)
      .headBandAttributes(footerAttributes)
      .build();

  }
}
