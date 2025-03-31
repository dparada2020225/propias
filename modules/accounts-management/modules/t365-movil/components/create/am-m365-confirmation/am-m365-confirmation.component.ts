import { Component, OnInit } from '@angular/core';
import { IDataReading } from '@adf/components';
import { UtilService } from '../../../../../../../service/common/util.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../../service/navegation-parameters/parameter-management.service';
import { HandleTokenRequestService } from '../../../../../../../service/common/handle-token-request.service';
import { UtilTransactionService } from '../../../../../../../service/common/util-transaction.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../../enums/common-value.enum';
import { ModalTokenComponent } from '../../../../../../../view/private/token/modal-token/modal-token.component';
import { ERequestTypeTransaction } from '../../../../../../../enums/transaction-header.enum';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpStatusCode } from '../../../../../../../enums/http-status-code.enum';
import { AM365CreateHomeState, IAM365CreateConfirmState } from '../../../interfaces/state.interface';
import { AM365UrlCollection } from '../../../enum/url-collection.enum';
import { AmM365TransactionService } from '../../../services/transaction/am-m365-transaction.service';
import { AM365VoucherBuilder } from '../../../interfaces/voucher.interface';
import { AmdM365DetailService } from '../../../services/definition/amd-m365-detail.service';
import { IM365AddAccountBodyRequest } from '../../../interfaces/transaction-service.interface';
import { M365RouteProtectedParameters } from '../../../enum/route-protected.enum';

@Component({
  selector: 'byte-am-m365-confirmation',
  templateUrl: './am-m365-confirmation.component.html',
  styleUrls: ['./am-m365-confirmation.component.scss']
})
export class AmM365ConfirmationComponent implements OnInit {
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
    private voucherDefinitionService: AmdM365DetailService,
    private handleTokenRequest: HandleTokenRequestService,
    private transactionService: AmM365TransactionService,
    private utilsTransaction: UtilTransactionService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.initDefinition();
    this.utils.hideLoader();
  }

  initDefinition() {
    const state = this.parameterManagement.getParameter<AM365CreateHomeState>(PROTECTED_PARAMETER_STATE);

    const accountDetail = new AM365VoucherBuilder()
      .bankName(state.bankSelected.description)
      .name(state.formValues.name)
      .email(state.formValues.email)
      .numberPhone(state.formValues.numberPhone)
      .build();

    this.voucherLayout = this.voucherDefinitionService.buildVoucherConfirmationLayout({
      account: accountDetail,
    });
  }

  previous() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_ROUTE]: M365RouteProtectedParameters.CREATE,
    });
    this.router.navigate([AM365UrlCollection.CREATE]).finally(() => {});
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

    (modal.result).then((result) => {
        if (!result) return;
        this.handleResponseTransaction(result);
      },
      (error) => error);
  }

  executeTransaction(token?: string) {
    this.utils.showLoader();

    const bodyRequest = this.buildBodyRequest();
    return this.transactionService.addAccount(bodyRequest, this.isTokenRequired, token)
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
    const state = this.parameterManagement.getParameter<AM365CreateHomeState>(PROTECTED_PARAMETER_STATE);
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        ...state,
        transactionResponse: response,
      } as IAM365CreateConfirmState,
      [PROTECTED_PARAMETER_ROUTE]: M365RouteProtectedParameters.CREATE_VOUCHER,
    });

    this.router.navigate([AM365UrlCollection.CREATE_VOUCHER]).finally(() => {});
  }

  buildBodyRequest() {
    const { bankSelected, formValues } = this.parameterManagement.getParameter<AM365CreateHomeState>(PROTECTED_PARAMETER_STATE);

    return {
      account: formValues.numberPhone,
      name: formValues.name,
      favorite: false,
      properties: {
        favorite: String(false),
        bank: bankSelected.code,
        email: formValues.email,
      }
    } as IM365AddAccountBodyRequest;
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

}
