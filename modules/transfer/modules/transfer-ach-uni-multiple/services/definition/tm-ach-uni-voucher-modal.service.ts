import { Injectable } from '@angular/core';
import { AdfFormatService, AttributeReadingBuilder, ConfirmationModalBuilder, IGroupAttributes, IHeadBandAttribute } from '@adf/components';
import { TranslateService } from '@ngx-translate/core';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { IHeadBandLayout } from 'src/app/models/util-work-flow.interface';
import { ITMAchUniVoucherModalParameters } from '../../interfaces/ach-uni-voucher-definition.interface';

@Injectable({
  providedIn: 'root'
})
export class TmAchUniVoucherModalService {

  constructor(
    private translate: TranslateService,
    private utilWorkFlow: UtilWorkFlowService,
    private adfFormat: AdfFormatService,
  ) {
  }

  builderLayoutVoucherModal(parameters: ITMAchUniVoucherModalParameters) {
    const { sourceAccount, transactionResponse: { reference, date } } = parameters;

    const listGroup: any[] = [];
    const imageList = this.utilWorkFlow.buildImagesToModal();
    const groupOriginAccount: IGroupAttributes = {
      view: 'v-list',
      attributes: [],
    };


    const originAccountAttributes = new AttributeReadingBuilder()
      .label('ach-uni:root_account')
      .values([`${sourceAccount.account} ${sourceAccount.name}`])
      .class('list-grid')
      .build();

    groupOriginAccount.attributes.push(originAccountAttributes);
    listGroup.push(groupOriginAccount);

    const headBandLayout: IHeadBandLayout = {
      date: this.adfFormat.getFormatDateTime(date),
      reference: reference,
    };

    const footerAttributes: IHeadBandAttribute[] = this.utilWorkFlow.getHeadBandLayoutConfirmUni(headBandLayout);

    return new ConfirmationModalBuilder()
      .title('tm-ach-uni:title_transfer_bank_uni')
      .subtitle(`${this.translate.instant('reference')}: ${reference}`)
      .attributeList(listGroup)
      .view('v-list')
      .containerTitle(`${this.translate.instant('document')}: ${reference ?? ''}`)
      .containerValue('note_list_uni')
      .images(imageList)
      .headBandAttributes(footerAttributes)
      .build();

  }

}
