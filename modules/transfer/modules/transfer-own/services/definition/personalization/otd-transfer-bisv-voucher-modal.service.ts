import {
  AdfFormatService,
  ConfirmationModalBuilder,
  IConfirmationModal,
  IGroupAttributes,
  IHeadBandAttribute,
} from '@adf/components';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IOTDVoucherModal } from '../../../interfaces/own-transfer-definition.interface';
import { OtdTransferBaseVoucherModalService } from '../base/otd-transfer-base-voucher-modal.service';
import { IBasicAttributeVC } from 'src/app/models/build.interface';
import { IHeadBandLayout, IUserDataModalPdf } from 'src/app/models/util-work-flow.interface';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { UtilService } from 'src/app/service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class OtdTransferBisvVoucherModalService {

  constructor(
    private translate: TranslateService,
    private formatService: AdfFormatService,
    private utilWorkFlow: UtilWorkFlowService,
    private utilService: UtilService,
    private baseVoucherModal: OtdTransferBaseVoucherModalService
  ) { }

  builderLayoutVoucherModal(voucherModal: IOTDVoucherModal): IConfirmationModal {
    const accountDebited = voucherModal?.accountDebited;
    const accountAccredit = voucherModal?.accountAccredit;
    const dateTime = voucherModal?.dateTime;
    const amount = voucherModal?.amount;
    const reference = voucherModal?.reference;
    const comment = voucherModal?.comment;

    const listGroup: IGroupAttributes[] = []

    const groupOriginAccount: IGroupAttributes = {
      view: 'v-list',
      attributes: []
    }
    const groupDestinationAccount: IGroupAttributes = {
      view: 'v-list',
      attributes: []
    };

    const originAccountAttributes: IBasicAttributeVC = {
      label:'account_debited_modal',
      class: "head-columns"
    }

    groupOriginAccount.attributes.push(this.baseVoucherModal.builderAttributes(originAccountAttributes));


    const operationDateAttribute: IBasicAttributeVC = {
      label: 'operation-date',
      values:[`${dateTime?.numberFormat ?? ''}`],
      class: 'content-voucher list-grid'
    }

    groupOriginAccount.attributes.push(this.baseVoucherModal.builderAttributes(operationDateAttribute));


    const typeAccount: IBasicAttributeVC = {
      label:'type_account',
      values: [`${this.utilService.getLabelProduct(accountDebited?.product)}`],
      class: 'content-voucher list-grid'
    }

    groupOriginAccount.attributes.push(this.baseVoucherModal.builderAttributes(typeAccount));

    const userDataDebited: IUserDataModalPdf = {
      account: accountDebited?.account,
      name: accountDebited?.name
    };

    const userDebited = this.utilWorkFlow.getUserDataModalPdf(userDataDebited);

    const accountDebitAttribute: IBasicAttributeVC = {
      label: 'account_debited_modal',
      values: [userDebited],
      class: 'content-voucher list-grid'
    }

    groupOriginAccount.attributes.push(this.baseVoucherModal.builderAttributes(accountDebitAttribute));


    const amountDebitAttribute: IBasicAttributeVC = {
      label: 'amount',
      values: [`${this.utilService.geCurrencSymbol(accountDebited?.currency ?? '')} ${this.formatService.formatAmount(amount ?? '')}`],
      class: 'lastPropertyCredit list-grid'
    }

    groupOriginAccount.attributes.push(this.baseVoucherModal.builderAttributes(amountDebitAttribute));


    listGroup.push(groupOriginAccount);

    const destinationAccountAttributes: IBasicAttributeVC = {
      label: 'credited-account',
      class: "head-columns"
    }

    groupDestinationAccount.attributes.push(this.baseVoucherModal.builderAttributes(destinationAccountAttributes));

    const typeAccountAttributes: IBasicAttributeVC = {
      label: 'type_account',
      values: [`${this.utilService.getLabelProduct(accountAccredit?.product)}`],
      class: ' content-voucher list-grid'
    }

    groupDestinationAccount.attributes.push(this.baseVoucherModal.builderAttributes(typeAccountAttributes));

    const userDataCredit: IUserDataModalPdf = {
      account: accountAccredit?.account,
      name: accountAccredit?.name
    };

    const userCredit = this.utilWorkFlow.getUserDataModalPdf(userDataCredit);

    const amountCreditAttribute: IBasicAttributeVC = {
      label: 'credited-account',
      values: [userCredit],
      class: 'content-voucher list-grid'
    }
    groupDestinationAccount.attributes.push(this.baseVoucherModal.builderAttributes(amountCreditAttribute));



    if (comment !== '') {
      const commentAttributeModalBISVProfile: IBasicAttributeVC = {
        label: 'comment',
        values: [comment ?? ''],
        class: 'list-grid lastPropertyAccredit'
      }
      groupDestinationAccount.attributes.push(this.baseVoucherModal.builderAttributes(commentAttributeModalBISVProfile));
    }

    listGroup.push(groupDestinationAccount);

    const headBandLayout: IHeadBandLayout = {
      date: dateTime,
      reference: reference
    };

    const footerAttributes: IHeadBandAttribute[] = this.utilWorkFlow.getHeadBandLayout(headBandLayout);
    const imagesList = this.utilWorkFlow.buildImagesToModal();



    return new ConfirmationModalBuilder()
      .title("voucher-transfer_own-modal")
      .subtitle(`${this.translate.instant('reference')}: ${reference}`)
      .attributeList(listGroup)
      .view("v-list")
      .containerTitle(`${this.translate.instant('document')}: ${reference}`)
      .containerValue('note_list-sv')
      .images(imagesList)
      .headBandAttributes(footerAttributes)
      .build();
  }
}
