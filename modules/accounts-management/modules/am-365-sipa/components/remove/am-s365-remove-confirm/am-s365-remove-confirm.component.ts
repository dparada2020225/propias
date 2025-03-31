import { Component, OnInit } from '@angular/core';
import { IDataReading } from '@adf/components';
import { UtilService } from '../../../../../../../service/common/util.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../../service/navegation-parameters/parameter-management.service';
import { AmdS365DetailService } from '../../../services/definition/amd-s365-detail.service';
import { HandleTokenRequestService } from '../../../../../../../service/common/handle-token-request.service';
import { AmS365TransactionService } from '../../../services/transaction/am-s365-transaction.service';
import { UtilTransactionService } from '../../../../../../../service/common/util-transaction.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  IAMS365DetailState,
  IAMS365UpdateConfirmState,
} from '../../../interfaces/state.interface';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../../enums/common-value.enum';
import { S365AccountVoucherBuilder } from '../../../interfaces/voucher.interface';
import { AMS365UrlCollection } from '../../../enum/url-collection.enum';
import { ModalTokenComponent } from '../../../../../../../view/private/token/modal-token/modal-token.component';
import { ERequestTypeTransaction } from '../../../../../../../enums/transaction-header.enum';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpStatusCode } from '../../../../../../../enums/http-status-code.enum';
import { EAMS365RouteProtected } from '../../../enum/route-protected.enum';

@Component({
  selector: 'byte-am-s365-remove-confirm',
  templateUrl: './am-s365-remove-confirm.component.html',
  styleUrls: ['./am-s365-remove-confirm.component.scss']
})
export class AmS365RemoveConfirmComponent implements OnInit {

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
    private voucherDefinitionService: AmdS365DetailService,
    private handleTokenRequest: HandleTokenRequestService,
    private transactionService: AmS365TransactionService,
    private utilsTransaction: UtilTransactionService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.initDefinition();
    this.utils.hideLoader();
  }

  initDefinition() {
    const { account } = this.parameterManagement.getParameter<IAMS365DetailState>(PROTECTED_PARAMETER_STATE);

    const accountDetail = new S365AccountVoucherBuilder()
      .typeClient(account.clientType)
      .name(account.name)
      .documentNumber(account.documentNumber)
      .address(account.address)
      .city(account.city)
      .country(account.countryName)
      .bankName(account.bankName)
      .product(+account.accountType)
      .accountNumber(account.account)
      .build();

    this.voucherLayout = this.voucherDefinitionService.buildVoucherDefinition({
      account: accountDetail,
    });
  }

  previous() {
    this.utils.showLoader();
    const state = this.parameterManagement.getParameter<IAMS365DetailState>(PROTECTED_PARAMETER_STATE);
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: state,
      [PROTECTED_PARAMETER_ROUTE]: EAMS365RouteProtected.REMOVE,
    });

    this.router.navigate([AMS365UrlCollection.DELETE]).finally(() => {});
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

    const state = this.parameterManagement.getParameter<IAMS365DetailState>(PROTECTED_PARAMETER_STATE);
    return this.transactionService.deleteAccount({
      account: state.account.account,
      properties: {
        bank: state.account.bank,
        country: state.account.country,
        registry: state.account.registry,
      }
      }, this.isTokenRequired, token)
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
    const state = this.parameterManagement.getParameter<IAMS365DetailState>(PROTECTED_PARAMETER_STATE);
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        ...state,
        transactionResponse: response,
      } as IAMS365UpdateConfirmState,
      [PROTECTED_PARAMETER_ROUTE]: EAMS365RouteProtected.REMOVE_VOUCHER,
    });

    this.router.navigate([AMS365UrlCollection.DELETE_VOUCHER]).finally(() => {});
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }
}
