import { Component, OnInit } from '@angular/core';
import { IDataReading } from '@adf/components';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { UtilService } from '../../../../../../service/common/util.service';
import { T365mVoucherService } from '../../services/definition/t365m-voucher.service';
import { HandleTokenRequestService } from '../../../../../../service/common/handle-token-request.service';
import { T365mTransactionService } from '../../services/transaction/t365m-transaction.service';
import { UtilTransactionService } from '../../../../../../service/common/util-transaction.service';
import { IT365MHomeState } from '../../interfaces/state.interface';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { IUserInfo } from '../../../../../../models/user-info.interface';
import { ET365MUrlCollection } from '../../enum/url-collection.enum';
import { ModalTokenComponent } from '../../../../../../view/private/token/modal-token/modal-token.component';
import { ERequestTypeTransaction } from '../../../../../../enums/transaction-header.enum';
import { HttpStatusCode } from '../../../../../../enums/http-status-code.enum';
import { M365MembershipProtectedParameters } from '../../enum/route-protected.enum';

@Component({
  selector: 'byte-am-m365-remove',
  templateUrl: './am-m365-disaffiliate.component.html',
  styleUrls: ['./am-m365-disaffiliate.component.scss']
})
export class AmM365DisaffiliateComponent implements OnInit {

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
    private voucherDefinitionService: T365mVoucherService,
    private handleTokenRequest: HandleTokenRequestService,
    private transactionService: T365mTransactionService,
    private utilsTransaction: UtilTransactionService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.initDefinition();
    this.utils.hideLoader();
  }

  initDefinition() {
    const { account, formValues } = this.parameterManagement.getParameter<IT365MHomeState>(PROTECTED_PARAMETER_STATE);
    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');

    this.voucherLayout = this.voucherDefinitionService.buildVoucherDefinition({
      account,
      formValues,
      email: userInfo.email,
    });
  }

  previous() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: null,
      [PROTECTED_PARAMETER_ROUTE]: null,
    });
    this.router.navigate([ET365MUrlCollection.HOME]).finally(() => {});
  }

  nextStep() {
    this.handleExecuteTransaction();
  }

  handleExecuteTransaction() {
    /*
    if (this.isTokenRequired) {
      this.openTokenModal();
      return;
    }*/

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
    const state = this.parameterManagement.getParameter<IT365MHomeState>(PROTECTED_PARAMETER_STATE);
    return this.transactionService.disaffiliate({
      account: state.formValues.account,
      })
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
    const state = this.parameterManagement.getParameter<IT365MHomeState>(PROTECTED_PARAMETER_STATE);
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        ...state,
        transactionResponse: response,
      },
      [PROTECTED_PARAMETER_ROUTE]: M365MembershipProtectedParameters.DISAFFILIATE_VOUCHER,
    });

    this.router.navigate([ET365MUrlCollection.DISAFFILIATE_VOUCHER]).finally(() => {});
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }
}
