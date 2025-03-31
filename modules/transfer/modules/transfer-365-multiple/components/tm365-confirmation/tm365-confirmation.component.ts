import { Component, OnInit } from '@angular/core';
import { AdfFormatService, IDataReading, ITableStructure } from '@adf/components';
import { UtilService } from '../../../../../../service/common/util.service';
import { Router } from '@angular/router';
import { Tm365dVoucherService } from '../../services/definition/tm365d-voucher.service';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { IAccount } from '../../../../../../models/account.inteface';
import { ModalTokenComponent } from '../../../../../../view/private/token/modal-token/modal-token.component';
import { ERequestTypeTransaction } from '../../../../../../enums/transaction-header.enum';
import {
  IACHTransactionResponse,
  TAchTransactionResponse
} from '../../../transfer-ach/interfaces/ach-transfer.interface';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpStatusCode } from '../../../../../../enums/http-status-code.enum';
import { EACHTypeTransaction } from '../../../transfer-ach/enum/transfer-ach.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilTransactionService } from '../../../../../../service/common/util-transaction.service';
import { ITM365ConfirmationState } from '../../interfaces/state.interface';
import { ETm365UrlCollection } from '../../enum/url-collection.enum';
import { ITM365FileLoadedList } from '../../interfaces/load-file.interface';
import { EMt365MultipleRouteProtected } from '../../enum/route-protected.enum';
import { HandleTokenRequestService } from '../../../../../../service/common/handle-token-request.service';
import { Tm365TransferService } from '../../services/execution/tm365-transfer.service';

@Component({
  selector: 'byte-tm365-confirmation',
  templateUrl: './tm365-confirmation.component.html',
  styleUrls: ['./tm365-confirmation.component.scss']
})
export class Tm365ConfirmationComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  voucherLayout!: IDataReading;
  tableStructure!: ITableStructure;

  sourceAccountSelected!: IAccount;
  credits = 0;
  total = '';
  currency = '';

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get isTokenRequired() {
    return this.handleTokenRequest.isTokenRequired();
  }

  get userVirtualScrollInTable() {
    return this.tableStructure.items.length > 8
  }

  constructor(
    private utils: UtilService,
    private router: Router,
    private tm365VoucherDefinitionService: Tm365dVoucherService,
    private parameterManagement: ParameterManagementService,
    private modalService: NgbModal,
    private utilsTransaction: UtilTransactionService,
    private transfer365Multiple: Tm365TransferService,
    private handleTokenRequest: HandleTokenRequestService,
    private adfFormat: AdfFormatService
  ) { }

  ngOnInit(): void {
    this.initState();
    this.initDefinition();
    this.utils.hideLoader();
  }

  initState() {
    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);
    this.sourceAccountSelected = state.sourceAccountSelected;
    this.calcSummary();
  }

  calcSummary() {
    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);
    const accounts: ITM365FileLoadedList = state.targetAccountListFromFile;
    this.credits = accounts.length;
    this.currency = this.sourceAccountSelected.currency;
    const calcTotal = accounts.reduce((acc, register) => acc + this.utils.parseNumberAsFloat(register.amount), 0);
    this.total = this.adfFormat.formatAmount(calcTotal.toFixed(2)) + '';
  }


  initDefinition() {
    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);

    this.voucherLayout = this.tm365VoucherDefinitionService.buildVoucherConfirmationLayout({
      sourceAccount: this.sourceAccountSelected,
    });

    this.tableStructure = this.tm365VoucherDefinitionService.buildTableLayout({
      accounts: state.targetAccountListFromFile,
    });
  }

  showAlert(typeAlert: string, message: string) {
    this.typeAlert = typeAlert;
    this.messageAlert = message;
  }

  previous() {
    const { targetAccountListFromFile, ...state } = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);

    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: state,
      [PROTECTED_PARAMETER_ROUTE]: null,
    });
    this.router.navigate([ETm365UrlCollection.HOME]).finally(() => {});
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

    (modal.result as Promise<TAchTransactionResponse>).then(
      (result) => {
        if (!result) return;
        this.handleResponseTransaction(result);
      },
      (error) => error);
  }

  executeTransaction(token?: string) {
    this.utils.showLoader();
    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);

    return this.transfer365Multiple.execute({
      sourceAccountSelected: this.sourceAccountSelected,
      targetAccountListFromFile: state.targetAccountListFromFile,
      formValues: state.formValues,
      isTokenRequired: this.isTokenRequired,
      token
      })
      .pipe(
        map(response => this.utilsTransaction.handleResponseTransaction<IACHTransactionResponse>(response as any)),
        catchError(error => of(this.utilsTransaction.handleErrorTransaction<IACHTransactionResponse>(error))),
      );
  }

  handleResponseTransaction(response: any) {
    if (+response?.status !== HttpStatusCode.SUCCESS_TRANSACTION && +response?.status !== +HttpStatusCode.SIGNATURE_TRACKING) {
      this.utils.hideLoader();
      this.showAlert('error', response?.message ?? '');
      this.utils.scrollToTop();
      return;
    }

    const isSignatureTrackingTransaction = Number(response?.status) === Number(HttpStatusCode.SIGNATURE_TRACKING);
    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);

    const parameters: ITM365ConfirmationState = {
      ...state,
      transactionResponse: isSignatureTrackingTransaction ? null : response?.data,
      message: isSignatureTrackingTransaction ? response?.message : undefined,
      typeTransaction: isSignatureTrackingTransaction ? EACHTypeTransaction.SIGNATURE_TRACKING : EACHTypeTransaction.DEFAULT,
    };

    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: parameters,
      [PROTECTED_PARAMETER_ROUTE]: EMt365MultipleRouteProtected.VOUCHER,
    });

    this.router.navigate([ETm365UrlCollection.VOUCHER]).finally(() => {});
  }
}
