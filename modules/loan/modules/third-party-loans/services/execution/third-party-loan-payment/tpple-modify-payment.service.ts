import { Injectable } from '@angular/core';
import { ThirdPartyLoansService } from '../../transaction/third-party-loans.service';
import {
  SignatureTrackingService
} from '../../../../../../transaction-manager/modules/signature-tracking/services/transaction/signature-tracking.service';
import { IGetReceiptBodyRequest, IReceiptResponse } from '../../../interfaces/crud/crud-third-party-loans-interface';
import {
  ITPLPEModifyPaymentState,
  ITPLPEModifyPaymentVoucherFromST
} from '../../../interfaces/tplpe-modify-payment.interface';
import {
  StBuildUpdateBodyRequestService
} from '../../../../../../transaction-manager/modules/signature-tracking/services/definition/st-build-update-body-request.service';
import { UtilService } from '../../../../../../../service/common/util.service';
import { concatMap, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ENavigateProtectionParameter,
  ETPLPaymentUrlNavigationCollection
} from '../../../enum/navigate-protection-parameter.enum';
import {
  ParameterManagementService
} from '../../../../../../../service/navegation-parameters/parameter-management.service';
import { Router } from '@angular/router';
import { ITPLPVoucherState } from '../../../interfaces/payment-interface';
import {
  ISTBodyRequestThirdPartyLoanTransaction
} from '../../../../../../transaction-manager/modules/signature-tracking/interfaces/st-transfer.interface';

@Injectable({
  providedIn: 'root'
})
export class TppleModifyPaymentService {
  private dynamicMessage$: Subject<string> = new Subject();

  get message() {
    return this.dynamicMessage$.asObservable();
  }

  constructor(
    private tplPaymentService: ThirdPartyLoansService,
    private transactionService: SignatureTrackingService,
    private stBuildUpdateBodyRequest: StBuildUpdateBodyRequestService,
    private utils: UtilService,
    private parameterManagement: ParameterManagementService,
    private router: Router,
  ) { }

  execute(startupParameters: ITPLPEModifyPaymentState) {
    const { detailTransaction, voucherStructure, loanToPayment, transaction } = startupParameters ?? {};
    this.utils.showLoader();

    this.handleExecute(startupParameters).subscribe({
      next: (response) => {
        this.goToUpdateVoucher({
          date: response?.dateTime,
          reference: response?.reference,
          voucherStructure: voucherStructure as ITPLPVoucherState,
          transaction,
          detailTransaction,
          loanToPayment,
        });
      },
      error: (error: HttpErrorResponse) => {
        if (error?.error?.code === '') {
          const date = error?.error?.dateTime;
          const reference = error?.error?.reference;

          this.goToUpdateVoucher({
            date,
            reference,
            voucherStructure: voucherStructure as ITPLPVoucherState,
            transaction,
            detailTransaction,
            loanToPayment,
          });

          return;
        }

        this.utils.hideLoader();
        this.utils.scrollToTop();
        this.dynamicMessage$.next(error?.error?.message ?? 'signature_tracking:error:modify_transaction');
      }
    });
  }

  private handleExecute(startupParameters: ITPLPEModifyPaymentState) {
    return this.getReceipt(startupParameters)
      .pipe(
        concatMap((receipt) => this.executeUpdate(startupParameters, receipt))
      );
  }

  private getReceipt(startupParameters: ITPLPEModifyPaymentState) {
    const { detailTransaction, voucherStructure, amount } = startupParameters ?? {};

    const receiptBodyRequest: IGetReceiptBodyRequest = {
      product: detailTransaction?.targetProduct,
      subProduct: detailTransaction?.targetSubProduct,
      loan: voucherStructure?.loanIdentifier!,
      currency: voucherStructure?.currency!,
      amount,
    };

    return this.tplPaymentService.getReceipt(receiptBodyRequest);
  }

  private executeUpdate(startupParameters: ITPLPEModifyPaymentState, receipt: IReceiptResponse) {
    const { transaction } = startupParameters ?? {};

    const updateParams = {
      transactionCode: transaction?.reference,
      serviceModify: transaction?.serviceCode,
      data: this.getBodyToUpdateTransaction(startupParameters, receipt),
    };

    return this.transactionService.update(updateParams);
  }

  private getBodyToUpdateTransaction(startupParameters: ITPLPEModifyPaymentState, receipt: IReceiptResponse) {
    const { amount, detailTransaction, selectedSourceAccount, quotasSelected, typePayment } = startupParameters ?? {};

    const requestProperties: ISTBodyRequestThirdPartyLoanTransaction = {
      sourceAccount: selectedSourceAccount,
      targetAccount: null!,
      comment: detailTransaction?.comment,
      amount: this.utils.parseCustomNumber(amount),
      email: detailTransaction?.email,
      detailAccountToUpdate: detailTransaction,
      receiptNumber: receipt?.receiptNumber ?? '',
      quotasSelected,
      typePayment,
    };

    return this.stBuildUpdateBodyRequest.buildBodyToUpdateThirdPartyLoan({ ...requestProperties });
  }

  private  goToUpdateVoucher(parameters: ITPLPEModifyPaymentVoucherFromST) {
    const { date, reference, voucherStructure, transaction, detailTransaction, loanToPayment } = parameters ?? {};


    this.parameterManagement.sendParameters({
      navigateStateParameters: {
        loanToPayment,
        transaction,
        detailTransaction,
        data: voucherStructure,
        date,
        reference,
      },
      navigationProtectedParameter: ENavigateProtectionParameter.VOUCHER_ST_MODIFY_TRANSACTION,
    });

    this.router.navigate([ETPLPaymentUrlNavigationCollection.SIGNATURE_TRACKING_MODIFY_VOUCHER]).finally(() => this.utils.hideLoader());
  }
}
