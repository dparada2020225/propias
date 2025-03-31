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
import { AMS365UrlCollection } from '../../../enum/url-collection.enum';
import { AmdS365DetailService } from '../../../services/definition/amd-s365-detail.service';
import { IAMS365AddConfirmState, IAMS365AddHomeState } from '../../../interfaces/state.interface';
import { S365AccountVoucherBuilder } from '../../../interfaces/voucher.interface';
import { AmS365TransactionService } from '../../../services/transaction/am-s365-transaction.service';
import { EAMS365RouteProtected } from '../../../enum/route-protected.enum';

@Component({
  selector: 'byte-am-s365-confirm',
  templateUrl: './am-s365-confirm.component.html',
  styleUrls: ['./am-s365-confirm.component.scss']
})
export class AmS365ConfirmComponent implements OnInit {
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
    const { formValues, bankSelected, countrySelected } = this.parameterManagement.getParameter<IAMS365AddHomeState>(PROTECTED_PARAMETER_STATE);

    const accountDetail = new S365AccountVoucherBuilder()
      .typeClient(formValues.typeClient.toUpperCase())
      .name(formValues.name)
      .documentNumber(formValues.documentNumber)
      .address(formValues.address)
      .city(formValues.city)
      .country(countrySelected.description)
      .bankName(bankSelected.description)
      .product(+formValues.product)
      .accountNumber(formValues.account)
      .build();

    this.voucherLayout = this.voucherDefinitionService.buildVoucherDefinition({
      account: accountDetail,
    });
  }

  previous() {
    this.utils.showLoader();
    const state = this.parameterManagement.getParameter<IAMS365AddHomeState>(PROTECTED_PARAMETER_STATE);
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: state,
      [PROTECTED_PARAMETER_ROUTE]: EAMS365RouteProtected.ADD,
    });

    this.router.navigate([AMS365UrlCollection.CREATE]).finally(() => {});
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

    const bodyRequest = this.buildBodyRequest();
    return this.transactionService.addAccount(bodyRequest, this.isTokenRequired, token)
      .pipe(
        map((response) => this.utilsTransaction.handleResponseTransaction(response)),
        catchError(error => of(this.utilsTransaction.handleErrorTransaction(error))),
      );
  }

  buildBodyRequest() {
    const { formValues } = this.parameterManagement.getParameter<IAMS365AddHomeState>(PROTECTED_PARAMETER_STATE);

    const typeClientMapped = {
      J: 'LEGAL',
      j: 'LEGAL',
      N: 'NATURAL',
      n: 'NATURAL',
    }

    const clientType = typeClientMapped[formValues.typeClient];

    return {
      clientType,
      account: formValues.account,
      name: formValues.name,
      favorite: false,
      properties: {
        country: formValues.country,
        bank: formValues.bank,
        city: formValues.city,
        address: formValues.address,
        favorite: String(false),
        documentNumber: formValues.documentNumber,
        accountType: formValues?.product ? String(formValues.product).padStart(2, '0') : '01'
      }
    }
  }

  handleResponseTransaction(response: any) {
    if (+response?.status !== HttpStatusCode.SUCCESS_TRANSACTION) {
      this.utils.hideLoader();
      this.showAlert('error', response?.message ?? '');
      this.utils.scrollToTop();
      return;
    }

    this.utils.showLoader();
    const state = this.parameterManagement.getParameter<IAMS365AddHomeState>(PROTECTED_PARAMETER_STATE);
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        ...state,
        transactionResponse: response,
      } as IAMS365AddConfirmState,
      [PROTECTED_PARAMETER_ROUTE]: EAMS365RouteProtected.ADD_VOUCHER,
    });

    this.router.navigate([AMS365UrlCollection.CREATE_VOUCHER]).finally(() => {});
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }
}
