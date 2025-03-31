import { Component, OnInit } from '@angular/core';
import { IDataReading } from '@adf/components';
import { UtilService } from '../../../../../../../service/common/util.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../../service/navegation-parameters/parameter-management.service';
import { AmdAchDetailService } from '../../../services/definition/amd-ach-detail.service';
import { HandleTokenRequestService } from '../../../../../../../service/common/handle-token-request.service';
import { AcAchTransactionService } from '../../../services/transaction/ac-ach-transaction.service';
import { UtilTransactionService } from '../../../../../../../service/common/util-transaction.service';
import {
  IAMACHConfirmationDeleteState,
  IAMACHDetailState, IAMACHHomeUpdateState
} from '../../../interfaces/state.interface';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../../enums/common-value.enum';
import { IAMACHAccountDetail } from '../../../interfaces/voucher.interface';
import { AMAchUrlCollection } from '../../../enum/url-collection.enum';
import { IUserInfo } from '../../../../../../../models/user-info.interface';
import {
  IAMACHDeleteAccountRequest,
} from '../../../interfaces/transaction.interface';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpStatusCode } from '../../../../../../../enums/http-status-code.enum';
import { ModalTokenComponent } from '../../../../../../../view/private/token/modal-token/modal-token.component';
import { ERequestTypeTransaction } from '../../../../../../../enums/transaction-header.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from '../../../../../../../enums/product.enum';
import { AmACHRouteProtected } from '../../../enum/route-protected.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'byte-ac-ach-delete-confirmation',
  templateUrl: './ac-ach-delete-confirmation.component.html',
  styleUrls: ['./ac-ach-delete-confirmation.component.scss']
})
export class AcAchDeleteConfirmationComponent implements OnInit {

  typeAlert: string | null = null;
  messageAlert: string | null = null;

  voucherLayout!: IDataReading;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get isTokenRequired() {
    return this.handleTokenRequest.isTokenRequired();
  }

  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManagement: ParameterManagementService,
    private voucherDefinitionService: AmdAchDetailService,
    private handleTokenRequest: HandleTokenRequestService,
    private transactionService: AcAchTransactionService,
    private utilsTransaction: UtilTransactionService,
    private modalService: NgbModal,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.initDefinition();
    this.utils.hideLoader();
  }

  initDefinition() {
    const state = this.parameterManagement.getParameter<IAMACHHomeUpdateState>(PROTECTED_PARAMETER_STATE);
    const userLabelKey = `ac:ach_label_person_${state.account.clientType.slice(0,1).toLowerCase()}`;

    const accountDetail = new IAMACHAccountDetail()
      .typeClient(this.translate.instant(userLabelKey))
      .bankName(state.account.bankName)
      .currency(state.account.currency)
      .typeAccount(this.utils.getProductNameFromEquivalence(state.account.type).toUpperCase())
      .account(state.account.account)
      .name(state.account.name)
      .email(state.account.email)
      .typeIdentification(state.documentTypeLabel)
      .identificationNumber(state.account.documentNumber)
      .reason('')
      .status(state.account.status ?? '')
      .build();

    this.voucherLayout = this.voucherDefinitionService.buildVoucherConfirmationLayout({
      account: accountDetail,
      useUpdateMode: false,
    }, true);
  }

  previous() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_ROUTE]: AmACHRouteProtected.REMOVE,
    });

    this.router.navigate([AMAchUrlCollection.DELETE]).finally(() => {});
  }

  nextStep() {
    this.handleExecuteTransaction();
  }

  handleExecuteTransaction() {
    if (this.isTokenRequired) {
      this.openTokenModal();
      return;
    }

    this.executeTransaction()
      .subscribe({
        next: (response) => {
          this.handleResponseTransaction(response);
        }
      })
  }

  openTokenModal() {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'} sm-600`,
      size: 'lg',
    });

    modal.componentInstance.typeTransaction = ERequestTypeTransaction.ACH_TRANSFER;
    modal.componentInstance.executeService = (token: string) => this.executeTransaction(token);

    modal.dismissed.subscribe(() => {
      return;
    });

    (modal.result).then(
      (result) => {
        if (!result) return;
        this.handleResponseTransaction(result);
      },
      (error) => error);
  }

  executeTransaction(token?: string) {
    this.utils.showLoader();

    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');
    const state = this.parameterManagement.getParameter<IAMACHDetailState>(PROTECTED_PARAMETER_STATE);

    const dataToExecuteTransaction = {
      clientNumber: userInfo.customerCode,
      bankCode: state.account.bank + '',
      accountNumber: state.account.account,
    } as IAMACHDeleteAccountRequest;

    return this.transactionService.deleteAccount(dataToExecuteTransaction)
      .pipe(
        map((response) => this.utilsTransaction.handleResponseTransaction(response)),
        catchError(error => of(this.utilsTransaction.handleErrorTransaction(error))),
      );
  }

  handleResponseTransaction(response: any) {
    if (+response?.status !== HttpStatusCode.SUCCESS_TRANSACTION) {
      this.utils.hideLoader();
      this.showAlert('error', response?.message ?? '');
      this.utils.scrollToTop();
      return;
    }

    this.utils.showLoader();
    const state = this.parameterManagement.getParameter<IAMACHDetailState>(PROTECTED_PARAMETER_STATE);
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        ...state,
        transactionResponse: response,
      } as IAMACHConfirmationDeleteState,
      [PROTECTED_PARAMETER_ROUTE]: AmACHRouteProtected.REMOVE_VOUCHER,
    });

    this.router.navigate([AMAchUrlCollection.DELETE_VOUCHER]).finally(() => {});
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

}
