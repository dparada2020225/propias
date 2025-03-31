import {Injectable} from '@angular/core';
import {
  EOwnTransferProtectedNavigation,
  EOwnTransferUrlNavigationCollection
} from '../../enum/navigation-parameter.enum';
import {EOwnTransferTypeTransaction} from '../../enum/own-transfer-control-name.enum';
import {IOwnTransferExecuteProperties, IOwnTransferState} from '../../interfaces/own-transfer.interface';
import {HttpStatusCode} from '../../../../../../enums/http-status-code.enum';
import {catchError, map} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, of} from 'rxjs';
import {IResponseOwnTransfers} from '../../interfaces/own-transfer-respoce.interface';
import {ModalTokenComponent} from '../../../../../../view/private/token/modal-token/modal-token.component';
import {environment} from '../../../../../../../environments/environment';
import {Router} from '@angular/router';
import {ParameterManagementService} from '../../../../../../service/navegation-parameters/parameter-management.service';
import {OwnTransferService} from '../transaction/own-transfer.service';
import {OtdTransferVoucherManagerService} from '../definition/manager/otd-transfer-voucher-manager.service';
import {UtilService} from '../../../../../../service/common/util.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HandleTokenRequestService} from '../../../../../../service/common/handle-token-request.service';
import {UtilTransactionService} from '../../../../../../service/common/util-transaction.service';
import {getTypeTransaction} from '../../../../../../enums/transaction-header.enum';
import {
  IOTExecuteTransaction,
  TOwnTransactionResponse,
  TYPE_OWN_TRANSFERENCE
} from '../../interfaces/own-transfer-execution.interface';

@Injectable({
  providedIn: 'root'
})
export class OteExecuteTransactionService {
  private formValues: any | null = null;
  private sourceAccount: any | null = null;
  private targetAccount: any | null = null;

  private messageSubject = new BehaviorSubject<string | null>(null);
  message$ = this.messageSubject.asObservable();

  get isTokenRequired() {
    return this.handleTokenRequest.isTokenRequired();
  }

  constructor(
    private utilTransaction: UtilTransactionService,
    private handleTokenRequest: HandleTokenRequestService,
    private modalService: NgbModal,
    private util: UtilService,
    private OtdTransferVoucherManager: OtdTransferVoucherManagerService,
    private ownTransferService: OwnTransferService,
    private parameterManagement: ParameterManagementService,
    private router: Router,
  ) {
    this.resetState();
  }

  execute(parameters: IOTExecuteTransaction) {
    const {formValues, sourceAccount, targetAccount} = parameters;

    this.formValues = formValues;
    this.sourceAccount = sourceAccount;
    this.targetAccount = targetAccount;

    this.validateIsTokenRequiredModal();
  }

  private validateIsTokenRequiredModal() {
    if (this.isTokenRequired) {
      this.openTokenModal();
      return;
    }

    this.executeTransaction().subscribe({
      next: (response) => {
        this.handleTransactionResponse(response);
      },
    });
  }

  private openTokenModal() {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} own-modal sm-600`,
      size: 'lg',
    });

    modal.componentInstance.typeTransaction = getTypeTransaction(TYPE_OWN_TRANSFERENCE);
    modal.componentInstance.executeService = this.executeTransaction.bind(this);

    modal.result
      .then((result) => {
        if (!result) {
          return;
        }

        this.handleTransactionResponse(result);
      })
      .catch((error) => error);
  }

  private executeTransaction(token?: string) {
    this.util.showLoader();

    const data: IOwnTransferExecuteProperties = {
      accountToCredit: this.targetAccount,
      accountToDebit: this.sourceAccount,
      formValues: this.formValues,
    };

    const dataToTransfer = this.OtdTransferVoucherManager.buildAccountToExecuteTransferStep3(data);

    return this.ownTransferService.ownTransfer({
      bodyRequest: dataToTransfer,
      isTokenRequired: this.isTokenRequired,
      token: token,
    })
      .pipe(
        map(response => this.utilTransaction.handleResponseTransaction<IResponseOwnTransfers>(response)),
        catchError((error: HttpErrorResponse) => of(this.utilTransaction.handleErrorTransaction<IResponseOwnTransfers>(error)))
      );
  }

  private handleTransactionResponse(response: TOwnTransactionResponse) {
    if (response.status === HttpStatusCode.INVALID_TOKEN) {
      this.util.hidePulseLoader();
      this.util.hideLoader();
      return;
    }

    if (response.status !== HttpStatusCode.SUCCESS_TRANSACTION && Number(response?.status) !== Number(HttpStatusCode.SIGNATURE_TRACKING)) {
      this.util.hidePulseLoader();
      this.util.hideLoader();
      this.messageSubject.next(response.message as string);
      this.util.scrollToTop();
      return;
    }

    this.util.showLoader();

    if (Number(response.status) == Number(HttpStatusCode.SIGNATURE_TRACKING)) {
      this.goToVoucherScreenSignatureTracking(response.message as string);
      return;
    }

    this.goToVoucherScreenDefaultTransaction(response);
  }

  private goToVoucherScreenDefaultTransaction(transactionResponse: TOwnTransactionResponse) {
    const {data} = transactionResponse;

    this.parameterManagement.sendParameters({
      navigationProtectedParameter: EOwnTransferProtectedNavigation.VOUCHER,
      navigateStateParameters: {
        debitedAccount: this.sourceAccount,
        accreditAccount: this.targetAccount,
        formValues: this.formValues,
        typeTransaction: EOwnTransferTypeTransaction.DEFAULT,
        transactionResponse: data,
      } as IOwnTransferState,
    });

    this.router.navigate([EOwnTransferUrlNavigationCollection.DEFAULT_VOUCHER]).finally(() => this.util.hideLoader());
  }

  private goToVoucherScreenSignatureTracking(message: string) {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: EOwnTransferProtectedNavigation.VOUCHER,
      navigateStateParameters: {
        debitedAccount: this.sourceAccount,
        accreditAccount: this.targetAccount,
        formValues: this.formValues,
        transactionResponse: null,
        typeTransaction: EOwnTransferTypeTransaction.SIGNATURE_TRACKING,
        message,
      },
    });

    this.router.navigate([EOwnTransferUrlNavigationCollection.DEFAULT_VOUCHER]).finally(() => this.util.hideLoader());
  }

  private resetState() {
    this.formValues = null;
    this.sourceAccount = null;
    this.targetAccount = null;
  }

  public resetMessage() {
    this.messageSubject.next(null);
  }
}
