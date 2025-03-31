import {IDataReading} from '@adf/components';
import {Location} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {EProfile} from 'src/app/enums/profile.enum';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {environment} from 'src/environments/environment';
import {HttpStatusCode} from '../../../../../../enums/http-status-code.enum';
import {ITMTransaction} from '../../../../../transaction-manager/interfaces/tm-transaction.interface';
import {
  ITransactionManagerRequestDetail
} from '../../../../../transaction-manager/interfaces/transaction-manger.interface';
import {
  ISignatureTrackingModify
} from '../../../../../transaction-manager/modules/signature-tracking/interfaces/st-service.interface';
import {
  ISTBodyRequestOwnTransaction
} from '../../../../../transaction-manager/modules/signature-tracking/interfaces/st-transfer.interface';
import {
  StBuildUpdateBodyRequestService
} from '../../../../../transaction-manager/modules/signature-tracking/services/definition/st-build-update-body-request.service';
import {
  SignatureTrackingService
} from '../../../../../transaction-manager/modules/signature-tracking/services/transaction/signature-tracking.service';
import {
  EOwnTransferProtectedNavigation,
  EOwnTransferUrlNavigationCollection
} from '../../enum/navigation-parameter.enum';
import {EOwnTransferTypeTransaction} from '../../enum/own-transfer-control-name.enum';
import {EOwnTransferViewMode} from '../../enum/own-transfer.enum';
import {IOTDConfirm, IOTDForm} from '../../interfaces/own-transfer-definition.interface';
import {IResponseOwnTransfers} from '../../interfaces/own-transfer-respoce.interface';
import {IOwnAccount, IOwnTransferFormValues, IOwnTransferState,} from '../../interfaces/own-transfer.interface';
import {OtdTransferConfirmManagerService} from '../../services/definition/manager/otd-transfer-confirm-manager.service';
import {OteExecuteTransactionService} from '../../services/execution/ote-execute-transaction.service';

@Component({
  selector: 'byte-own-confirmation',
  templateUrl: './own-confirmation.component.html',
  styleUrls: ['./own-confirmation.component.scss'],
})
export class OwnConfirmationComponent implements OnInit, OnDestroy {
  typeAlert: string | null = null;
  messageAlert: string | null = null;
  debitedAccountSelected: IOwnAccount | undefined = undefined;
  accreditAccountSelected: IOwnAccount | undefined = undefined;
  formValues: IOwnTransferFormValues | null = null;
  voucherLayout: IDataReading | null = null;
  viewMode: EOwnTransferViewMode | null = null;
  transactionManagerDetail: ITransactionManagerRequestDetail | null = null;
  transactionSelected: ITMTransaction | null = null;
  routerSubscription: Subscription;
  typeProfile: string = environment.profile;
  profileSV: EProfile = EProfile.SALVADOR;
  profilePA: EProfile = EProfile.PANAMA;
  isErrorTransaction: boolean = false;
  profile: EProfile = EProfile.SALVADOR;
  messageTransaction!: Subscription;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get isShowNextButton() {
    return (this.typeProfile == this.profileSV || this.profilePA) && this.isErrorTransaction;
  }

  constructor(
    private router: Router,
    private util: UtilService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private parameterManagement: ParameterManagementService,
    private signatureTransactionService: SignatureTrackingService,
    private stBuildUpdateBodyRequest: StBuildUpdateBodyRequestService,
    private definitionServiceManager: OtdTransferConfirmManagerService,
    private ownTransaction: OteExecuteTransactionService,
  ) {
    this.routerSubscription = this.router.events.subscribe((event: any) => {
      if (event.navigationTrigger === 'popstate' && this.viewMode === EOwnTransferViewMode.SIGNATURE_TRACKING) {
        this.resetStorage(EOwnTransferProtectedNavigation.HOME_ST_UPDATE_MODE);
      }
    });
  }

  ngOnInit(): void {
    const ownTransferState: IOwnTransferState = this.parameterManagement.getParameter('navigateStateParameters');
    this.viewMode = this.activatedRoute.snapshot.data?.['view'];

    this.debitedAccountSelected = ownTransferState?.debitedAccount;
    this.accreditAccountSelected = ownTransferState?.accreditAccount;
    this.formValues = ownTransferState.formValues;
    this.transactionManagerDetail = ownTransferState?.transactionManagerDetail ?? null;
    this.transactionSelected = ownTransferState?.transactionSelected ?? null;

    this.initVoucherLayout();
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();

    if (this.messageTransaction) {
      this.messageTransaction.unsubscribe();
    }

    this.ownTransaction.resetMessage();
  }

  initVoucherLayout() {
    if (this.viewMode === EOwnTransferViewMode.DEFAULT) {
      this.builderVoucherLayout({
        title: 'own-transfer',
        subtitle: 'transfer_confirmation',
      });
      return;
    }

    this.builderVoucherLayout({
      title: 'signature_tracking_label',
      subtitle: 'signature_tackingModifyConfirmationTransaction',
    });
  }

  nextStep() {
    if (this.viewMode === EOwnTransferViewMode.DEFAULT) {
      this.executeTransaction();
      return;
    }

    this.util.showLoader();
    if (this.viewMode === EOwnTransferViewMode.SIGNATURE_TRACKING) {
      this.handleExecuteModifyTransaction();
    }
  }

  lastStep() {
    const parameter: string | null =
      this.viewMode === EOwnTransferViewMode.DEFAULT ? null : EOwnTransferProtectedNavigation.HOME_ST_UPDATE_MODE;

    this.location.back();
    this.resetStorage(parameter as never);
  }

  /* ========================================= DEFAULT TRANSACTION ===================================================*/

  builderVoucherLayout(parameters: IOTDForm): void {
    const {title, subtitle} = parameters ?? {};

    const confirm: IOTDConfirm = {
      title,
      subtitle,
      accountDebited: this.debitedAccountSelected!,
      accountCredit: this.accreditAccountSelected!,
      amount: this.formValues?.amount as any,
      comment: this.formValues?.comment!,
    };

    this.voucherLayout = this.definitionServiceManager.builderLayoutConfirmationStep2(confirm);
  }

  executeTransaction() {
    this.ownTransaction.execute({
      sourceAccount: this.debitedAccountSelected as IOwnAccount,
      targetAccount: this.accreditAccountSelected as IOwnAccount,
      formValues: this.formValues as IOwnTransferFormValues,
    });

    this.messageTransaction = this.ownTransaction.message$.subscribe({
      next: (message) => {
        if (message) {
          this.showAlert('error', message)
          this.isErrorTransaction = true;
        }
      }
    })
  }


  /* ========================================= DEFAULT TRANSACTION ===================================================*/

  /* ===================================== SIGNATURE TRACKING TRANSACTION =============================================*/

  handleExecuteModifyTransaction() {
    this.util.showLoader();

    const updateParams: ISignatureTrackingModify = {
      transactionCode: this.transactionSelected?.reference as never,
      serviceModify: this.transactionSelected?.serviceCode as never,
      data: this.getBodyToUpdateTransaction(),
    };

    this.signatureTransactionService.update(updateParams).subscribe({
      next: (response) => {
        this.gotToVoucherModifySignatureTracking({
          rate: undefined,
          date: response?.dateTime,
          reference: response?.reference,
          description: undefined,
          targetAccount: null,
          sourceAccount: null,
        });
      },
      error: (error: HttpErrorResponse) => {
        if (+error?.error?.code === +HttpStatusCode.SIGNATURE_TRACKING_MODIFY_SUCCESS) {
          this.gotToVoucherModifySignatureTracking({
            rate: undefined,
            date: error?.error?.dateTime,
            reference: error?.error?.reference,
            description: undefined,
            targetAccount: null,
            sourceAccount: null,
          });
          return;
        }

        this.util.hideLoader();
        this.showAlert('error', error?.error?.message ?? 'signature_tracking:error:modify_transaction');
        this.scrollToTop();
      },
    });
  }

  getBodyToUpdateTransaction() {
    const requestProperties: ISTBodyRequestOwnTransaction = {
      sourceAccount: this.debitedAccountSelected as IOwnAccount,
      targetAccount: this.accreditAccountSelected as IOwnAccount,
      comment: this.formValues?.comment,
      amount: Number(this.formValues?.amount),
      detailAccountToUpdate: this.transactionManagerDetail,
    };

    return this.stBuildUpdateBodyRequest.buildBodyToUpdateTransaction({...requestProperties});
  }

  gotToVoucherModifySignatureTracking(transactionResponse: IResponseOwnTransfers) {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: EOwnTransferProtectedNavigation.VOUCHER_ST_UPDATE_MODE,
      navigateStateParameters: {
        debitedAccount: this.debitedAccountSelected,
        accreditAccount: this.accreditAccountSelected,
        formValues: this.formValues,
        transactionResponse,
        typeTransaction: EOwnTransferTypeTransaction.SIGNATURE_TRACKING,
      } as IOwnTransferState,
    });

    this.router.navigate([EOwnTransferUrlNavigationCollection.SIGNATURE_TRACKING_MODIFY_VOUCHER]).finally(() => this.util.hideLoader());
  }

  /* ===================================== SIGNATURE TRACKING TRANSACTION =============================================*/

  resetStorage(parameter: string) {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: parameter,
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
}
