import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {
  AdfFormatService,
  ConfirmationModalBuilder,
  IConfirmationModal,
  IGroupAttributes,
  IHeadBandAttribute,
  ITableHeader,
  TableHeaderBuilder,
  TableStructuredBuilder
} from '@adf/components';
import {UtilWorkFlowService} from '../../../../../../service/common/util-work-flow.service';
import {UtilService} from '../../../../../../service/common/util.service';
import {
  OtdTransferBaseVoucherModalService
} from '../../../../../transfer/modules/transfer-own/services/definition/base/otd-transfer-base-voucher-modal.service';
import {IBasicAttributeVC} from '../../../../../../models/build.interface';
import {IHeadBandLayout} from '../../../../../../models/util-work-flow.interface';
import {SPPVoucherModalParameters} from '../../../interfaces/pmp-voucher.interface';
import {environment} from '../../../../../../../environments/environment';
import {SPPTableKeys} from '../../../enums/pmp-table-keys.enum';
import {Participant} from "../../../interfaces/pmp-payment-home.interface";

@Injectable({
  providedIn: 'root'
})
export class PmpdVoucherModalService {
  constructor(
    private translate: TranslateService,
    private formatService: AdfFormatService,
    private utilWorkFlow: UtilWorkFlowService,
    private utilService: UtilService,
    private baseVoucherModal: OtdTransferBaseVoucherModalService,
  ) { }

  builderLayoutVoucherModal(voucherModal: SPPVoucherModalParameters): IConfirmationModal {
    const { sourceAccount, date, credits, amount, reference } = voucherModal;
    const dateParsed = this.formatService.getFormatDateTime(date);

    const listGroup: IGroupAttributes[] = [];

    const groupOriginAccount: IGroupAttributes = {
      view: 'v-list',
      attributes: []
    }

    const attributeDate: IBasicAttributeVC = {
      label:'label.statements.operation-date',
      values:[`${dateParsed?.numberFormat ?? ''}`],
      class: 'list-grid'
    }
    groupOriginAccount.attributes.push(this.baseVoucherModal.builderAttributes(attributeDate));

    const attributeProductSourceAccount: IBasicAttributeVC = {
      label: 'label.statements.account-type',
      values: [`${this.utilService.getLabelProduct(sourceAccount?.product)}`],
      class: 'list-grid'
    }
    groupOriginAccount.attributes.push(this.baseVoucherModal.builderAttributes(attributeProductSourceAccount));


    const attributeAccountName: IBasicAttributeVC = {
      label:'ach_name_account',
      values: [`${sourceAccount.name}`],
      class: 'list-grid'
    }
    groupOriginAccount.attributes.push(this.baseVoucherModal.builderAttributes(attributeAccountName));

    const attributeAccountNumber: IBasicAttributeVC = {
      label:'accountNumber',
      values: [`${sourceAccount.account}`],
      class: 'list-grid'
    }
    groupOriginAccount.attributes.push(this.baseVoucherModal.builderAttributes(attributeAccountNumber));

    const attributeCurrency: IBasicAttributeVC = {
      label:'currency',
      values: [`${environment.currency}`],
      class: 'list-grid'
    }
    groupOriginAccount.attributes.push(this.baseVoucherModal.builderAttributes(attributeCurrency));

    const attributeCredits: IBasicAttributeVC = {
      label:'payroll:label_credits',
      values: [`${credits}`],
      class: 'list-grid'
    }
    groupOriginAccount.attributes.push(this.baseVoucherModal.builderAttributes(attributeCredits));

    const rawAmount = this.utilService.parseNumberAsFloat(amount);
    const amountParsed = this.formatService.formatAmount(rawAmount);

    const attributeAmount: IBasicAttributeVC = {
      label: 'total_amount',
      values: [`${this.utilService.geCurrencSymbol(environment.currency)} ${amountParsed}`],
      class: 'list-grid'
    }
    groupOriginAccount.attributes.push(this.baseVoucherModal.builderAttributes(attributeAmount));

    listGroup.push(groupOriginAccount);

    const headBandLayout: IHeadBandLayout = {
      date: dateParsed,
      reference
    };

    let referenceLabel = this.translate.instant('reference');
    let docLabel = this.translate.instant('document');

    const footerAttributes: IHeadBandAttribute[] = this.utilWorkFlow.getHeadBandLayout(headBandLayout);
    const imagesList = this.utilWorkFlow.buildImagesToModal();

    return new ConfirmationModalBuilder()
      .title("payroll:label_voucher_modal")
      .subtitle(`${referenceLabel}: ${reference}`)
      .attributeList(listGroup)
      .view("v-list")
      .containerTitle(`${docLabel}: ${reference}`)
      .containerValue('note_list-sv')
      .images(imagesList)
      .headBandAttributes(footerAttributes)
      .build();
  }

  tableDefinition(registers: Participant[]) {
    const tableHeaders: ITableHeader[] = [];

    const columnAccount = new TableHeaderBuilder()
      .label('account')
      .key(SPPTableKeys.ACCOUNT)
      .isActive(true)
      .build();

    const columnName = new TableHeaderBuilder()
      .label('ach_name_account')
      .key(SPPTableKeys.NAME)
      .build();


    const columnAmount = new TableHeaderBuilder()
      .label('label.statements.amount')
      .key(SPPTableKeys.AMOUNT)
      .build();

    tableHeaders.push(columnAccount);
    tableHeaders.push(columnName);
    tableHeaders.push(columnAmount);

    const registersParsed = registers.map( (account) => {
      return {
        ...account,
        [SPPTableKeys.AMOUNT]: `${environment.currency} ${this.formatService.formatAmount(account.targetAmount || 0)}`
      }
    });

    return new TableStructuredBuilder()
      .head(tableHeaders)
      .body(registersParsed)
      .build();
  }
}
