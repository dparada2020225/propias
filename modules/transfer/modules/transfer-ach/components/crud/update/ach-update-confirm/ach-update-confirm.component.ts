import { Component, OnInit } from '@angular/core';
import { AdfFormatService, IDataReading, IHeadBandAttribute, ITableStructure } from '@adf/components';
import { Router } from '@angular/router';
import { AtdCrudManagerService } from '../../../../services/definition/crud/atd-crud-manager.service';
import { IAchUpdateStorageLayout } from '../../../../interfaces/ach-transfer.interface';
import { ECrudAchTypeClient } from '../../../../enum/ach-crud-control-name.enum';
import { IAtdConfirmationVoucher } from '../../../../interfaces/crud/update.interface';
import { IAchCrudTransactionResponse } from '../../../../interfaces/crud/crud-create.interface';
import { IHeadBandLayoutConfirm } from '../../../../../../../../models/util-work-flow.interface';
import { AtdTableManagerService } from '../../../../services/definition/table/atd-table-manager.service';
import { IAchAccount } from '../../../../interfaces/ach-account-interface';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { UtilService } from 'src/app/service/common/util.service';
import { IUpdateAchForm } from '../../../../interfaces/crud/crud-form.interface';
import { EACHTransferUrlNavigationCollection } from '../../../../enum/navigation-parameter.enum';
import { IPrint } from '../../../../../../interface/print-data-interface';

@Component({
  selector: 'byte-ach-update-confirm',
  templateUrl: './ach-update-confirm.component.html',
  styleUrls: ['./ach-update-confirm.component.scss'],
})
export class AchUpdateConfirmComponent implements OnInit {
  voucherLayout: IDataReading | null = null;
  pdfLayout: IPrint | null = null;
  headbandLayout: IHeadBandAttribute[] = [];

  typeAlert: string | null = null;
  messageAlert: string | null = null;
  tableModifyDefinition: ITableStructure | null = null;
  selectedAccount: IAchAccount | null = null;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private router: Router,
    private adfFormat: AdfFormatService,
    private utilWorkFlow: UtilWorkFlowService,
    private persistStepStateService: ParameterManagementService,
    private crudManagerDefinition: AtdCrudManagerService,
    private tableManagerDefinition: AtdTableManagerService,
    private util: UtilService
  ) {}

  ngOnInit(): void {
    const updateForm: IAchUpdateStorageLayout = this.persistStepStateService.getParameter('achUpdateForm');

    this.selectedAccount = updateForm?.accountSelected as IAchAccount;

    this.showAlert('success', 'ach.update_alert_confirmation');
    this.initDefinition(updateForm);
    this.headBandLayoutBuilder(updateForm?.transactionResponse as IAchCrudTransactionResponse);
    this.modifyTableDefinition(updateForm?.transactionResponse as IAchCrudTransactionResponse);
  }

  lastStep() {
    this.resetStorage();
    this.router.navigate([EACHTransferUrlNavigationCollection.HOME]).then(() => {});
  }

  initDefinition(achUpdateState: IAchUpdateStorageLayout) {
    switch (achUpdateState.typeClient) {
      case ECrudAchTypeClient.NATURAL:
        this.buildVoucherNaturalClient(achUpdateState);
        break;
      case ECrudAchTypeClient.LEGAL:
        this.buildVoucherLegalClient(achUpdateState);
        break;
      default:
        this.buildVoucherNaturalClient(achUpdateState);
        break;
    }
  }

  modifyTableDefinition(serviceResponse: IAchCrudTransactionResponse) {
    this.tableModifyDefinition = this.tableManagerDefinition.buildModifyHistoryTable(this.selectedAccount as IAchAccount, serviceResponse);
  }

  buildVoucherNaturalClient(achUpdateState: IAchUpdateStorageLayout) {
    const properties: IAtdConfirmationVoucher = {
      formValues: achUpdateState.formValues as IUpdateAchForm,
      accountToUpdate: achUpdateState.accountSelected as IAchAccount,
      reference: achUpdateState.transactionResponse?.reference as string,
    };

    this.voucherLayout = this.crudManagerDefinition.buildUpdateConfirmationNaturalClient(properties);
  }

  buildVoucherLegalClient(achUpdateState: IAchUpdateStorageLayout) {
    const properties: IAtdConfirmationVoucher = {
      formValues: achUpdateState.formValues as IUpdateAchForm,
      accountToUpdate: achUpdateState.accountSelected as IAchAccount,
      reference: achUpdateState.transactionResponse?.reference as string,
    };

    this.voucherLayout = this.crudManagerDefinition.buildUpdateConfirmationLegalClient(properties);
  }

  headBandLayoutBuilder(serviceResponse: IAchCrudTransactionResponse) {
    const headBandLayoutConfirm: IHeadBandLayoutConfirm = {
      date: this.adfFormat.getFormatDateTime(serviceResponse.dateTime),
      reference: serviceResponse.reference,
    };

    this.headbandLayout = this.utilWorkFlow.getHeadBandLayoutConfirm(headBandLayoutConfirm);
  }

  resetStorage() {
    this.persistStepStateService.sendParameters({
      achUpdateForm: null,
      navigationProtectedParameter: null,
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
