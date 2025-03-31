import { Injectable } from '@angular/core';
import { AteTransferFormService } from './ate-transfer-form.service';
import { AteTransferVoucherService } from './ate-transfer-voucher.service';
import { IATEInitForm, IATEVoucherLayout } from '../../interfaces/ach-transfer-definition.inteface';

@Injectable({
  providedIn: 'root'
})
export class AteTransferManagerService {

  constructor(
    private transferExecutionForm: AteTransferFormService,
    private voucherLayoutScreen: AteTransferVoucherService,
  ) { }

  buildFormScreenBuilder(startupParameters: IATEInitForm) {
    return this.transferExecutionForm.formScreenBuilder(startupParameters);
  }

  handleChangeDebitedAccount(accountNumber: string) {
    return this.transferExecutionForm.changeAccountDebited(accountNumber);
  }

  buildVoucherScreen(startupParameters: IATEVoucherLayout) {
    return this.voucherLayoutScreen.voucherLayoutMainBuilder(startupParameters);
  }

  changeTargetAccount(accountNumber: string) {
    return this.transferExecutionForm.changeTargetAccount(accountNumber);
  }
}
