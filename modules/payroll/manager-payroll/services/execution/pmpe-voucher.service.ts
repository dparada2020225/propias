import {Injectable} from '@angular/core';
import {SPPESignatureTrackingParameters, SPPEVoucherParameters} from '../../interfaces/pmp-voucher.interface';
import {IHeadBandLayoutConfirm} from '../../../../../models/util-work-flow.interface';
import {UtilWorkFlowService} from '../../../../../service/common/util-work-flow.service';
import {AdfFormatService} from '@adf/components';
import {PmpdTableService} from '../definition/payment/pmpd-table.service';
import {PmpdVoucherService} from '../definition/payment/pmpd-voucher.service';
import {PmpdVoucherModalService} from '../definition/payment/pmpd-voucher-modal.service';
import {TranslateService} from '@ngx-translate/core';
import {UtilService} from "../../../../../service/common/util.service";

@Injectable({
  providedIn: 'root'
})
export class PmpeVoucherService {

  constructor(
    private adfFormatService: AdfFormatService,
    private utilWorkFlow: UtilWorkFlowService,
    private tableDefinition: PmpdTableService,
    private voucherDefinition: PmpdVoucherService,
    private proofVoucherDefinition: PmpdVoucherModalService,
    private translate: TranslateService,
    private util: UtilService,
  ) { }


  buildDefaultVoucher(parameters: SPPEVoucherParameters) {
    return {
      voucherLayout: this.buildDefaultVoucherLayout(parameters),
      pdfVoucherLayout: this.buildPdfLayout(parameters),
      headBandLayout: this.buildHeadBandLayout(parameters),
      mainTableLayout: this.buildTableLayout(parameters.registers),
      ...this.buildModalLayout(parameters),
    }
  }

  buildDefaultVoucherForSignatureTracking(parameters: SPPEVoucherParameters) {
    return {
      voucherLayout: this.buildDefaultVoucherLayout(parameters),
      mainTableLayout: this.buildTableLayout(parameters.registers),
      ...this.buildModalLayout(parameters),
      pdfVoucherLayout: this.buildPdfLayout(parameters),
    }
  }

  buildSignatureTrackingVoucherLayout(parameters: SPPESignatureTrackingParameters) {
    return {
      voucherLayout: this.buildSignatureTrackingVoucher(parameters),
      mainTableLayout: this.buildTableLayout(parameters.registers),
    }
  }

  private buildTableLayout(registers: Array<any>) {
    return this.tableDefinition.buildTable(registers);
  }

  private buildDefaultVoucherLayout(parameters: SPPEVoucherParameters) {
    const {  credits, amount, sourceAccount, registers } = parameters;

    const date = registers.every(account => account.dateCreation === registers[0].dateCreation) ? registers[0].dateCreation : this.util.getDate();


    return this.voucherDefinition.buildConfirmationVoucher({
      title: 'payroll:title',
      subtitle: 'payroll:label_subtitle',
      credits,
      amount,
      sourceAccount,
      date,
    })

  }

  private buildHeadBandLayout(parameters: SPPEVoucherParameters) {
    const { date, reference, sourceAccount } = parameters
    const dateParse = this.adfFormatService.getFormatDateTime(date);

    const headBandLayoutConfirm: IHeadBandLayoutConfirm = {
      reference,
      date: dateParse,
      numberAccount: sourceAccount.account
    };

    return this.utilWorkFlow.getHeadBandLayoutConfirm(headBandLayoutConfirm);
  }

  private buildModalLayout(parameters: SPPEVoucherParameters) {
    const { date, credits, amount, sourceAccount, reference, registers } = parameters;
    const modalLayout =  this.proofVoucherDefinition.builderLayoutVoucherModal({
      sourceAccount,
      date,
      credits,
      amount,
      reference,
    });

    const tableModalLayout  = this.proofVoucherDefinition.tableDefinition(registers)

    return {
      modalLayout,
      tableModalLayout
    }
  }

  private buildPdfLayout(parameters: SPPEVoucherParameters) {
    const { date, credits, amount, sourceAccount, reference, registers } = parameters;

    const label = this.translate.instant('pdf:label_payroll');

    return  {
      registers,
      sourceAccount,
      date: this.adfFormatService.getFormatDateTime(date),
      credits,
      amount,
      reference,
      label
    };
  }


  /* ========================================*/

  private buildSignatureTrackingVoucher(parameters: SPPESignatureTrackingParameters) {
    const { credits, amount, sourceAccount, registers } = parameters;

    return this.voucherDefinition.buildVoucherForSignatureTracking({
      credits,
      amount,
      sourceAccount,
      registers,
    })

  }

}
