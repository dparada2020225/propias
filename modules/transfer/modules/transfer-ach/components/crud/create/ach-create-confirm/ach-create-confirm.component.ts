import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdfFormatService, IDataReading, IHeadBandAttribute } from '@adf/components';
import { AtdCrudManagerService } from '../../../../services/definition/crud/atd-crud-manager.service';
import { IHeadBandLayoutConfirm } from '../../../../../../../../models/util-work-flow.interface';
import { IACHBank, IAchCrudTransactionResponse } from '../../../../interfaces/crud/crud-create.interface';
import { ECrudAchTypeClient } from '../../../../enum/ach-crud-control-name.enum';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { ICrudACHStorageState } from '../../../../interfaces/crud/ICrudACHStorageState';
import { EACHTransferUrlNavigationCollection } from '../../../../enum/navigation-parameter.enum';
import { IPrint } from '../../../../../../interface/print-data-interface';

@Component({
  selector: 'byte-ach-create-confirm',
  templateUrl: './ach-create-confirm.component.html',
  styleUrls: ['./ach-create-confirm.component.scss'],
})
export class AchCreateConfirmComponent implements OnInit, OnDestroy {
  voucherLayout: IDataReading | null = null;
  pdfLayout: IPrint | null = null;
  headbandLayout: IHeadBandAttribute[] = [];

  typeAlert: string | null = null;
  messageAlert: string | null = null;
  bankSelected: IACHBank | null = null;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private router: Router,
    private adfFormat: AdfFormatService,
    private utilWorkFlow: UtilWorkFlowService,
    private persistStepStateService: ParameterManagementService,
    private crudManagerDefinition: AtdCrudManagerService
  ) {}

  ngOnInit(): void {
    const crudState: ICrudACHStorageState = this.persistStepStateService.getParameter('achCrudState');
    this.bankSelected = crudState?.bankSelected;

    this.initDefinition(crudState);
    this.headBandLayoutBuilder(crudState.transactionResponse as IAchCrudTransactionResponse);

    this.showAlert('success', 'ach_success_account_created');
  }

  ngOnDestroy(): void {
    this.resetStorage();
  }

  initDefinition(crudState: ICrudACHStorageState) {
    switch (crudState?.typeClient) {
      case ECrudAchTypeClient.NATURAL:
        this.voucherLayout = this.crudManagerDefinition.buildConfirmationVoucherForNaturalClient({
          formValues: crudState?.formValues,
          reference: crudState?.transactionResponse?.reference as string,
          datetime: crudState?.transactionResponse?.dateTime as string,
          bankSelected: this.bankSelected as IACHBank,
        });
        break;
      case ECrudAchTypeClient.LEGAL:
        this.voucherLayout = this.crudManagerDefinition.buildConfirmationVoucherForLegalClient({
          formValues: crudState?.formValues,
          reference: crudState?.transactionResponse?.reference as string,
          datetime: crudState?.transactionResponse?.dateTime as string,
          bankSelected: this.bankSelected as IACHBank,
        });
        break;
    }
  }

  lastStep() {
    this.resetStorage();
    this.router.navigate([EACHTransferUrlNavigationCollection.HOME]).then(() => {});
  }

  headBandLayoutBuilder(serviceResponse: IAchCrudTransactionResponse) {
    const headBandLayoutConfirm: IHeadBandLayoutConfirm = {
      date: this.adfFormat.getFormatDateTime(serviceResponse?.dateTime),
      reference: serviceResponse.reference,
    };

    this.headbandLayout = this.utilWorkFlow.getHeadBandLayoutConfirm(headBandLayoutConfirm);
  }

  resetStorage() {
    this.persistStepStateService.sendParameters({
      achCrudState: null,
      navigationProtectedParameter: null,
    });
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }
}
