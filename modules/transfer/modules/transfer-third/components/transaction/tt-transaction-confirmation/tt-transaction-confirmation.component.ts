import {IDataReading} from '@adf/components';
import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {of} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {HttpStatusCode} from 'src/app/enums/http-status-code.enum';
import {EProfile} from 'src/app/enums/profile.enum';
import {
  ISTBodyRequestThirdTransaction
} from 'src/app/modules/transaction-manager/modules/signature-tracking/interfaces/st-transfer.interface';
import {
  StBuildUpdateBodyRequestService
} from 'src/app/modules/transaction-manager/modules/signature-tracking/services/definition/st-build-update-body-request.service';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {ModalTokenComponent} from 'src/app/view/private/token/modal-token/modal-token.component';
import {environment} from '../../../../../../../../environments/environment';
import {ERequestTypeTransaction} from '../../../../../../../enums/transaction-header.enum';
import {IAccount} from '../../../../../../../models/account.inteface';
import {
  SignatureTrackingService
} from '../../../../../../transaction-manager/modules/signature-tracking/services/transaction/signature-tracking.service';
import {IThirdTransfersAccounts} from '../../../../../interface/transfer-data-interface';
import {IAddFavoriteACH} from '../../../../transfer-ach/interfaces/ach-transfer.interface';
import {EThirdTransferTypeTransaction} from '../../../enums/third-transfer-menu-options-licenses.enum';
import {
  EThirdTransferNavigateParameters,
  EThirdTransferUrlNavigationCollection,
  EThirdTransferViewMode,
} from '../../../enums/third-transfer-navigate-parameters.enum';
import {
  IThirdTransactionSuccessResponse,
  IThirdTransferTransactionResponse,
} from '../../../interfaces/third-transfer-definition.interface';
import {IThirdTransferTransactionState} from '../../../interfaces/third-transfer-persistence.interface';
import {IThirdTransferFormValues, IThirdTransferSampleVoucher} from '../../../interfaces/third-transfer.interface';
import {ThirdTransferDefinitionService} from '../../../services/definition/third-transfer-definition.service';
import {TtdTransferManagerService} from '../../../services/definition/transaction/manager/ttd-transfer-manager.service';
import {TransferThirdService} from '../../../services/transaction/transfer-third.service';
import {HandleTokenRequestService} from '../../../../../../../service/common/handle-token-request.service';
import {UtilTransactionService} from "../../../../../../../service/common/util-transaction.service";

@Component({
  selector: 'byte-tt-transaction-confirmation',
  templateUrl: './tt-transaction-confirmation.component.html',
  styleUrls: ['./tt-transaction-confirmation.component.scss'],
})
export class TtTransactionConfirmationComponent implements OnInit {
  typeAlert: string | undefined;
  messageAlert: string | undefined;

  accountDebitedSelected: IAccount | null = null;
  accountAccreditSelected: IThirdTransfersAccounts | null = null;
  formValues: IThirdTransferFormValues | null = null;

  confirmationLayout: IDataReading | null = null;
  isShowFavoriteWidget: boolean = true;
  isFavorite: boolean = false;
  viewMode: EThirdTransferViewMode = EThirdTransferViewMode.DEFAULT;

  typeProfile = EProfile.SALVADOR;
  private profile = environment.profile;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get classNameLayout() {
    const mapClassLayout = {
      [EProfile.SALVADOR]: 'layout-bisv'
    }
    return mapClassLayout[this.profile] || '';
  }

  get classNameButtons() {
    const mapClassButtons = {
      [EProfile.SALVADOR]: 'no-line_sv hover_button-primary-sv btn-sv'
    }
    return mapClassButtons[this.profile] || '';
  }

  constructor(
    private router: Router,
    private util: UtilService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private thirdTransferManager: TtdTransferManagerService,
    private parameterManagement: ParameterManagementService,
    private transferThirdService: TransferThirdService,
    private thirdTransferDefinition: ThirdTransferDefinitionService,
    private transactionService: SignatureTrackingService,
    private stBuildUpdateBodyRequest: StBuildUpdateBodyRequestService,
    private handleTokenRequest: HandleTokenRequestService,
    private utilsTransaction: UtilTransactionService,
  ) {
    this.router.events.subscribe((event: any) => {
      if (event.navigationTrigger === 'popstate') {
        if (this.viewMode === EThirdTransferViewMode.SIGNATURE_TRACKING) {
          this.parameterManagement.sendParameters({
            navigationProtectedParameter: EThirdTransferNavigateParameters.SIGNATURE_TRACKING_HOME,
          });
          return;
        }

        if (this.viewMode === EThirdTransferViewMode.DEFAULT) {
          this.goBack();
          return;
        }
      }
    });
  }

  ngOnInit(): void {
    this.initDefinition();
    this.buildMainVoucher();
  }

  initDefinition() {
    const transactionState: IThirdTransferTransactionState = this.parameterManagement.getParameter('navigateStateParameters');
    this.accountAccreditSelected = transactionState?.targetAccount;
    this.accountDebitedSelected = transactionState?.sourceAccount;
    this.formValues = transactionState?.formValues as never;
    this.isFavorite = this.accountAccreditSelected?.favorite;
    this.viewMode = this.activatedRoute.snapshot.data['view'];
  }

  buildMainVoucher() {
    if (this.viewMode === EThirdTransferViewMode.SIGNATURE_TRACKING) {
      this.buildSignatureTrackingVoucherLayout();
      return;
    }

    this.builderSampleVoucher();
  }

  builderSampleVoucher(): void {
    const voucherProperties: IThirdTransferSampleVoucher = {
      accountToCredit: this.accountAccreditSelected as never,
      accountToDebit: this.accountDebitedSelected as never,
      formValues: this.formValues as never,
      isFavorite: this.isFavorite,
      title: 'transfers-third-title',
      subtitle: 'transfer_confirmation',
    };

    if (this.profile === this.typeProfile) {
      this.isShowFavoriteWidget = false;
    }

    this.confirmationLayout = this.thirdTransferManager.buildTransferVoucherStep2({...voucherProperties}, this.isShowFavoriteWidget);
  }

  buildSignatureTrackingVoucherLayout() {
    this.isShowFavoriteWidget = !this.isShowFavoriteWidget;

    const voucherProperties: IThirdTransferSampleVoucher = {
      accountToCredit: this.accountAccreditSelected as never,
      accountToDebit: this.accountDebitedSelected as never,
      formValues: this.formValues as never,
      isFavorite: this.isFavorite,
      title: 'signature_tracking_label',
      subtitle: 'signature_tackingModifyConfirmationTransaction',
    };

    this.confirmationLayout = this.thirdTransferManager.buildTransferVoucherStep2({...voucherProperties}, this.isShowFavoriteWidget);
  }

  nextStep() {
    if (this.viewMode === EThirdTransferViewMode.SIGNATURE_TRACKING) {
      this.handleExecuteModifyTransaction();
      return;
    }

    this.validateIsOpenToken();
  }

  validateIsOpenToken() {
    if (this.handleTokenRequest.isTokenRequired()) {
      this.openTokenModal();
      return;
    }

    this.executeTransaction().subscribe({
      next: (response) => {
        this.handleTransactionResponse(response)
      }
    })
  }

  openTokenModal() {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} sm-600`,
      size: 'lg',
    });

    modal.componentInstance.typeTransaction = ERequestTypeTransaction.THIRD_PARTY_TRANSFER;
    modal.componentInstance.executeService = this.executeTransaction.bind(this);

    modal.dismissed.subscribe(() => {
      return;
    });

    modal.result
      .then((result) => {
        if (!result) {
          return;
        }

        this.handleTransactionResponse(result);
      })
      .catch((error) => error);
  }

  executeTransaction(token?: string) {

    this.util.showLoader();

    let data = this.thirdTransferDefinition.buildDataToExecuteTransaction({
      sourceAccount: this.accountDebitedSelected as IAccount,
      targetAccount: this.accountAccreditSelected as IThirdTransfersAccounts,
      formValues: this.formValues as IThirdTransferFormValues,
    });

    if (this.profile === EProfile.SALVADOR) {
      data.sourceAccountName = this.accountDebitedSelected?.name ?? '';
      data.targetAccountName = this.accountAccreditSelected?.name ?? '';
    }


    return this.transferThirdService.getTransferThird(this.handleTokenRequest.isTokenRequired(), data, token as string).pipe(
      finalize(() => this.favoritesManagement()),
      map((response) => this.utilsTransaction.handleResponseTransaction(response)),
      catchError((error: HttpErrorResponse) => of(this.utilsTransaction.handleErrorTransaction(error))),
    );
  }

  handleTransactionResponse(response) {
    if (response?.status === HttpStatusCode.INVALID_TOKEN) {
      this.util.hideLoader()
      return;
    }

    if (response?.status !== HttpStatusCode.SUCCESS_TRANSACTION && Number(response?.status) !== Number(HttpStatusCode.SIGNATURE_TRACKING)) {
      this.util.hideLoader()
      this.showAlert('error', response?.message ?? 'error_transfer_third');
      this.scrollToTop();
      return;
    }

    this.goToVoucher(response);
  }

  favoritesManagement(): void {
    if (this.isFavorite !== this.accountAccreditSelected?.favorite && this.isFavorite) {
      const account: IAddFavoriteACH = {
        number: this.accountAccreditSelected?.account ?? '',
        alias: this.accountAccreditSelected?.alias ?? '',
      };

      this.transferThirdService.addFavorite(account).subscribe(() => {
      });
    } else if (this.isFavorite !== this.accountAccreditSelected?.favorite && !this.isFavorite) {
      this.transferThirdService.deleteFavorite(this.accountAccreditSelected?.account as never).subscribe(() => {
      });
    }
  }

  goToVoucher(response: IThirdTransactionSuccessResponse<IThirdTransferTransactionResponse>) {
    const typeTransaction = response?.status === 200;

    this.parameterManagement.sendParameters({
      navigationProtectedParameter: EThirdTransferNavigateParameters.TRANSFER_VOUCHER,
      navigateStateParameters: {
        targetAccount: this.accountAccreditSelected,
        sourceAccount: this.accountDebitedSelected,
        formValues: this.formValues,
        typeTransaction: typeTransaction ? EThirdTransferTypeTransaction.DEFAULT : EThirdTransferTypeTransaction.SIGNATURE_TRACKING,
        message: response?.message ?? null,
        transactionResponse: response?.data,
      } as IThirdTransferTransactionState,
    });

    this.router.navigate([EThirdTransferUrlNavigationCollection.DEFAULT_VOUCHER]).finally(() => this.util.hideLoader());
  }

  prevStep() {
    if (this.viewMode === EThirdTransferViewMode.SIGNATURE_TRACKING) {
      this.parameterManagement.sendParameters({
        navigationProtectedParameter: EThirdTransferNavigateParameters.SIGNATURE_TRACKING_HOME,
      });

      this.router.navigate([EThirdTransferUrlNavigationCollection.SIGNATURE_TRACKING_HOME]).then(() => {
      });
      return;
    }

    this.goBack();
    this.router.navigate([EThirdTransferUrlNavigationCollection.HOME_TRANSACTION]).then(() => {
    });
  }

  handleExecuteModifyTransaction() {
    const transactionState: IThirdTransferTransactionState = this.parameterManagement.getParameter('navigateStateParameters');

    const updateParameters = {
      transactionCode: transactionState?.transactionSelected?.reference,
      serviceModify: transactionState?.transactionSelected?.serviceCode,
      data: this.getBodyToUpdateTransaction(),
    };

    this.util.showLoader();

    this.transactionService.update(updateParameters as never).subscribe({
      next: (response) => {
        this.goToSignatureTrackingVoucher({
          reference: response?.reference ?? undefined,
          date: response?.dateTime ?? undefined,
        });
      },
      error: (error: HttpErrorResponse) => {
        if (+error?.error?.code === +HttpStatusCode.SIGNATURE_TRACKING_MODIFY_SUCCESS) {
          this.goToSignatureTrackingVoucher({
            reference: error?.error?.reference ?? undefined,
            date: error?.error?.dateTime ?? undefined,
          });

          return;
        }

        this.showAlert('error', error?.error?.message ?? 'signature_tracking:error:modify_transaction');
        this.util.hideLoader();
      },
    });
  }

  goToSignatureTrackingVoucher(response: any) {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: EThirdTransferNavigateParameters.SIGNATURE_TRACKING_VOUCHER,
      navigateStateParameters: {
        targetAccount: this.accountAccreditSelected,
        sourceAccount: this.accountDebitedSelected,
        formValues: this.formValues,
        typeTransaction: EThirdTransferTypeTransaction.DEFAULT,
        message: null,
        transactionResponse: response,
      } as IThirdTransferTransactionState,
    });

    this.router.navigate([EThirdTransferUrlNavigationCollection.SIGNATURE_TRACKING_MODIFY_VOUCHER]).finally(() => this.util.hideLoader());
  }

  getBodyToUpdateTransaction() {
    const transactionState: IThirdTransferTransactionState = this.parameterManagement.getParameter('navigateStateParameters');

    const requestProperties: ISTBodyRequestThirdTransaction = {
      sourceAccount: this.accountDebitedSelected as never,
      targetAccount: this.accountAccreditSelected as never,
      comment: this.formValues?.comment,
      amount: this.formValues?.amount as any,
      detailAccountToUpdate: transactionState?.transactionManagerDetail,
      email: this.formValues?.email,
    };

    return this.stBuildUpdateBodyRequest.buildBodyToUpdateThirdPartyTransaction({...requestProperties});
  }

  scrollToTop() {
    this.util.scrollToTop();
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  handleChangeIsFavoriteTransaction() {
    this.isFavorite = !this.isFavorite;
  }

  goBack() {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: EThirdTransferNavigateParameters.TRANSFER_HOME,
    });
  }
}
