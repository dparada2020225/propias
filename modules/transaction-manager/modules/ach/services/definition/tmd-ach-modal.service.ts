import { Injectable } from '@angular/core';
import {
  AdfFormatService,
  ConfirmationModalBuilder,
  IHeadBandAttribute
} from '@adf/components';
import { IHeadBandLayout } from '../../../../../../models/util-work-flow.interface';
import { UtilWorkFlowService } from '../../../../../../service/common/util-work-flow.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TmdAchModalService {

  constructor(
    private utilWorkFlow: UtilWorkFlowService,
    private translate: TranslateService,
    private adfFormat: AdfFormatService,
  ) {
  }

  builderLayoutVoucherModal(reference: string, dateTime: string) {
    const imageList = this.utilWorkFlow.buildImagesToModal();

    const headBandLayout: IHeadBandLayout = {
      date: this.adfFormat.getFormatDateTime(dateTime),
      reference,
    };

    const footerAttributes: IHeadBandAttribute[] = this.utilWorkFlow.getHeadBandLayout(headBandLayout);

    return new ConfirmationModalBuilder()
      .title('tm:ach:subtitle_signatory')
      .subtitle(`${this.translate.instant('reference')}: ${reference}`)
      .attributeList([])
      .view('v-list')
      .containerTitle(`${this.translate.instant('document')}: ${reference ?? ''}`)
      .containerValue('note_list-sv')
      .images(imageList)
      .headBandAttributes(footerAttributes)
      .build();

  }
}
