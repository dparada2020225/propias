import { Injectable } from '@angular/core';
import {
  IOTEChangeAccountCreditResponce,
  IOTEChangeAccountDebitedResponce,
  IOTEInitStep1Request,
  IOTEInitStep1Responce,
  IOTEVoucherLayoutRenponce,
  IOTEVoucherLayoutRequest,
} from '../../interfaces/own-transfer-execution.interface';
import { OteTransferFormService } from './ote-transfer-form.service';
import { OteTransferVoucherService } from './ote-transfer-voucher.service';

@Injectable({
  providedIn: 'root',
})
export class OteTransferManagerService {
  constructor(private transferForm: OteTransferFormService, private transferVoucher: OteTransferVoucherService) {}

  formScreenBuilderStep1(startupParameters: IOTEInitStep1Request): IOTEInitStep1Responce {
    return this.transferForm.formScreenBuilder(startupParameters);
  }

  changeAccountDebitedStep1(account: string): IOTEChangeAccountDebitedResponce {
    return this.transferForm.changeAccountDebited(account);
  }

  changeAccountAccreditStep1(account?: string): IOTEChangeAccountCreditResponce {
    return this.transferForm.changeAccountAccredit(account);
  }

  voucherLayoutsMainBuilderStep3(builderParameters: IOTEVoucherLayoutRequest): IOTEVoucherLayoutRenponce {
    return this.transferVoucher.voucherLayoutsMainBuilder(builderParameters);
  }
}
