import { Component, OnInit } from '@angular/core';
import { IConfirmationModal, IDataReading, ITableStructure } from '@adf/components';
import { IPrint } from '../../../../../transfer/interface/print-data-interface';
import { TmdAchTableService } from '../../services/definition/tmd-ach-table.service';
import { Router } from '@angular/router';
import { UtilService } from '../../../../../../service/common/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { ETMConsultACHUrlCollection } from '../../enum/url-collection.enum';
import { ITMConsultACHSignatoryListState } from '../../interfaces/state.interface';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { TmAchSignaturesPrintService } from '../../services/print/tm-ach-signatures-print.service';
import { TranslateService } from '@ngx-translate/core';
import { AdminPanelProvidersProtectedParameters } from '../../enum/route-protected.enum';
import { TmdAchModalService } from '../../services/definition/tmd-ach-modal.service';
import {
  BtProofVoucherModalComponent
} from '../../../../../transfer/modules/bulk-transfer/components/bt-proof-voucher-modal/bt-proof-voucher-modal.component';

@Component({
  selector: 'byte-tm-ach-signatory',
  templateUrl: './tm-ach-signatory.component.html',
  styleUrls: ['./tm-ach-signatory.component.scss']
})
export class TmAchSignatoryComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  tableLayout!: ITableStructure;

  voucherLayout!: IDataReading;
  voucherModalLayout!: IConfirmationModal;
  pdfLayout!: IPrint;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private tableDefinitionService: TmdAchTableService,
    private router: Router,
    private utils: UtilService,
    private modalService: NgbModal,
    private parameterManagement: ParameterManagementService,
    private pdfService: TmAchSignaturesPrintService,
    private translate: TranslateService,
    private modalDefinition: TmdAchModalService,
  ) { }

  ngOnInit(): void {
    const { listSignatories } = this.parameterManagement.getParameter<ITMConsultACHSignatoryListState>(PROTECTED_PARAMETER_STATE);
    this.tableLayout = this.tableDefinitionService.buildTableForSignatureTransaction(listSignatories);
  }

  previous() {
    this.utils.showLoader();
    const state = this.parameterManagement.getParameter<ITMConsultACHSignatoryListState>(PROTECTED_PARAMETER_STATE);
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: state,
      [PROTECTED_PARAMETER_ROUTE]: AdminPanelProvidersProtectedParameters.DETAIL,
    });
    this.router.navigate([ETMConsultACHUrlCollection.DETAIL]).finally(() => this.utils.hideLoader());
  }

  nextStep() {
    this.openModal();
  }

  openModal() {
    const voucherModal = this.modalService.open(BtProofVoucherModalComponent
      , {
        centered: true,
        windowClass: `${this.utils.getProfile() || 'byte-theme'} voucher-modal voucher-modal-bisv st-ach-modal`,
        size: `lg`,
      });

    const { transactionDetail } = this.parameterManagement.getParameter<ITMConsultACHSignatoryListState>(PROTECTED_PARAMETER_STATE);

    voucherModal.componentInstance.data = this.modalDefinition.builderLayoutVoucherModal(transactionDetail.idTransference, transactionDetail.dateRaw);
    voucherModal.componentInstance.uploadedAccountsLayout = this.tableLayout;

    voucherModal.result.then(isResult => {
      if (!isResult) { return; }

      this.exportFile();
    }).catch(error => error);
  }

  exportFile() {
    const { listSignatories, transactionDetail } = this.parameterManagement.getParameter<ITMConsultACHSignatoryListState>(PROTECTED_PARAMETER_STATE);

    const data = {
      signatures: listSignatories,
    }

    const fileName = this.translate.instant('tm:ach:signatures_filename') + `${transactionDetail.idTransference}_${Date.now()}`;

    this.pdfService.pdfGenerate(
      data,
      transactionDetail.idTransference,
      fileName,
      268,
    );
  }

}
