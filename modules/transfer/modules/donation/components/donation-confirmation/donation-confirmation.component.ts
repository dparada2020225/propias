import { Component, OnInit } from '@angular/core';
import {
  EDonationNavigationProtected,
  EDonationTransferUrlNavigationCollection,
  EDonationTypeTransaction,
  EDonationViewMode
} from '../../enum/donation.enum';
import { IDonationState } from '../../interfaces/donation.state.interface';
import { IDonationAccount, IDonationFormValues } from '../../interfaces/donation-account.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { IDonationDataExecute, IDTDConfirmationRequest } from '../../interfaces/donation-definition.interface';
import { HttpStatusCode } from '../../../../../../enums/http-status-code.enum';
import { ERequestTypeTransaction } from 'src/app/enums/transaction-header.enum';
import { environment } from 'src/environments/environment';
import { ModalTokenComponent } from 'src/app/view/private/token/modal-token/modal-token.component';
import { TTransactionDonationResponse } from '../../interfaces/donation-execution.interface';
import { IExecuteTransactionWithToken, IExecuteTransactionWithTokenFailedResponse } from 'src/app/models/token-service-response.interface';
import { Subject } from 'rxjs/internal/Subject';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from '../../../../../../service/common/util.service';
import { DonationService } from '../../services/transaction/donation.service';
import { DtdTransferManagerService } from '../../services/definition/dtd-transfer-manager.service';
import {
  StBuildUpdateBodyRequestService,
} from '../../../../../transaction-manager/modules/signature-tracking/services/definition/st-build-update-body-request.service';
import {
  SignatureTrackingService
} from '../../../../../transaction-manager/modules/signature-tracking/services/transaction/signature-tracking.service';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { IAccount } from '../../../../../../models/account.inteface';
import { IDataReading } from '@adf/components';
import { Subscription } from 'rxjs';
import {
  ISTBodyRequestDonationTransaction
} from '../../../../../transaction-manager/modules/signature-tracking/interfaces/st-transfer.interface';
import {
  ITransactionManagerAccountDetail
} from '../../../../../transaction-manager/interfaces/transaction-manger.interface';

@Component({
  selector: 'byte-donation-confirmation',
  templateUrl: './donation-confirmation.component.html',
  styleUrls: ['./donation-confirmation.component.scss']
})
export class DonationConfirmationComponent implements OnInit {
  fundationAccountSelected: IDonationAccount | null = null;
  debitedAccountSelected: IAccount | null = null;
  formValues!: IDonationFormValues;
  voucherLayout!: IDataReading;

  typeAlert: string | null = null;
  messageAlert: string | null = null;
  view: EDonationViewMode = EDonationViewMode.DEFAULT;
  routerSubscription!: Subscription;


  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private router: Router,
    private util: UtilService,
    private location: Location,
    private modalService: NgbModal,
    private donationService: DonationService,
    private parameterManagement: ParameterManagementService,
    private donationDefinitionManager: DtdTransferManagerService,
    private activatedRoute: ActivatedRoute,
    private stBuildUpdateBodyRequest: StBuildUpdateBodyRequestService,
    private stTransactionService: SignatureTrackingService,

  ) {
    this.routerSubscription = this.router.events.subscribe((event: any) => {
      if (event.navigationTrigger === 'popstate' && this.view === EDonationViewMode.SIGNATURE_TRACKING) {
        this.resetStorage(EDonationNavigationProtected.SIGNATURE_TRACKING_HOME);
      }
    });

  }

  ngOnInit(): void {
    const donationState: IDonationState = this.parameterManagement.getParameter('navigateStateParameters');

    this.debitedAccountSelected = donationState?.debitedAccount;
    this.fundationAccountSelected = donationState?.fundationAccount;
    this.formValues = donationState?.formValues;
    this.view = this.activatedRoute.snapshot.data['view'];

    this.builderVoucherLayout();
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  builderVoucherLayout() {
    if (this.view === EDonationViewMode.SIGNATURE_TRACKING) {
      this.buildSignatureTrackingVoucher();
      return;
    }

    this.buildSampleVoucher();
  }

  nextStep() {
    if (this.view === EDonationViewMode.SIGNATURE_TRACKING) {
      this.handleExecuteModifyTransaction();
      return;
    }

    this.validateIsTokenRequired();
  }

  lastStep() {
    if (this.view === EDonationViewMode.SIGNATURE_TRACKING) {
      this.resetStorage(EDonationNavigationProtected.SIGNATURE_TRACKING_HOME);
      this.location.back();
      return;
    }

    this.resetStorage();
    this.location.back();
  }

  /* ================================================ DEFAULT TRANSACTION ================================================*/

  buildSampleVoucher() {
    const confirm: IDTDConfirmationRequest = {
      title: 'donation-title',
      subtitle: 'donations_confirmation',
      accountDebited: this.debitedAccountSelected as IAccount,
      fundationAccount: this.fundationAccountSelected as IDonationAccount,
      amount: this.formValues?.amount as any,
    };

    this.voucherLayout = this.donationDefinitionManager.builderLayoutConfirmationStep3({ ...confirm });

  }

  handlerExecuteTransfer(tokenValue?: string | null) {
    this.util.showLoader();
    const isTokenRequired = this.parameterManagement.getParameter('isTokenRequired');
    const serviceResponse: Subject<TTransactionDonationResponse> = new Subject();
    const obs = serviceResponse.asObservable();

    const dataToExecuteDonation: IDonationDataExecute = {
      fundationAccount: this.fundationAccountSelected as IDonationAccount,
      debitedAccount: this.debitedAccountSelected as IAccount,
      formValues: this.formValues,
    };

    const data = this.donationDefinitionManager.buildAccountToExecuteDonationStep3({ ...dataToExecuteDonation });

    this.donationService.donationTransfer(data, isTokenRequired, tokenValue as string)
      .subscribe({
        next: (response) => {
          serviceResponse.next({
            status: HttpStatusCode.SUCCESS_TRANSACTION,
            data: response,
          } as IExecuteTransactionWithToken);
        },
        error: (error: HttpErrorResponse) => {
          if ((error?.error && error?.error?.status || error && error?.status) === HttpStatusCode.INVALID_TOKEN) {
            this.util.hideLoader();
            serviceResponse.next({
              status: HttpStatusCode.INVALID_TOKEN,
              message: error?.error?.message,
              error: error?.error,
            } as IExecuteTransactionWithTokenFailedResponse);

            return;
          }

          if (error?.error?.code === HttpStatusCode.SIGNATURE_TRACKING) {
            serviceResponse.next({
              status: HttpStatusCode.SIGNATURE_TRACKING,
              data: null,
              message: error?.error?.message,
            } as IExecuteTransactionWithToken);

            return;
          }

          this.util.hideLoader();
          serviceResponse.next({
            status: error?.error?.status || error?.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: error?.error?.message || error?.message || 'error-internal-server',
            error: error?.error || error,
          } as IExecuteTransactionWithTokenFailedResponse);
        }
      });

    return obs;
  }

  validateIsTokenRequired() {
    const isTokenRequired = this.parameterManagement.getParameter('isTokenRequired');

    if (isTokenRequired) {
      this.openTokenModal();
      return;
    }

    this.handlerExecuteTransfer(null)
      .subscribe(response => {
        this.handleExecuteTransactionResponse(response);
      });

  }

  handleExecuteTransactionResponse(transactionResponse: TTransactionDonationResponse) {
    if (transactionResponse?.status !== HttpStatusCode.SUCCESS_TRANSACTION && Number(transactionResponse?.status) !== Number(+HttpStatusCode.SIGNATURE_TRACKING)) {
      this.showAlert('error', transactionResponse?.message ?? 'error:donation_execute_transaction');
      this.util.hideLoader();
      this.scrollToTop();
      return;
    }

    this.saveDataToDefaultTransaction(transactionResponse);
    this.goToConfirmation();
  }

  saveDataToDefaultTransaction(transactionResponse: TTransactionDonationResponse) {
    const { message, data, status } = transactionResponse ?? {};

    const isSignatureTrackingType = Number(status) === Number(HttpStatusCode.SIGNATURE_TRACKING);

    this.parameterManagement.sendParameters({
      navigationProtectedParameter: EDonationNavigationProtected.VOUCHER,
      navigateStateParameters: {
        debitedAccount: this.debitedAccountSelected,
        fundationAccount: this.fundationAccountSelected,
        formValues: this.formValues,
        transactionResponse: data ? data : null,
        message: message ? message : null,
        typeTransaction: isSignatureTrackingType ? EDonationTypeTransaction.SIGNATURE_TRACKING : EDonationTypeTransaction.DEFAULT,
      } as IDonationState
    });
  }

  goToConfirmation() {
    this.util.showLoader();
    this.router.navigate([EDonationTransferUrlNavigationCollection.DEFAULT_VOUCHER]).finally(() => this.util.hideLoader());
  }

  openTokenModal() {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} sm-600`,
      size: 'lg',
    });

    modal.dismissed.subscribe(() => {
      return;
    });


    modal.componentInstance.tokenType = this.util.getTokenType();
    modal.componentInstance.typeTransaction = ERequestTypeTransaction.DONATIONS_TRANSFER;
    modal.componentInstance.executeService = this.handlerExecuteTransfer.bind(this);

    modal.result.then((result) => {
      if (!result) {
        return;
      }

      this.handleExecuteTransactionResponse(result);
    }).catch(error => error);

  }

  /* ================================================ DEFAULT TRANSACTION ================================================*/


  /* ================================================ SIGNATURE TRACKING - MODIFY TRANSACTION ================================================*/
  buildSignatureTrackingVoucher() {
    const confirm: IDTDConfirmationRequest = {
      title: 'signature_tracking',
      subtitle: 'signature_tackingModifyConfirmationTransaction',
      accountDebited: this.debitedAccountSelected as IAccount,
      fundationAccount: this.fundationAccountSelected as IDonationAccount,
      amount: this.formValues?.amount as any,
    };

    this.voucherLayout = this.donationDefinitionManager.builderLayoutConfirmationStep3({ ...confirm });
  }

  handleExecuteModifyTransaction() {
    const donationState: IDonationState = this.parameterManagement.getParameter('navigateStateParameters');

    const updateParams = {
      transactionCode: donationState?.transactionSelected?.reference as string,
      serviceModify: donationState?.transactionSelected?.serviceCode as string,
      data: this.getBodyToUpdateTransaction(),
    };

    this.util.showLoader();

    this.stTransactionService.update(updateParams)
      .subscribe({
        next: (response) => {
          this.goToSignatureTrackingVoucher({
            reference: response?.reference,
            dateTime: response?.dateTime,
          });
        },
        error: (error: HttpErrorResponse) => {
          if (error?.error?.code === HttpStatusCode.SIGNATURE_TRACKING_MODIFY_SUCCESS) {
            this.goToSignatureTrackingVoucher({
              reference: error?.error?.reference,
              dateTime: error?.error?.dateTime,
            });

            return;
          }

          this.showAlert('error', error?.error?.message ?? 'signature_tracking:error:modify_transaction');
        }
      });
  }

  getBodyToUpdateTransaction() {
    const donationState: IDonationState = this.parameterManagement.getParameter('navigateStateParameters');

    const requestProperties: ISTBodyRequestDonationTransaction = {
      sourceAccount: this.debitedAccountSelected as IAccount,
      targetAccount: this.fundationAccountSelected as IDonationAccount,
      amount: this.formValues?.amount as any,
      detailAccountToUpdate: donationState?.transactionManagerDetail,
      fundationAccount: donationState?.fundationDetailAccount as ITransactionManagerAccountDetail,
    };

    return this.stBuildUpdateBodyRequest
      .buildBodyToUpdateDonation({ ...requestProperties });
  }

  saveDataToSignatureTracking(transactionResponse: any) {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: EDonationNavigationProtected.SIGNATURE_TRACKING_VOUCHER,
      navigateStateParameters: {
        debitedAccount: this.debitedAccountSelected as IAccount,
        fundationAccount: this.fundationAccountSelected as IDonationAccount,
        formValues: this.formValues,
        transactionResponse,
        message: null,
        typeTransaction: EDonationTypeTransaction.SIGNATURE_TRACKING,
      } as IDonationState
    });
  }

  goToSignatureTrackingVoucher(transactionResponse: any) {
    this.saveDataToSignatureTracking(transactionResponse);

    this.router.navigate([EDonationTransferUrlNavigationCollection.SIGNATURE_TRACKING_MODIFY_VOUCHER]).finally(() => this.util.hideLoader());
  }


  /* ================================================ SIGNATURE TRACKING - MODIFY TRANSACTION ================================================*/


  /* ================================================ UTILITIES ================================================*/

  resetStorage(navParam: string | null = null) {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: navParam,
    });
  }

  scrollToTop() {
    this.util.scrollToTop();
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  hiddenAlert() {
    this.typeAlert = null;
    this.messageAlert = null;
  }
  /* ================================================ UTILITIES ================================================*/

}
