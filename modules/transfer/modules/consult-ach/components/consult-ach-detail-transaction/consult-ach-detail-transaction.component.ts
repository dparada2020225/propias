import { AdfConfirmationModalComponent, IConfirmationModal, IDataReading, ITableStructure } from '@adf/components';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ICADDetailTransactionParameters,
  ICOResponseAccount,
  TCACHCreditsTable
} from '../../interfaces/consult-ach-definition.interface';
import { IConsultingACHState, ICOTransactionCreditDetail, IParamsHomeToDetail } from '../../interfaces/navigate-parameters.interface';
import { IConsultingACHDetail } from '../../interfaces/transaction.interface';
import { CadManagerService } from '../../services/definition/cad-manager.service';
import { ConsultAchDetailExcelService } from '../../services/print/consult-ach-detail-excel.service';
import {CACH_TYPE_MOVEMENTS} from "../../const/cach-common.enum";
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { UtilService } from '../../../../../../service/common/util.service';
import { TranslateService } from '@ngx-translate/core';
import { IPrint } from '../../../../interface/print-data-interface';
import { TransfersPrintService } from '../../../../prints/transfers-print.service';

@Component({
  selector: 'byte-consult-ach-detail-transaction',
  templateUrl: './consult-ach-detail-transaction.component.html',
  styleUrls: ['./consult-ach-detail-transaction.component.scss']
})
export class ConsultAchDetailTransactionComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  tableLayout: ITableStructure<IConsultingACHDetail> | null = null;
  detailTransactionLayout: IDataReading | null = null;
  modalLayout: IConfirmationModal | null = null;
  pdfLayout!: IPrint;
  isLoadingTable: boolean = false;
  reference!: string;
  transactionCreditDetail!: ICOTransactionCreditDetail;

  transactionSelected: ICOResponseAccount | null = null;
  tableInfo: ICOResponseAccount[] = [];

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private parameterManagement: ParameterManagementService,
    private consultAchDefinitionManager: CadManagerService,
    private modalService: NgbModal,
    private router: Router,
    private pdfService: TransfersPrintService,
    private xlsService: ConsultAchDetailExcelService,
    private utils: UtilService,
    private translate: TranslateService,
  ) {

  }

  ngOnInit(): void {
    this.utils.hideLoader();
    const state: IParamsHomeToDetail = this.parameterManagement.getParameter('consultingACHState');
    this.transactionSelected = state.transactionItem;
    this.tableInfo.push(this.transactionSelected)
    if (state.parameterDetail){
      this.reference = state.parameterDetail.reference;
      this.transactionCreditDetail = state.parameterDetail;
    }

    this.initDefinition();
  }

  initDefinition() {
    const detailTransactionLayoutParameters: ICADDetailTransactionParameters = {
      detailTransaction: this.transactionSelected,
      reference: this.reference,
    };

    this.tableLayout = this.consultAchDefinitionManager.buildTableLayout({
      operations: [{...this.transactionSelected}] as TCACHCreditsTable,
      typeOperation: CACH_TYPE_MOVEMENTS.CREDIT,
    });

    this.detailTransactionLayout = this.consultAchDefinitionManager.buildDetailTransactionLayout(detailTransactionLayoutParameters, this.transactionCreditDetail);
    this.pdfLayout = this.consultAchDefinitionManager.buildPdfVoucherLayout(detailTransactionLayoutParameters, this.transactionCreditDetail);
    this.modalLayout = this.consultAchDefinitionManager.buildModalLayout(detailTransactionLayoutParameters, this.transactionCreditDetail);
  }

  backStep() {
    this.utils.showLoader();
    this.router.navigate(['/transfer/consult-ach']).finally(() => this.utils.hideLoader());
  }

  getTableActions(item: any) {
    this.openModal();
  }

  openModal() {
    const modal = this.modalService.open(AdfConfirmationModalComponent, {
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'} ach-op-detail voucher-modal`,
      size: `lg`,
    });

    modal.componentInstance.data = this.modalLayout;

    modal.result.then((isConfirm: boolean) => {
      if (!isConfirm) { return; }
      this.exportFile();
    }).catch((error) => error);
  }

  exportFile() {
    const { account, reference, title, fileName, items } = this.pdfLayout;
    this.pdfService.pdfGenerate(account, reference, fileName, 268, title, items);
  }

  generateCsvFile(){
    this.xlsService.generate(this.tableInfo, 'Consulta de operaciones', 'csv')

  }
  generateXlsFile(){
    this.xlsService.generate(this.tableInfo, 'Consulta de operaciones', this.translate.instant('consult-ach-filename'))
  }

  resetStorage() {
    const params = {
      consultingACHState: null,
    } as IConsultingACHState;

    this.parameterManagement.sendParameters(params);
  }
}
