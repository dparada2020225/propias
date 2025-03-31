import { Component, OnInit } from '@angular/core';
import { ECrudAchTypeClient } from '../../../../enum/ach-crud-control-name.enum';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ICrudAchForm } from '../../../../interfaces/crud/crud-form.interface';
import { IDataReading } from '@adf/components';
import { AtdCreateManagerService } from '../../../../services/definition/crud/create/atd-create-manager.service';
import { IACHBank, IAchCrudTransactionResponse, IATDCrudCreateVoucher } from '../../../../interfaces/crud/crud-create.interface';
import { TransferACHService } from '../../../../services/transaction/transfer-ach.service';
import { AtdCrudManagerService } from '../../../../services/definition/crud/atd-crud-manager.service';
import { EACHCrudUrlNavigationCollection, EACHNavigationParameters } from '../../../../enum/navigation-parameter.enum';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { UtilService } from 'src/app/service/common/util.service';
import { ICrudACHStorageState } from '../../../../interfaces/crud/ICrudACHStorageState';
import { HandleTokenRequestService } from '../../../../../../../../service/common/handle-token-request.service';
import { UtilTransactionService } from '../../../../../../../../service/common/util-transaction.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpStatusCode } from '../../../../../../../../enums/http-status-code.enum';
import { ModalTokenComponent } from '../../../../../../../../view/private/token/modal-token/modal-token.component';
import { ERequestTypeTransaction } from '../../../../../../../../enums/transaction-header.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ITransactionFailedResponse,
  ITransactionSuccessResponse
} from '../../../../../../../../models/utils-transaction.interface';

@Component({
  selector: 'byte-ach-create-voucher',
  templateUrl: './ach-create-voucher.component.html',
  styleUrls: ['./ach-create-voucher.component.scss'],
})
export class AchCreateVoucherComponent implements OnInit {
  voucherLayout: IDataReading | null = null;

  typeAlert: string | null = null;
  messageAlert: string | null = null;
  typeClient: ECrudAchTypeClient | null = null;
  formValues: ICrudAchForm | null = null;
  bankSelected: IACHBank | null = null;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private router: Router,
    private location: Location,
    private achTransaction: TransferACHService,
    private createManagerDefinition: AtdCreateManagerService,
    private crudManagerDefinition: AtdCrudManagerService,
    private persistStepStateService: ParameterManagementService,
    private util: UtilService,
    private handleTokenRequest: HandleTokenRequestService,
    private utilsTransaction: UtilTransactionService,
    private modalService: NgbModal,
  ) {
    const crudState: ICrudACHStorageState = this.persistStepStateService.getParameter('achCrudState');

    this.typeClient = crudState?.typeClient;
    this.formValues = crudState?.formValues;
    this.bankSelected = crudState?.bankSelected;

    router.events.subscribe((event: any) => {
      if (event.navigationTrigger === 'popstate') {
        this.resetStorage(null);
      }
    });
  }

  ngOnInit(): void {
    this.initDefinition();
  }

  initDefinition() {
    switch (this.typeClient) {
      case ECrudAchTypeClient.NATURAL:
        this.buildVoucherLayoutForNaturalClient();
        break;
      case ECrudAchTypeClient.LEGAL:
        this.buildVoucherLayoutForLegalClient();
        break;
      default:
        this.buildVoucherLayoutForNaturalClient();
        break;
    }
  }

  buildVoucherLayoutForNaturalClient() {
    const naturalClientProperties: IATDCrudCreateVoucher = {
      formValues: this.formValues as ICrudAchForm,
      bankSelected: this.bankSelected as IACHBank,
    };

    this.voucherLayout = this.crudManagerDefinition.buildVoucherForNaturalClient(naturalClientProperties);
  }

  buildVoucherLayoutForLegalClient() {
    const legalClientProperties: IATDCrudCreateVoucher = {
      formValues: this.formValues as ICrudAchForm,
      bankSelected: this.bankSelected as IACHBank,
    };

    this.voucherLayout = this.crudManagerDefinition.buildVoucherForLegalClient(legalClientProperties);
  }

  nextStep() {
    this.handleTokenRequestService();
  }

  lastStep() {
    this.location.back();
    this.resetStorage();
  }

  handleTokenRequestService() {
    if (this.handleTokenRequest.isTokenRequired()) {
      this.tokenModal();
      return
    }

    this.execute().subscribe({
      next: (response) => {
        this.handleTransactionResponse(response);
      }
    });
  }

  tokenModal() {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${this.util.getProfile() || 'byte-theme'} sm-600`,
      size: 'lg',
    });

    modal.componentInstance.typeTransaction = ERequestTypeTransaction.ACH_TRANSFER;
    modal.componentInstance.executeService = this.execute.bind(this);

    modal.result
      .then((result) => {
        if (!result) {
          return;
        }

        this.handleTransactionResponse(result);
      })
      .catch((error) => error);
  }

  execute(token?: string) {
    this.util.showLoader();
    const data = this.createManagerDefinition.buildDataToCreateAccount(this.formValues as ICrudAchForm);

    return this.achTransaction.createAccountAch({
      bodyRequest: data,
      isTokenRequired: this.handleTokenRequest.isTokenRequired(),
      token,
    })
      .pipe(
        map(response => this.utilsTransaction.handleResponseTransaction(response)),
        catchError(error => of(this.utilsTransaction.handleErrorTransaction(error))),
      )
  }

  handleTransactionResponse(response: ITransactionSuccessResponse | ITransactionFailedResponse) {
    if (response.status === HttpStatusCode.INVALID_TOKEN) return

    if (response.status !== HttpStatusCode.SUCCESS_TRANSACTION) {
      this.util.hideLoader();
      this.showAlert('error', response.message ?? 'error:add_ach_account');
      this.scrollToTop();
      return
    }

    this.goToConfirmationScreen(response.data);
  }


  goToConfirmationScreen(serviceResponse: IAchCrudTransactionResponse) {
    this.persistStepStateService.sendParameters({
      achCrudState: {
        formValues: this.formValues,
        typeClient: this.typeClient,
        transactionResponse: serviceResponse,
        bankSelected: this.bankSelected,
      } as ICrudACHStorageState,
    });

    this.saveNavigationProtectedParameter();

    this.router.navigate([EACHCrudUrlNavigationCollection.CREATE_CONFIRMATION]).finally(() => {
      this.util.hideLoader();
    });
  }

  saveNavigationProtectedParameter() {
    this.persistStepStateService.sendParameters({
      navigationProtectedParameter: EACHNavigationParameters.CRUD_CREATE_CONFIRMATION,
    });
  }

  resetStorage(navParam = null) {
    this.persistStepStateService.sendParameters({
      navigationProtectedParameter: navParam,
    });
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }


  scrollToTop() {
    this.util.scrollToTop();
  }
}
