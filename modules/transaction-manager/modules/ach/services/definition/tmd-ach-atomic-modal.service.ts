import { Injectable } from '@angular/core';
import {
  AdfFormatService, AttributeReadingBuilder,
  ConfirmationModalBuilder,
  IConfirmationModal, IGroupAttributes,
  IHeadBandAttribute
} from '@adf/components';
import { IHeadBandLayout } from '../../../../../../models/util-work-flow.interface';
import {
  ITMAtomicACHTransactionDetailModalParameters, ITMConsultACHLoteVoucherParameters
} from '../../interfaces/tm-atomic-transaction-detail.interface';
import { UtilWorkFlowService } from '../../../../../../service/common/util-work-flow.service';
import { TranslateService } from '@ngx-translate/core';
import { TmdAchUtilsService } from './tmd-ach-utils.service';

@Injectable({
  providedIn: 'root'
})
export class TmdAchAtomicModalService {

  constructor(
    private adfFormat: AdfFormatService,
    private translate: TranslateService,
    private utilWorkflow: UtilWorkFlowService,
    private utilData: TmdAchUtilsService,
  ) { }

  buildModalLayoutForAtomicACHTransactionDetail(parameters: ITMAtomicACHTransactionDetailModalParameters): IConfirmationModal {
    const { transaction, title } = parameters;
    const listGroup: IGroupAttributes[] = [];

    const groupTargetAccount = this.utilData.buildDataForTargetAccountModal(parameters);

    const groupGeneralInformation: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const groupDataOperation: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributeTypeOperation = new AttributeReadingBuilder()
      .label('operation_type')
      .values([transaction.typeOperation])
      .class('content-voucher list-grid col-md-12')
      .build();
    groupGeneralInformation.attributes.push(attributeTypeOperation);

    const attributeService = new AttributeReadingBuilder()
      .label('label:service')
      .values([this.utilData.getServiceName(transaction.service)])
      .class('content-voucher list-grid col-md-12')
      .build();
    groupGeneralInformation.attributes.push(attributeService);

    const attributeIdTransference = new AttributeReadingBuilder()
      .label('tm:ach:no_transference')
      .values([transaction.idTransference])
      .class('content-voucher list-grid col-md-12')
      .build();
    groupGeneralInformation.attributes.push(attributeIdTransference);

    const attributeDateCreated = new AttributeReadingBuilder()
      .label('tm:ach:date_created')
      .values([transaction.date])
      .class('content-voucher list-grid col-md-12')
      .build();
    groupGeneralInformation.attributes.push(attributeDateCreated);

    const attributeSourceAccount = new AttributeReadingBuilder()
      .label('account-debited')
      .values([`${transaction.sourceAccount} ${transaction.sourceAccountName}`])
      .class('content-voucher list-grid col-md-12')
      .build();
    groupGeneralInformation.attributes.push(attributeSourceAccount);

    const attributeDataOperation = new AttributeReadingBuilder()
      .label('tm:ach:title_group_data_operation')
      .class('col-md-12 head-title')
      .build();
    groupDataOperation.attributes.push(attributeDataOperation);

    const attributeStatus = new AttributeReadingBuilder()
      .label('status')
      .values([transaction.status.toUpperCase()])
      .class('content-voucher list-grid col-md-12')
      .build();
    groupDataOperation.attributes.push(attributeStatus);

    listGroup.push(groupGeneralInformation);
    listGroup.push(groupTargetAccount);
    listGroup.push(groupDataOperation);


    const imageList = this.utilWorkflow.buildImagesToModal();

    const headBandLayout: IHeadBandLayout = {
      date: this.adfFormat.getFormatDateTime(transaction.dateRaw),
      reference: transaction.idTransference,
    };

    const footerAttributes: IHeadBandAttribute[] = this.utilWorkflow.getHeadBandLayout(headBandLayout);

    return new ConfirmationModalBuilder()
      .title(title)
      .subtitle(`${this.translate.instant('reference:')} ${transaction.idTransference}`)
      .attributeList(listGroup)
      .view('v-list')
      .containerTitle(`${this.translate.instant('document')}: ${transaction?.idTransference ?? ''}`)
      .containerValue('note_list-sv')
      .images(imageList)
      .headBandAttributes(footerAttributes)
      .build();
  }

  buildMultiple365LoteModalLayout(parameters: ITMConsultACHLoteVoucherParameters): IConfirmationModal {
    const { transaction } = parameters;
    const listGroup: IGroupAttributes[] = [];

    const groupGeneralInformation: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const groupSourceAccount: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };


    const dateFormatted = this.adfFormat.getFormatDateTime(transaction.date).standard;

    const attributeDateCreated = new AttributeReadingBuilder()
      .label('date')
      .values([dateFormatted])
      .class('content-voucher list-grid col-md-12')
      .build();
    groupGeneralInformation.attributes.push(attributeDateCreated);

    const attributeLote = new AttributeReadingBuilder()
      .label('tm:ach:label_lote2')
      .values([transaction.lote])
      .class('content-voucher list-grid col-md-12')
      .build();
    groupGeneralInformation.attributes.push(attributeLote);

    const attributeStatus = new AttributeReadingBuilder()
      .label('status')
      .values([transaction.status])
      .class('content-voucher list-grid col-md-12')
      .build();
    groupGeneralInformation.attributes.push(attributeStatus);

    const originAccountAttributes = new AttributeReadingBuilder()
      .label('account_debited_tpl')
      .class('head-columns')
      .build();
    groupSourceAccount.attributes.push(originAccountAttributes);

    const attributeAccountName = new AttributeReadingBuilder()
      .label('ach_name_account')
      .values([`${transaction.accountName}`])
      .class('content-voucher list-grid col-md-12')
      .build();
    groupSourceAccount.attributes.push(attributeAccountName);

    const attributeSourceAccount = new AttributeReadingBuilder()
      .label('no_account')
      .values([`${transaction.sourceAccount}`])
      .class('content-voucher list-grid col-md-12')
      .build();
    groupSourceAccount.attributes.push(attributeSourceAccount);


    listGroup.push(groupGeneralInformation);
    listGroup.push(groupSourceAccount);

    const imageList = this.utilWorkflow.buildImagesToModal();

    const headBandLayout: IHeadBandLayout = {
      date: this.adfFormat.getFormatDateTime(transaction.date),
      reference: transaction?.idTransaction ?? '',
    };

    const footerAttributes: IHeadBandAttribute[] = this.utilWorkflow.getHeadBandLayout(headBandLayout);

    return new ConfirmationModalBuilder()
      .title('tm365:label_proof_modal_title')
      .subtitle(`${this.translate.instant('reference:')} ${transaction?.idTransaction ?? ''}`)
      .attributeList(listGroup)
      .view('v-list')
      .containerTitle(`${this.translate.instant('document')}: ${transaction?.idTransaction ?? ''}`)
      .containerValue('note_list-sv')
      .images(imageList)
      .headBandAttributes(footerAttributes)
      .build();
  }
}
