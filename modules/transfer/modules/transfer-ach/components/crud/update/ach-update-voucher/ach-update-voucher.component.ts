import { Component, OnInit } from '@angular/core';
import { AdfAlertModalComponent, IDataReading, ITableStructure } from '@adf/components';
import { ECrudAchTypeClient } from '../../../../enum/ach-crud-control-name.enum';
import { IUpdateAchForm } from '../../../../interfaces/crud/crud-form.interface';
import { Router } from '@angular/router';
import { AtdCrudManagerService } from '../../../../services/definition/crud/atd-crud-manager.service';
import { IAchFormStorageLayout, IAchUpdateStorageLayout } from '../../../../interfaces/ach-transfer.interface';
import { IAchAccount } from '../../../../interfaces/ach-account-interface';
import { TransferACHService } from '../../../../services/transaction/transfer-ach.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IAchCrudTransactionResponse } from '../../../../interfaces/crud/crud-create.interface';
import { EACHCrudUrlNavigationCollection, EACHNavigationParameters } from '../../../../enum/navigation-parameter.enum';
import { AtdTableManagerService } from '../../../../services/definition/table/atd-table-manager.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { UtilService } from 'src/app/service/common/util.service';
import { UtilWorkFlowService } from '../../../../../../../../service/common/util-work-flow.service';

@Component({
  selector: 'byte-ach-update-voucher',
  templateUrl: './ach-update-voucher.component.html',
  styleUrls: ['./ach-update-voucher.component.scss'],
})
export class AchUpdateVoucherComponent implements OnInit {
  voucherLayout: IDataReading | null = null;

  typeAlert: string | null = null;
  messageAlert: string | null = null;
  typeClient: ECrudAchTypeClient | undefined;
  formValues!: IUpdateAchForm;
  selectedAccount!: IAchAccount;
  tableModifyDefinition: ITableStructure | null = null;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private router: Router,
    private crudManagerDefinition: AtdCrudManagerService,
    private persistStepStateService: ParameterManagementService,
    private achTransaction: TransferACHService,
    private modalService: NgbModal,
    private tableManagerDefinition: AtdTableManagerService,
    private utils: UtilService,
    private utilWorkFlow: UtilWorkFlowService,
  ) {
    const updateForm: IAchFormStorageLayout = this.persistStepStateService.getParameter('achUpdateForm');

    this.typeClient = updateForm?.typeClient;

    router.events.subscribe((event: any) => {
      if (event.navigationTrigger === 'popstate') {
        this.resetStorage();
      }
    });
  }

  ngOnInit(): void {
    const updateForm: IAchUpdateStorageLayout = this.persistStepStateService.getParameter('achUpdateForm');

    this.formValues = updateForm?.formValues as IUpdateAchForm;
    this.selectedAccount = updateForm?.accountSelected as IAchAccount;

    this.initDefinition();
    this.modifyTableDefinition();
  }

  initDefinition() {
    switch (this.typeClient) {
      case ECrudAchTypeClient.NATURAL:
        this.buildVoucherNaturalClient(this.selectedAccount, this.formValues);
        break;
      case ECrudAchTypeClient.LEGAL:
        this.buildVoucherLegalClient(this.selectedAccount, this.formValues);
        break;
      default:
        this.buildVoucherNaturalClient(this.selectedAccount, this.formValues);
        break;
    }
  }

  modifyTableDefinition() {
    this.tableModifyDefinition = this.tableManagerDefinition.buildModifyHistoryTable(this.selectedAccount);
  }

  buildVoucherNaturalClient(selectedAccount: IAchAccount, formValues: IUpdateAchForm) {
    this.voucherLayout = this.crudManagerDefinition.buildUpdateVoucherForNaturalClient(selectedAccount, formValues);
  }

  buildVoucherLegalClient(selectedAccount: IAchAccount, formValues: IUpdateAchForm) {
    this.voucherLayout = this.crudManagerDefinition.buildUpdateVoucherForLegalClient(selectedAccount, formValues);
  }

  nextStep() {
    this.handleShowUpdateModal();
  }

  executeUpdateAccount() {
    this.utils.showLoader();
    const data = this.crudManagerDefinition.builderDataToUpdate({
      selectedAccount: this.selectedAccount,
      formValues: this.formValues,
    });

    this.achTransaction.updateAccountAch(data, `${this.selectedAccount?.bank}`, this.selectedAccount?.account).subscribe(
      {
        next: (response) => {
          this.goToConfirmation(response);
        },
        error: (error: HttpErrorResponse) => {
          this.utils.hideLoader();
          this.showAlert('error', error?.error?.message ?? 'account_update_error');
          this.scrollToTop();
        },
      }
    );
  }

  lastStep() {
    this.utils.showLoader();
    this.resetStorage();
    this.router.navigate([EACHCrudUrlNavigationCollection.UPDATE_HOME]).finally(() => this.utils.hideLoader());
  }

  goToConfirmation(serviceResponse: IAchCrudTransactionResponse) {
    this.persistStepStateService.sendParameters({
      achUpdateForm: {
        transactionResponse: serviceResponse,
        accountSelected: this.selectedAccount,
        formValues: this.formValues,
        typeClient: this.selectedAccount.clientType,
      } as IAchUpdateStorageLayout,
    });

    this.saveNavigationProtectedParameter();

    this.router.navigate([EACHCrudUrlNavigationCollection.UPDATE_CONFIRMATION]).finally(() => {
      this.utils.hideLoader();
    });
  }

  handleShowUpdateModal() {
    const modal = this.modalService.open(AdfAlertModalComponent, {
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'} alert-modal`,
      size: `lg`,
    });

    modal.dismissed.subscribe(() => {
      return;
    });

    modal.componentInstance.data = this.utilWorkFlow.buildAlertToUpdate();

    modal.result.then((isConfirm) => {
      if (!isConfirm) {
        return;
      }

      this.executeUpdateAccount();
    });
  }

  saveNavigationProtectedParameter() {
    this.persistStepStateService.sendParameters({
      navigationProtectedParameter: EACHNavigationParameters.CRUD_UPDATE_CONFIRMATION,
    });
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  resetStorage() {
    this.persistStepStateService.sendParameters({
      navigationProtectedParameter: EACHNavigationParameters.CRUD_UPDATE_FORM,
    });
  }

  scrollToTop() {
    this.utils.scrollToTop();
  }
}
