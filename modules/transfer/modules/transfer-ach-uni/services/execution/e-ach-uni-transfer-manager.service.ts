import { Injectable } from '@angular/core';
import { AchUniTransferInitForm, IAchUniVoucherLayout } from '../../interfaces/ach-uni-definition';
import { EachUniTransferFormService } from './e-ach-uni-transfer-form.service';
import { EachUniTransferVoucherService } from './e-ach-uni-transfer-voucher.service';

@Injectable({
  providedIn: 'root'
})
export class EachUniTransferManagerService {

  constructor(
    private transferExecutionForm: EachUniTransferFormService,
    private voucherLayoutScreen: EachUniTransferVoucherService,
  ) { }

  buildFormScreenBuilder(startupParameters: AchUniTransferInitForm) {
    return this.transferExecutionForm.formScreenBuilder(startupParameters);
  }

  handleChangeDebitedAccount(accountNumber: string) {
    return this.transferExecutionForm.changeAccountDebited(accountNumber);
  }

  handleChangeDestinationAccount(accountNumber: string) {
    return this.transferExecutionForm.changeAccountDestination(accountNumber);
  }

  handleChangePurpose(codePurpose: string) {
    return this.transferExecutionForm.changePurpose(codePurpose);
  }

  handleChangeBank(codeBank: string) {
    return this.transferExecutionForm.changeBank(codeBank);
  }

  handleChangePurposeList(){
    return this.transferExecutionForm.setCustomOptionListPurpose();
  }

  buildVoucherScreen(startupParameters: IAchUniVoucherLayout) {
    return this.voucherLayoutScreen.voucherLayoutMainBuilder(startupParameters);
  }

  // handleChangeDebitedAccount(accountNumber: string) {
  //   return this.transferExecutionForm.changeAccountDebited(accountNumber);
  // }

  // buildVoucherScreen(startupParameters: IATEVoucherLayout) {
  //   return this.voucherLayoutScreen.voucherLayoutMainBuilder(startupParameters);
  // }

  // changeTargetAccount(accountNumber: string) {
  //   return this.transferExecutionForm.changeTargetAccount(accountNumber);
  // }

}
