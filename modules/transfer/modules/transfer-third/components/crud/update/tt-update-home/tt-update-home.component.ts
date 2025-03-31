import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AdfAlertModalComponent, AdfFormBuilderService, ILayout} from '@adf/components';
import {FormGroup} from '@angular/forms';
import {TTDCRUDManagerService} from '../../../../services/definition/crud/manager/ttd-crud-manager.service';
import {IThirdTransferUpdateState} from '../../../../interfaces/third-transfer-persistence.interface';
import {IThirdTransfersAccounts} from '../../../../../../interface/transfer-data-interface';
import {environment} from '../../../../../../../../../environments/environment';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {IUpdateThird, UpdateThirdBuilder} from '../../../../interfaces/crud/update-third-interface';
import {TransferThirdService} from '../../../../services/transaction/transfer-third.service';
import {IThirdTransferTransactionResponse} from '../../../../interfaces/third-transfer-service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {UtilService} from 'src/app/service/common/util.service';
import {AttributeFormCrud} from '../../../../enums/third-transfer-control-name.enum';
import {
  EThirdTransferNavigateParameters,
  EThirdTransferUrlNavigationCollection
} from '../../../../enums/third-transfer-navigate-parameters.enum';
import {EProfile} from 'src/app/enums/profile.enum';
import {HandleTokenRequestService} from "../../../../../../../../service/common/handle-token-request.service";
import {catchError, map} from "rxjs/operators";
import {UtilTransactionService} from "../../../../../../../../service/common/util-transaction.service";
import {of} from "rxjs";
import {ModalTokenComponent} from "../../../../../../../../view/private/token/modal-token/modal-token.component";
import {ERequestTypeTransaction} from "../../../../../../../../enums/transaction-header.enum";
import {HttpStatusCode} from "../../../../../../../../enums/http-status-code.enum";

@Component({
  selector: 'byte-tt-update-home',
  templateUrl: './tt-update-home.component.html',
  styleUrls: ['./tt-update-home.component.scss'],
})
export class TtUpdateHomeComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  formLayout!: ILayout;
  form!: FormGroup;

  accountToUpdate!: IThirdTransfersAccounts;
  typeProfile: string = EProfile.SALVADOR;
  private profile: string = environment.profile;
  valoresIniciales;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get classNameLayout() {
    const classNameLayout = {
      [EProfile.SALVADOR]: 'layout_sv'
    }
    return classNameLayout[this.profile] || ''
  }

  get classNameButtons() {
    const className = {
      [EProfile.SALVADOR]: 'no-line_sv hover_button-primary-sv btn-sv'
    }
    return className[this.profile] || '';
  }

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private util: UtilService,
    private transferThirdService: TransferThirdService,
    private parameterManagement: ParameterManagementService,
    private crudServiceManager: TTDCRUDManagerService,
    private crudFormBuilder: AdfFormBuilderService,
    private handleTokenRequestService: HandleTokenRequestService,
    private utilsTransaction: UtilTransactionService,
  ) {
  }

  ngOnInit(): void {
    const updateState: IThirdTransferUpdateState = this.parameterManagement.getParameter('navigateStateParameters');
    this.accountToUpdate = updateState?.accountToUpdate;

    this.initDefinitionUpdate();
  }

  initDefinitionUpdate(): void {
    this.formLayout = this.crudServiceManager.buildUpdateAccountLayoutTTU(this.accountToUpdate);
    this.form = this.crudFormBuilder.formDefinition(this.formLayout?.attributes);
    this.form?.get(AttributeFormCrud.ALIAS)?.setValue(this.accountToUpdate?.alias);
    this.form?.get(AttributeFormCrud.EMAIL)?.setValue(this.accountToUpdate?.email);

    if (this.profile === this.typeProfile) {
      this.valoresIniciales = {
        [AttributeFormCrud.ALIAS]: this.accountToUpdate?.alias,
        [AttributeFormCrud.EMAIL]: this.accountToUpdate?.email,
      }
    }
  }

  nextStep() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }


    this.handleShowUpdateModal()


  }

  backStep() {

    const mapNavigation = {
      [EProfile.SALVADOR]: EThirdTransferUrlNavigationCollection.HOMESV,
      [EProfile.HONDURAS]: EThirdTransferUrlNavigationCollection.HOME,
    }

    this.resetStorage();
    this.router.navigate([mapNavigation[this.profile] || EThirdTransferUrlNavigationCollection.HOME]).then(() => {
    });
  }

  handleTokenRequest() {
    if (this.handleTokenRequestService.isTokenRequired()) {
      this.tokenModal();
      return;
    }

    this.execute().subscribe({
      next: (response) => this.handleTransactionResponse(response),
    })
  }

  tokenModal() {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} sm-600`,
      size: 'lg',
    });

    modal.componentInstance.typeTransaction = ERequestTypeTransaction.AUTHENTICATION;
    modal.componentInstance.executeService = this.execute.bind(this);

    modal.dismissed.subscribe(() => {
      return;
    });

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

    return this.transferThirdService.update({
      bodyRequest: this.buildUpdateAccount(),
      isTokenRequired: this.handleTokenRequestService.isTokenRequired(),
      token,
      numberAccount: this.accountToUpdate?.account
    })
      .pipe(
        map((response) => this.utilsTransaction.handleResponseTransaction<IThirdTransferTransactionResponse>(response)),
        catchError((error) => of(this.utilsTransaction.handleErrorTransaction(error)))
      );
  }

  handleTransactionResponse(response) {
    if (response.status === HttpStatusCode.INVALID_TOKEN) {
      this.util.hideLoader();
      return;
    }

    if (response.status !== HttpStatusCode.SUCCESS_TRANSACTION) {
      this.util.hideLoader();
      this.showAlert('error', response.message as string ?? 'internal_server_error');
      return;
    }

    const data: IThirdTransferTransactionResponse = {
      dateTime: response?.data?.body?.dateTime,
      reference: response?.data?.body?.reference,
    };

    this.goToVoucher(data);
  }

  buildUpdateAccount(): IUpdateThird {
    return new UpdateThirdBuilder()
      .currency(this.util.getISOCurrency(this.accountToUpdate?.currency ?? ''))
      .alias(this.form.get(AttributeFormCrud.ALIAS)?.value ?? '')
      .email(String(this.form.get(AttributeFormCrud.EMAIL)?.value).toLowerCase() ?? '')
      .type(this.util.getProductName(+this.accountToUpdate?.type ?? 0))
      .account(this.accountToUpdate?.account ?? '')
      .favorite(this.accountToUpdate?.favorite ?? false)
      .build();
  }

  goToVoucher(transactionResponse: IThirdTransferTransactionResponse) {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: EThirdTransferNavigateParameters.CRUD_UPDATE_VOUCHER,
      navigateStateParameters: {
        transactionResponse,
        accountToUpdate: this.accountToUpdate,
        formValues: this.form.value,
      } as IThirdTransferUpdateState,
    });

    this.router.navigate(['/transfer/third/update-voucher']).finally(() => this.util.hideLoader());
  }

  handleShowUpdateModal() {
    const modal = this.modalService.open(AdfAlertModalComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} alert-modal`,
      size: `lg`,
    });

    modal.dismissed.subscribe(() => {
      return;
    });

    modal.componentInstance.data = this.crudServiceManager.buildUpdateAlertTTU();

    modal.result.then((result) => {
      if (!result) {
        return;
      }


      this.handleTokenRequest();
    })
      .catch((error) => error);
  }

  formModified(): boolean {
    if (this.profile === this.typeProfile) {
      const campos = Object.keys(this.valoresIniciales);
      for (let campo of campos) {
        if (this.form.get(campo)?.dirty && this.form.get(campo)?.value !== this.valoresIniciales[campo]) {
          return true;
        }
      }
      return false;

    }

    return true;
  }

  resetStorage() {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: null,
      navigateStateParameters: null,
    });
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  hiddenAlert() {
    this.typeAlert = null;
    this.messageAlert = null;
  }

}
