import { Component, OnInit } from '@angular/core';
import { AdfFormatService, IDataReading, IHeadBandAttribute } from '@adf/components';
import { Router } from '@angular/router';
import { AtdDeleteConfirmService } from '../../../../services/definition/crud/delete/atd-delete-confirm.service';
import { IAchDeleteStorageLayout } from '../../../../interfaces/ach-transfer.interface';
import { IAchCrudTransactionResponse } from '../../../../interfaces/crud/crud-create.interface';
import { IHeadBandLayoutConfirm } from '../../../../../../../../models/util-work-flow.interface';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { IAchAccount } from '../../../../interfaces/ach-account-interface';
import { EACHTransferUrlNavigationCollection } from '../../../../enum/navigation-parameter.enum';

@Component({
  selector: 'byte-ach-delete',
  templateUrl: './ach-delete.component.html',
  styleUrls: ['./ach-delete.component.scss'],
})
export class AchDeleteComponent implements OnInit {
  voucherLayout: IDataReading | null = null;
  headbandLayout: IHeadBandAttribute[] = [];

  typeAlert: string | null = null;
  messageAlert: string | null = null;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private router: Router,
    private persistStepStateService: ParameterManagementService,
    private deleteTransactionDefinition: AtdDeleteConfirmService,
    private utilWorkFlow: UtilWorkFlowService,
    private adfFormat: AdfFormatService
  ) {}

  ngOnInit(): void {
    const achDeleteState: IAchDeleteStorageLayout = this.persistStepStateService.getParameter('achDeleteState');

    this.voucherLayout = this.deleteTransactionDefinition.buildDeleteConfirmation({
      deletedAccount: achDeleteState.accountSelected as IAchAccount,
      reference: achDeleteState?.transactionResponse?.reference as string,
      datetime: achDeleteState?.transactionResponse?.dateTime as string,
    });

    this.headBandLayoutBuilder({
      reference: achDeleteState?.transactionResponse?.reference as string,
      dateTime: achDeleteState?.transactionResponse?.dateTime as string,
    });

    this.showAlert('success', 'account_successfully_removed');
  }

  lastStep() {
    this.resetStorage();
    this.router.navigate([EACHTransferUrlNavigationCollection.HOME]).then(() => {});
  }

  headBandLayoutBuilder(serviceResponse: IAchCrudTransactionResponse) {
    const headBandLayoutConfirm: IHeadBandLayoutConfirm = {
      date: this.adfFormat.getFormatDateTime(serviceResponse.dateTime),
      reference: serviceResponse.reference,
    };

    this.headbandLayout = this.utilWorkFlow.getHeadBandLayoutConfirm(headBandLayoutConfirm);
  }

  showAlert(typeAlert: string, messageAlert: string) {
    this.messageAlert = messageAlert;
    this.typeAlert = typeAlert;
  }

  resetStorage() {
    this.persistStepStateService.sendParameters({
      achDeleteState: null,
      navigationProtectedParameter: null,
    });
  }
}
