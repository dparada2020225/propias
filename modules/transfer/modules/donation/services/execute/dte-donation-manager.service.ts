import { Injectable } from '@angular/core';
import { IDTEInitStep1, IDTEInitStep1Response } from '../../interfaces/donation-execution.interface';
import { DteDonationFormService } from './dte-donation-form.service';
import { ILayout } from '@adf/components';
import { IDonationVoucherBuilder, IDTDVoucherBuilder } from '../../interfaces/donation-definition.interface';
import { DteDonationVoucherService } from './dte-donation-voucher.service';

@Injectable({
  providedIn: 'root'
})
export class DteDonationManagerService {

  constructor(
    private transferForm: DteDonationFormService,
    private transferVoucher: DteDonationVoucherService,
  ) { }

  formScreenBuilderStep1(startupParameters: IDTEInitStep1): IDTEInitStep1Response {
    return this.transferForm.formScreenBuilder(startupParameters)
  }

  changeAccountDebitedStep1(account: string): ILayout | undefined {
    return this.transferForm.changeAccountDebited(account);
  }

  changeAccountFundationStep1(account?: string): ILayout | undefined {
    return this.transferForm.changeAccountFundation(account);
  }

  voucherLayoutsMainBuilderStep3(builderParameters: IDTDVoucherBuilder, isSignatureTrackingUpdate?: boolean): IDonationVoucherBuilder {
    return this.transferVoucher.mainBuilderVoucherLayout(builderParameters, isSignatureTrackingUpdate);
  }
}
