import { Injectable } from '@angular/core';
import {
  AdfFormatService,
  AttributeReadingBuilder,
  ConfirmationModalBuilder,
  IGroupAttributes,
  IHeadBandAttribute
} from '@adf/components';
import { IHeadBandLayout } from '../../../../../../models/util-work-flow.interface';
import { TranslateService } from '@ngx-translate/core';
import { UtilWorkFlowService } from '../../../../../../service/common/util-work-flow.service';
import { ITM365VoucherModalParameters } from '../../interfaces/voucher-definition.interface';

@Injectable({
  providedIn: 'root'
})
export class Tm365dModalService {

  constructor(
    private translate: TranslateService,
    private utilWorkFlow: UtilWorkFlowService,
    private adfFormat: AdfFormatService,
  ) {
  }

  builderLayoutVoucherModal(parameters: ITM365VoucherModalParameters) {
    const { sourceAccount, transactionResponse: { reference, dateTime } } = parameters;

    const listGroup: any[] = [];
    const imageList = this.utilWorkFlow.buildImagesToModal();
    const groupOriginAccount: IGroupAttributes = {
      view: 'v-list',
      attributes: [],
    };


    const originAccountAttributes = new AttributeReadingBuilder()
      .label('root_account')
      .values([`${sourceAccount.account} ${sourceAccount.name}`])
      .class('list-grid')
      .build();

    groupOriginAccount.attributes.push(originAccountAttributes);
    listGroup.push(groupOriginAccount);

    const headBandLayout: IHeadBandLayout = {
      date: this.adfFormat.getFormatDateTime(dateTime),
      reference: reference,
    };

    const footerAttributes: IHeadBandAttribute[] = this.utilWorkFlow.getHeadBandLayout(headBandLayout);

    return new ConfirmationModalBuilder()
      .title('tm365:label_proof_modal_title')
      .subtitle(`${this.translate.instant('reference')}: ${reference}`)
      .attributeList(listGroup)
      .view('v-list')
      .containerTitle(`${this.translate.instant('document')}: ${reference ?? ''}`)
      .images(imageList)
      .headBandAttributes(footerAttributes)
      .build();
  }
}
