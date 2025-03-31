import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StBuildUpdateBodyRequestService } from 'src/app/modules/transaction-manager/modules/signature-tracking/services/definition/st-build-update-body-request.service';
import { SignatureTrackingService } from 'src/app/modules/transaction-manager/modules/signature-tracking/services/transaction/signature-tracking.service';
import { HandleTokenRequestService } from 'src/app/service/common/handle-token-request.service';
import { UtilTransactionService } from 'src/app/service/common/util-transaction.service';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import {
  EACHNavigationParameters,
} from '../../../transfer-ach/enum/navigation-parameter.enum';
import { EACHTransactionViewMode, EACHTypeTransaction } from '../../../transfer-ach/enum/transfer-ach.enum';
import { AtdUtilService } from '../../../transfer-ach/services/atd-util.service';
import { IDataReading } from '@adf/components';
import { AchUniTransactionNavigateParameterState } from '../../interfaces/ach-uni-transaction-navigate-parameter-state';
import { AchUniTransactionViewMode } from '../../enums/AchUniTransactionViewMode.enum';
import { AchUniPurpose } from '../../interfaces/ach-uni-purpose';
import { AchUniBank } from '../../interfaces/ach-uni-bank';
import { AchUniFormValues } from '../../interfaces/ach-uni-transfer.interface';
import { IAccount } from 'src/app/models/account.inteface';
import { TAchUniTransferManagerService } from '../../services/definition/transaction/t-ach-uni-transfer-manager.service';
import {
  IACHTransactionResponse,
} from '../../../transfer-ach/interfaces/ach-transfer.interface';
import { ModalTokenComponent } from 'src/app/view/private/token/modal-token/modal-token.component';
import { ERequestTypeTransaction } from 'src/app/enums/transaction-header.enum';
import { AchUniTransferService } from '../../services/transaction/ach-uni-transfer.service';
import { Product } from 'src/app/enums/product.enum';
import { HttpStatusCode } from 'src/app/enums/http-status-code.enum';
import { AchUniTransferProtectedNavigation, AchUniTransferUrlNavigationCollection } from '../../enums/ach-uni-navigation-parameter.enum';
import { S365TransferRequestBuilder } from '../../../../interface/365-transfer.interface';
import { ETMACHTypeTransaction } from '../../../../../transaction-manager/modules/ach/enum/form-control-name.enum';
import { IUserInfo } from '../../../../../../models/user-info.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'byte-ach-uni-confirmation',
  templateUrl: './ach-uni-confirmation.component.html',
  styleUrls: ['./ach-uni-confirmation.component.scss']
})
export class AchUniConfirmationComponent implements OnInit {

  view: string | null = null;

  accountSelectedDebited!: IAccount;
  bankSelected: AchUniBank | undefined;
  accountSelectedDestination!: IAccount;
  purposeSelected!: AchUniPurpose;
  formValues: AchUniFormValues | undefined;
  typeAlert: string | undefined;
  messageAlert: string | undefined;
  clientType!: string;
  referenceNumber!: string;
  voucherConfirmation: IDataReading | null = null;
  urlUni: string = 'assets/images/logos/SVG_BIES_TOB_UNI_Logo.svg';

  title = '';
  subtitle = '';

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get isTokenRequired() {
    return this.handleTokenRequest.isTokenRequired();
  }

  constructor(
    private modalService: NgbModal,
    private router: Router,
    public persistStepStateService: ParameterManagementService,
    private transferACHUNI: AchUniTransferService,
    private transactionDefinitionManager: TAchUniTransferManagerService,
    public util: UtilService,
    private activatedRoute: ActivatedRoute,
    private achUtils: AtdUtilService,
    private stBuildUpdateBodyRequest: StBuildUpdateBodyRequestService,
    private handleTokenRequest: HandleTokenRequestService,
    private utilsTransaction: UtilTransactionService,
    private stTransactionService: SignatureTrackingService,
    private translate: TranslateService,
  ) {
    this.translate.onLangChange.subscribe({
      next: () => {
        this.initDefinition();
      }
    })
  }

  ngOnInit(): void {
    this.initState();
    this.initDefinition();
    this.util.hideLoader();
  }

  initState() {
    const navigateStateParameters: AchUniTransactionNavigateParameterState = this.persistStepStateService.getParameter('navigateStateParameters');

    this.accountSelectedDebited = navigateStateParameters?.accountDebited;
    this.bankSelected = navigateStateParameters?.bank;
    this.accountSelectedDestination = navigateStateParameters?.accountDestination;
    this.purposeSelected = navigateStateParameters?.purpose;
    this.formValues = navigateStateParameters?.formValues;
    this.view = this.activatedRoute.snapshot.data['view'];
    this.clientType = this.persistStepStateService.getParameter('clientType');
  }

  initDefinition() {
    if (this.view === AchUniTransactionViewMode.CONFIRMATION) {
      this.buildConfirmationVoucher('ach-uni:title-confirmation', 'ach-uni:subtitle-confirmation');
      return;
    }

    this.buildConfirmationVoucher('signature_tracking_label', 'signature_tackingModifyConfirmationTransaction');
  }

  buildConfirmationVoucher(title: string, subtitle: string) {
    this.title = title;
    this.subtitle = subtitle;

    this.voucherConfirmation = this.transactionDefinitionManager.buildVoucherConfirmation({
        accountToDebited: this.accountSelectedDebited as IAccount,
        accountToCredit: this.accountSelectedDestination as IAccount,
        bank: this.bankSelected as AchUniBank,
        purpose: this.purposeSelected as AchUniPurpose,
        formValues: this.formValues as AchUniFormValues,
        title,
        subtitle
      });
  }

  nextStep() {
    if (this.view === AchUniTransactionViewMode.CONFIRMATION) {
      this.handleExecuteTransaction();
      return;
    }

    this.handleExecuteModifyTransaction();
  }

  handleExecuteTransaction() {
    if (this.isTokenRequired) {
      this.openTokenModal();
      return;
    }

    this.executeTransaction().subscribe({
      next: (response) => {
        this.handleResponseTransaction(response);
      }
    });
  }

  openTokenModal() {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${this.util.getProfile() || 'byte-theme'} sm-600`,
      size: 'lg',
    });

    modal.componentInstance.typeTransaction = ERequestTypeTransaction.ACH_TRANSFER;
    modal.componentInstance.executeService = (token: string) => this.executeTransaction(token);

    modal.dismissed.subscribe(() => {
      return;
    });

    (modal.result as Promise<any>).then(
      (result) => {
        if (!result) return;
        this.handleResponseTransaction(result);
      },
      (error) => error);
  }

  isHttpErrorResponse(response: any): response is HttpErrorResponse {
    return response instanceof HttpErrorResponse ||
           (response && typeof response.status === 'number' && typeof response.error === 'object');
  }

  isErrorResponse(response: any): boolean {
    return response && response.error && typeof response.error === 'object' && 'message' in response.error;
  }

  handleResponseTransaction(response: any) {

    if (response.status !== 200 && response.status !== 39) {
      this.showAlert('error', response.message);
      this.util.hideLoader();
      this.util.scrollToTop();
      return;
    }

    const date: Date = new Date();
    const isSignatureTrackingTransaction = response;

    const parameters: AchUniTransactionNavigateParameterState = {
      formValues: this.formValues,
      accountDebited: this.accountSelectedDebited as IAccount,
      accountDestination: this.accountSelectedDestination as IAccount,
      bank: this.bankSelected as AchUniBank,
      purpose: this.purposeSelected,
      commission: Number(this.formValues?.commission),
      transactionResponse: response,
      message: isSignatureTrackingTransaction.errorDescription,
      typeTransaction: EACHTypeTransaction.DEFAULT,
      response:{...response, date: this.formatDateToCustomString(date)}
    };

    this.persistStepStateService.sendParameters({
      navigateStateParameters: parameters,
      navigationProtectedParameter:  AchUniTransferProtectedNavigation.VOUCHER,
    });
    this.router.navigate([AchUniTransferUrlNavigationCollection.DEFAULT_VOUCHER]).finally(() => this.util.hideLoader());
  }

  formatDateToCustomString(date: Date): string {
    const pad = (num: number): string => num.toString().padStart(2, '0');

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // Los meses en JavaScript son 0-indexados
    const year = date.getFullYear().toString();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${day}${month}${year}${hours}${minutes}${seconds}`;
  }

  getCodeFromText(productName: keyof typeof Product): string | undefined {
    if (productName in Product) {
      const code = Product[productName];
      return code;
    } else {
      return undefined;
    }
  }

  executeTransaction(token?: string): Observable<any> {
    this.util.showLoader();

    const bodyRequest = this.buildBodyRequest();
    return this.transferACHUNI.achUniTransfer(this.isTokenRequired, bodyRequest, token as string)
    .pipe(
      finalize(() => this.util.hideLoader()),
      map(response => this.utilsTransaction.handleResponseTransaction<IACHTransactionResponse>(response)),
      catchError(error => of(this.utilsTransaction.handleErrorTransaction<IACHTransactionResponse>(error))),
    );
  }

  private buildBodyRequest() {
    const codeProduct = this.getCodeFromText(this.accountSelectedDestination?.type as "CHECKING" | "CHECK" | "SAVINGS" | "FIX_TERM" | "LOAN" | "LOAN_ADMINISTRATED" | "CREDIT_CARD" | "LOANS");
    const userInfo: IUserInfo = this.persistStepStateService.getParameter('userInfo');
    const clientType = this.persistStepStateService.getParameter('clientType');

    return new S365TransferRequestBuilder()
      .sourceProduct(this.accountSelectedDebited.product.toString())
      .sourceSubProduct(this.accountSelectedDebited.subproduct.toString())
      .sourceCurrency(this.accountSelectedDebited.currency)
      .sourceAccountNumber(this.accountSelectedDebited.account)
      .sourceAmount(this.formValues?.amount ?? '')
      .targetBank((this.accountSelectedDestination?.bank ?? '').toString())
      .targetProduct(codeProduct ?? '01')
      .targetAccountNumber(this.accountSelectedDestination.account)
      .targetCurrency(this.accountSelectedDestination.currency)
      .targetAmount(this.formValues?.amount ?? '')
      .commentary(this.formValues?.comment ?? '')
      .targetAccountIdentificationNumber(this.accountSelectedDestination?.documentNumber ?? '')
      .clientType(clientType)
      .clientNumber(userInfo.customerCode)
      .sourceAccountName(this.accountSelectedDebited.name)
      .targetAccountType((this.accountSelectedDestination as any).clientType)
      .targetAccountIdentificationType(this.accountSelectedDestination.identificationType ?? '')
      .targetAccountName(this.accountSelectedDestination.name)
      .targetAccountStatus(this.accountSelectedDestination.status ?? 'A')
      .targetBankName(this.bankSelected?.description ?? '')
      .targetAccountEmail(this.accountSelectedDestination.email ?? '')
      .targetAccountCreationDate(this.accountSelectedDestination.creationDate ?? '')
      .targetAccountModificationDate(this.accountSelectedDestination.modificationDate ?? '')
      .targetAccountCreationUser(this.accountSelectedDestination.userOfCreation ?? '')
      .targetAccountModificationUser(this.accountSelectedDestination.userOfModification ?? '')
      .serviceType(ETMACHTypeTransaction.UNI)
      .achTransferenceType(ETMACHTypeTransaction.UNI)
      .purpose(this.formValues?.purpose ?? '')
      .commission(this.formValues?.commission ?? '')
      .build();
  }

  getClientCode(): string {
    return this.persistStepStateService.getParameter('userInfo')?.customerCode;
  }

  lastStep() {

    if (this.view === AchUniTransactionViewMode.CONFIRMATION) {
      this.resetStorage(AchUniTransferProtectedNavigation.TRANSACTION);
      if(!this.typeAlert && !this.messageAlert){
        this.router.navigate([AchUniTransferUrlNavigationCollection.DEFAULT_TRANSACTION]).finally(() => this.util.hideLoader());
      }else{
        this.router.navigate([AchUniTransferUrlNavigationCollection.HOME_APP]).finally(() => this.util.hideLoader());
      }
      return;
    }

    this.util.showLoader();
    this.resetStorage(AchUniTransferProtectedNavigation.ST_UPDATE_HOME);
    this.router.navigate([AchUniTransferUrlNavigationCollection.ST_MODIFY_HOME]).finally(() => {});
  }

  resetStorage(navParam: string | null = null) {
    this.persistStepStateService.sendParameters({
      navigationProtectedParameter: navParam,
    });
  }

  scrollToTop() {
    this.util.scrollToTop();
  }

  handleBackNavigation() {
    this.router.events.subscribe((event: any) => {
      if (event.navigationTrigger === 'popstate') {
        if (this.view === EACHTransactionViewMode.DEFAULT) {
          this.resetStorage(EACHNavigationParameters.TRANSFER_FORM);
          return;
        }

        if (this.view === EACHTransactionViewMode.SIGNATURE_TRACKING_UPDATE) {
          this.resetStorage(EACHNavigationParameters.TRANSFER_FORM_UPDATE_MODE);
          return;
        }
      }
    });
  }

  showAlert(typeAlert?: string, message?: string) {
    this.typeAlert = typeAlert;
    this.messageAlert = message;
  }


  // ========================================= SIGNATURE TRACKING MODIFY EXECUTE SERVICE =====================================  //
  handleExecuteModifyTransaction() {
    const achState = this.persistStepStateService.getParameter('navigateStateParameters');

    const updateParams = {
      transactionCode: achState?.transactionSelected?.reference,
      serviceModify: achState.transactionSelected?.serviceCode,
      data: this.getBodyToUpdateTransaction(),
    };


    this.util.showLoader();
    this.stTransactionService.update(updateParams).subscribe({
      next: (response) => {
        this.goToSignatureTrackingVoucher(response?.reference, response?.dateTime);
      },
      error: (error: HttpErrorResponse) => {
        if (error?.error?.code === HttpStatusCode.SIGNATURE_TRACKING_MODIFY_SUCCESS) {
          this.goToSignatureTrackingVoucher(error?.error?.reference ?? undefined, error?.error?.dateTime ?? undefined);
          return;
        }

        this.showAlert('error', error?.error?.message ?? 'signature_tracking:error:modify_transaction');
      },
    });
  }

  getBodyToUpdateTransaction() {
    const achState = this.persistStepStateService.getParameter('navigateStateParameters');
    return this.stBuildUpdateBodyRequest.buildBodyToUpdateAchUniTxn(achState);
  }

  goToSignatureTrackingVoucher(reference: string, date: string) {
    const achState = this.persistStepStateService.getParameter('navigateStateParameters');

    this.persistStepStateService.sendParameters({
      navigateStateParameters: {
        ...achState,
        transactionResponse: {
          reference,
          dateTime: date,
        },
      },
      navigationProtectedParameter: AchUniTransferProtectedNavigation.ST_UPDATE_VOUCHER,
    });

    this.router.navigate([AchUniTransferUrlNavigationCollection.ST_MODIFY_VOUCHER]).finally(() => this.util.hideLoader());
  }
}
