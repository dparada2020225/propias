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
import { IAMACHHomeSTate, IAMACHHomeUpdateState } from '../../../interfaces/state.interface';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../../enums/common-value.enum';
import { IAMACHAccountDetail } from '../../../interfaces/voucher.interface';
import { AMAchUrlCollection } from '../../../enum/url-collection.enum';
import { IUserInfo } from '../../../../../../../models/user-info.interface';
import { IAMACHAddAccountProperties, IAMACHAddAccountRequest, IAMACHUpdateAccountRequest } from '../../../interfaces/transaction.interface';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpStatusCode } from '../../../../../../../enums/http-status-code.enum';
import { Product } from '../../../../../../../enums/product.enum';
import { ACH_SERVICE_CODE } from '../../../../../interfaces/am-account-list.interface';
import { AmACHRouteProtected } from '../../../enum/route-protected.enum';

@Component({
  selector: 'byte-am-ach-update-confirmation',
  templateUrl: './am-ach-update-confirmation.component.html',
  styleUrls: ['./am-ach-update-confirmation.component.scss']
})
export class AmAchUpdateConfirmationComponent implements OnInit {

  typeAlert: string | null = null;
  messageAlert: string | null = null;

  voucherLayout!: IDataReading;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get isTokenRequired() {
    return this.handleTokenRequest.isTokenRequired(ACH_SERVICE_CODE);
  }

  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManagement: ParameterManagementService,
    private voucherDefinitionService: AmdAchDetailService,
    private handleTokenRequest: HandleTokenRequestService,
    private transactionService: AcAchTransactionService,
    private utilsTransaction: UtilTransactionService,
  ) { }

  ngOnInit(): void {
    this.initDefinition();
    this.utils.hideLoader();
  }

  initDefinition() {
    const state = this.parameterManagement.getParameter<IAMACHHomeUpdateState>(PROTECTED_PARAMETER_STATE);

    const accountDetail = new IAMACHAccountDetail()
      .typeClient((state.account.clientType === 'LEGAL' || state.account.clientType === 'J') ? 'ac:ach_label_person_j' : 'ac:ach_label_person_n')
      .bankName(state.account.bankName)
      .currency(state.account.currency)
      .typeAccount(this.utils.getProductNameFromEquivalence(state.account.type).toUpperCase())
      .account(state.account.account)
      .name(state.formValues.name)
      .status(state.account.status ?? 'INACTIVA')
      .email(state.formValues.email)
      .typeIdentification(state.documentTypeLabel)
      .identificationNumber(state.formValues.noIdentifier)
      .reason(state.reasonSelected.name)
      .build();

    this.voucherLayout = this.voucherDefinitionService.buildVoucherConfirmationLayout({
      account: accountDetail,
      useUpdateMode: true,
    });
  }

  previous() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_ROUTE]: AmACHRouteProtected.UPDATE,
    });

    this.router.navigate([AMAchUrlCollection.UPDATE]).finally(() => {});
  }

  nextStep() {
    this.handleExecuteTransaction();
  }

  handleExecuteTransaction() {
    this.executeTransaction()
      .subscribe({
        next: (response) => {
          this.handleResponseTransaction(response);
        }
      });
  }

  executeTransaction() {
    this.utils.showLoader();

    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');
    const state = this.parameterManagement.getParameter<IAMACHHomeUpdateState>(PROTECTED_PARAMETER_STATE);

    const request: IAMACHAddAccountRequest = {
      type: state.account.type,
      alias: state.formValues.name,
      account: state.account.account,
      status: state.account.status=== 'ACTIVA' ? 'A':'I',
      currency: 'USD',
      clientType: state.account.clientType,
      name: state.formValues.name,
      favorite: state.account.favorite,
      useAnyCurrency: false,
      properties: {
        bank: Number(state.account.bank),
        email: state.formValues.email,
        clientId: userInfo.customerCode,
        documentType: state.formValues.typeIdentifier,
        documentNumber: state.formValues.noIdentifier,
        favorite: state.account.favorite ? 'true' : 'false',
      } as IAMACHAddAccountProperties
    } as IAMACHAddAccountRequest;


    const dataToExecuteTransaction = {
      id: state.id,
      request
    } as IAMACHUpdateAccountRequest;

    return this.transactionService.updateAccount(dataToExecuteTransaction)
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
    const state = this.parameterManagement.getParameter<IAMACHHomeSTate>(PROTECTED_PARAMETER_STATE);
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        ...state,
        transactionResponse: response,
      } as IAMACHHomeSTate,
      [PROTECTED_PARAMETER_ROUTE]: AmACHRouteProtected.UPDATE_VOUCHER,
    });

    this.router.navigate([AMAchUrlCollection.UPDATE_VOUCHER]).finally(() => {});
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

}
