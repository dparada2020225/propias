import {
  AdfFormatService,
  ConfirmationModalBuilder,
  IGroupAttributes,
  IHeadBandAttribute,
} from '@adf/components';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IHeadBandLayout, IUserDataModalPdf } from 'src/app/models/util-work-flow.interface';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { UtilService } from 'src/app/service/common/util.service';
import { IThirdTransferModal } from '../../../../interfaces/third-transfer.interface';
import { TtdBaseTransferService } from '../base/ttd-base-transfer.service';
import { IBasicAttributeVC } from 'src/app/models/build.interface';

@Injectable({
  providedIn: 'root'
})
export class TtdTransferModalService {

  constructor(
    private translate: TranslateService,
    private util: UtilService,
    private utilWorkFlow: UtilWorkFlowService,
    private formatService: AdfFormatService,
    private base: TtdBaseTransferService
  ) { }

  buildModalLayout(modalProps: IThirdTransferModal) {

    const dateTime = modalProps?.dateTime;
    const accountCredit = modalProps?.accountCredit;
    const accountDebited = modalProps?.accountDebited;
    const formValues = modalProps?.formValues;
    const reference = modalProps?.reference;

    const comment = formValues?.comment;
    const amount = formValues?.amount;

    const listGroup: IGroupAttributes[] = [];

    //====================================================== Start groupOriginAccount ===============================================================

    const groupOriginAccount: IGroupAttributes = {
      view: 'v-list',
      attributes: [],
    };

    const originAccountAttributes: IBasicAttributeVC = {
      label: 'root-account',
      class: 'head-columns'
    }

    const operationDateAttribute: IBasicAttributeVC = {
      label: 'operation-date',
      values: [`${dateTime?.numberFormat ?? ''} ${dateTime?.hourSuffix ?? ''}`],
      class: 'content-voucher list-grid'
    }

    const attributeTypeAccount: IBasicAttributeVC = {
      label: 'type_account',
      values: [this.util.getLabelProduct(accountDebited?.product ?? 0)],
      class: 'content-voucher list-grid'
    }

    const userDataDebited: IUserDataModalPdf = {
      account: accountDebited?.account,
      name: accountDebited?.name
    };

    const userDebited = this.utilWorkFlow.getUserDataModalPdf(userDataDebited);

    const attributeAccountDebited: IBasicAttributeVC = {
      label: 'account_debited_modal',
      values: [userDebited],
      class: 'content-voucher list-grid'
    }

    const attributeAmountDebited: IBasicAttributeVC = {
      label: 'amount-debited',
      class: 'lastPropertyCredit list-grid',
      values: [`${this.util.geCurrencSymbol(accountDebited?.currency ?? '')} ${this.formatService.formatAmount(amount ?? '')}`]
    }

    groupOriginAccount.attributes.push(this.base.builderDataReading(originAccountAttributes));
    groupOriginAccount.attributes.push(this.base.builderDataReading(operationDateAttribute));
    groupOriginAccount.attributes.push(this.base.builderDataReading(attributeTypeAccount));
    groupOriginAccount.attributes.push(this.base.builderDataReading(attributeAccountDebited));
    groupOriginAccount.attributes.push(this.base.builderDataReading(attributeAmountDebited));

    listGroup.push(groupOriginAccount);

    //====================================================== End groupOriginAccount =================================================================

    //====================================================== Start groupDestinationAccount ===============================================================

    const groupDestinationAccount: IGroupAttributes = {
      view: 'v-list',
      attributes: [],
    };

    const destinationAccountAttributes: IBasicAttributeVC = {
      label: 'destination-account',
      class: 'head-columns'
    }

    const userDataCredit: IUserDataModalPdf = {
      account: accountCredit?.account,
      name: accountCredit?.name
    };

    const userCredit = this.utilWorkFlow.getUserDataModalPdf(userDataCredit);

    const attributeCreditAccount: IBasicAttributeVC = {
      label: 'credited_account',
      values: [userCredit],
      class: 'content-voucher list-grid'
    }

    const attributeCreditTypeAccount: IBasicAttributeVC = {
      label: 'type_account',
      values: [`${this.util.getLabelProduct(accountCredit?.type ? Number(accountCredit?.type ?? '00') : Number(accountCredit?.product ?? '00'))}`],
      class: 'content-voucher list-grid'
    }

    groupDestinationAccount.attributes.push(this.base.builderDataReading(destinationAccountAttributes));
    groupDestinationAccount.attributes.push(this.base.builderDataReading(attributeCreditAccount));
    groupDestinationAccount.attributes.push(this.base.builderDataReading(attributeCreditTypeAccount));

    if (comment) {

      const attributeComment: IBasicAttributeVC = {
        label: 'comment',
        class: 'lastPropertyAccredit list-grid',
        values: [comment ?? '']
      }

      groupDestinationAccount.attributes.push(this.base.builderDataReading(attributeComment));
    }

    listGroup.push(groupDestinationAccount);

    //====================================================== End groupDestinationAccount ===============================================================

    //====================================================== Start footerAttributes ===============================================================


    const headBandLayout: IHeadBandLayout = {
      date: dateTime,
      reference,
    };

    const footerAttributes: IHeadBandAttribute[] = this.utilWorkFlow.getHeadBandLayout(headBandLayout);
    const imageList = this.utilWorkFlow.buildImagesToModal();

    return new ConfirmationModalBuilder()
      .title('transfers-third-title')
      .subtitle(`No. ${reference ?? ''}`)
      .attributeList(listGroup)
      .view('v-list')
      .containerTitle(`${this.translate.instant('document')}: ${reference ?? ''}`)
      .containerValue('note_list')
      .images(imageList)
      .headBandAttributes(footerAttributes)
      .build();
  }

}
