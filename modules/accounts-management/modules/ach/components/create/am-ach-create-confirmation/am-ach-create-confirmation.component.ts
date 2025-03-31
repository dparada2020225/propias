import { Component, OnInit } from '@angular/core';
import { AMAchUrlCollection } from '../../../enum/url-collection.enum';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../../enums/common-value.enum';
import { IAMACHHomeSTate } from '../../../interfaces/state.interface';
import { UtilService } from '../../../../../../../service/common/util.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../../service/navegation-parameters/parameter-management.service';
import { AmdAchDetailService } from '../../../services/definition/amd-ach-detail.service';
import { IDataReading } from '@adf/components';
import { IAMACHAccountDetail } from '../../../interfaces/voucher.interface';
import { HandleTokenRequestService } from '../../../../../../../service/common/handle-token-request.service';
import { ModalTokenComponent } from '../../../../../../../view/private/token/modal-token/modal-token.component';
import { ERequestTypeTransaction } from '../../../../../../../enums/transaction-header.enum';
import { IUserInfo } from '../../../../../../../models/user-info.interface';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpStatusCode } from '../../../../../../../enums/http-status-code.enum';
import { AcAchTransactionService } from '../../../services/transaction/ac-ach-transaction.service';
import { IAMACHAddAccountProperties, IAMACHAddAccountRequest } from '../../../interfaces/transaction.interface';
import { UtilTransactionService } from '../../../../../../../service/common/util-transaction.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AmACHRouteProtected } from '../../../enum/route-protected.enum';
import { EProductFromCode } from '../../../../../../../enums/product.enum';

@Component({
  selector: 'byte-am-ach-create-confirmation',
  templateUrl: './am-ach-create-confirmation.component.html',
  styleUrls: ['./am-ach-create-confirmation.component.scss']
})
export class AmAchCreateConfirmationComponent implements OnInit {
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
  ) { }

  ngOnInit(): void {
    this.initDefinition();
    this.utils.hideLoader();
  }

  initDefinition() {
    const state = this.parameterManagement.getParameter<IAMACHHomeSTate>(PROTECTED_PARAMETER_STATE);
    const accountDetail = new IAMACHAccountDetail()
      .typeClient(state.typeClientSelected.name)
      .bankName(state.bankSelected.description)
      .currency(state.currencySelected.currency)
      .typeAccount(state.productSelected.description)
      .account(state.formValues.account)
      .name(state.formValues.name)
      .status('')
      .email(state.formValues.email)
      .typeIdentification(state.documentIdentificationSelected.description)
      .identificationNumber(state.formValues.noIdentifier)
      .reason(state.reasonSelected.name)
      .build();

    this.voucherLayout = this.voucherDefinitionService.buildVoucherConfirmationLayout({
      account: accountDetail,
      useUpdateMode: false,
    });
  }

  previous() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: undefined,
      [PROTECTED_PARAMETER_ROUTE]: AmACHRouteProtected.CREATE,
    });

    this.router.navigate([AMAchUrlCollection.CREATE]).finally(() => {});
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
    const state = this.parameterManagement.getParameter<IAMACHHomeSTate>(PROTECTED_PARAMETER_STATE);
    const clientType = state.formValues.typeCustomer === 'N' ? 'NATURAL' : 'LEGAL';

    const dataToExecuteTransaction = {
      type: EProductFromCode[String(state.formValues.typeAccount).padStart(2, '0')],
      alias: state.formValues.name,
      account: state.formValues.account,
      currency: 'USD',
      useAnyCurrency: false,
      clientType,
      name: state.formValues.name,
      favorite: state.formValues.isAddToFavorites,
      properties: {
        bank: Number(state.formValues.bank),
        email: state.formValues.email,
        clientId: userInfo.customerCode,
        documentType: state.formValues.typeIdentifier,
        documentNumber: state.formValues.noIdentifier,
        favorite: state.formValues.isAddToFavorites ? 'true' : 'false',
      } as IAMACHAddAccountProperties
    } as IAMACHAddAccountRequest;

    console.log(dataToExecuteTransaction);

    return this.transactionService.addAccount(dataToExecuteTransaction)
      .pipe(
        map((response) => this.utilsTransaction.handleResponseTransaction(response)),
        catchError(error => of(this.utilsTransaction.handleErrorTransaction(error))),
      );
  }

  formatNumber(num: string): string {
    return num.toString().padStart(2, '0');
  }

  handleResponseTransaction(response: any) {
    if (+response?.status !== HttpStatusCode.SUCCESS_TRANSACTION) {
      this.utils.hideLoader();
      this.showAlert('error', response?.message ?? '');
      this.utils.scrollToTop();
      return;
    }

    this.utils.showLoader();
    const state = this.parameterManagement.getParameter<IAMACHHomeSTate>(PROTECTED_PARAMETER_STATE);
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        ...state,
        transactionResponse: response,
      } as IAMACHHomeSTate,
      [PROTECTED_PARAMETER_ROUTE]: AmACHRouteProtected.CREATE_VOUCHER,
    });
    this.router.navigate([AMAchUrlCollection.CREATE_VOUCHER]).finally(() => {});
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

}
