import { Component, OnInit } from '@angular/core';
import { AdfFormatService, IConfirmationModal, IDataReading, ILoadItem, ITableStructure } from '@adf/components';
import {
  ITMConsultACHLote,
  ITMConsultACHLoteMultiple365
} from '../../interfaces/state.interface';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { Router } from '@angular/router';
import { UtilService } from '../../../../../../service/common/util.service';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { TmdAchTableService } from '../../services/definition/tmd-ach-table.service';
import { ETMConsultACHUrlCollection } from '../../enum/url-collection.enum';
import { TmdAchAtomicDetailService } from '../../services/definition/tmd-ach-atomic-detail.service';
import { ETransactionHistoryTableActions } from '../../../transaction-history/enums/th-table-keys.enum';
import {
  ACHTransactionAtomicBuilder,
} from '../../interfaces/tm-atomic-transaction-detail.interface';
import { ETMConsultACHMultipleView } from '../../enum/view.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TmAch365ProofModalLoteComponent } from '../tm-ach365-proof-modal-lote/tm-ach365-proof-modal-lote.component';
import { TmdAchAtomicModalService } from '../../services/definition/tmd-ach-atomic-modal.service';
import { TmAch365LotePrintService } from '../../services/print/tm-ach365-lote-print.service';
import { TranslateService } from '@ngx-translate/core';
import {
  ITMAch365MultipleTransactionBuilderParameters,
  ITMAchUniMultipleTransactionBuilderParameters
} from '../../interfaces/tm-detail.interface';
import { ILookUpUniTransactionInLoteRegisterMapped } from '../../interfaces/tm-uni-multiple.interface';
import { TmAchMappedUtilsService } from '../../services/utils/tm-ach-mapped-utils.service';
import { ETMLookUpAchTypeTransaction } from '../../enum/catalog.enum';
import { AdminPanelProvidersProtectedParameters } from '../../enum/route-protected.enum';
import {
  ILookUpMultiple365RegisterInLote,
} from '../../interfaces/t365-multiple-resposne.interface';

@Component({
  selector: 'byte-tm-ach-lote',
  templateUrl: './tm-ach-lote.component.html',
  styleUrls: ['./tm-ach-lote.component.scss']
})
export class TmAchLoteComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  tableLayout!: ITableStructure;
  voucherLayout!: IDataReading;
  voucherModalLayout!: IConfirmationModal;

  subTitile = '';
  tableClassName = '';
  credits = 0;
  total = '';
  currency = '';
  isShowPrintButton = false;
  containerClassName = '';

  get userVirtualScrollInTableMultiple() {
    return this.tableLayout.items.length > 8;
  }

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }


  constructor(
    private router: Router,
    private utils: UtilService,
    private parameterManagement: ParameterManagementService,
    private tableDefinitionService: TmdAchTableService,
    private voucherDefinitionService: TmdAchAtomicDetailService,
    private adfFormat: AdfFormatService,
    private modalService: NgbModal,
    private modalVoucherDefinitionService: TmdAchAtomicModalService,
    private pdfService: TmAch365LotePrintService,
    private translate: TranslateService,
    private mappedUtilService: TmAchMappedUtilsService,

  ) { }

  ngOnInit(): void {
    this.launchView();
    this.utils.hideLoader();
  }

  launchView() {
    const { view } = this.parameterManagement.getParameter<ITMConsultACHLote>(PROTECTED_PARAMETER_STATE);

    const mappedView = {
      [ETMConsultACHMultipleView.UNI]: () => this.buildUniDefinition(),
      [ETMConsultACHMultipleView.MULTIPLE_365]: () => this.buildTransfer365Definition(),
    }

    const viewDefinition = mappedView[view];

    if (!viewDefinition) return;
    viewDefinition();
  }

  buildUniDefinition() {
    const state = this.parameterManagement.getParameter<ITMConsultACHLote>(PROTECTED_PARAMETER_STATE);

    this.subTitile = 'tm:ach:subtitle_lote_multiple_uni';
    this.tableClassName = 'uni';
    this.containerClassName = 'byte-container';
    this.tableLayout = this.tableDefinitionService.buildTableLayoutForLoteRegisters(state.registerInTransaction.transactions);
    this.voucherLayout = this.voucherDefinitionService.buildDetailLoteTransaction({
      transaction: {
        date: state.transaction.dateParsed,
        lote: state.transaction.lote,
        accountName: state.registerInTransaction.name,
        sourceAccount: state.registerInTransaction.account,
        status: state.transaction.status,
      }
    });

    this.credits = state.registerInTransaction.transactions.length;
    this.currency = state.registerInTransaction.transactions[0].currency;
    const calcTotal = state.registerInTransaction.transactions.reduce((acc, register) => acc + this.utils.parseNumberAsFloat(register.amount), 0);
    this.total = this.adfFormat.formatAmount(calcTotal.toFixed(2)) + '';
  }

  buildTransfer365Definition() {
    const state = this.parameterManagement.getParameter<ITMConsultACHLoteMultiple365>(PROTECTED_PARAMETER_STATE);

    this.subTitile = 'tm:ach:subtitle_lote_multiple_365';
    this.tableClassName = 'transfer365';
    this.containerClassName = 'byte-container_extended';
    this.isShowPrintButton = true;
    this.tableLayout = this.tableDefinitionService.buildTableLayoutForLote365Multiple(state.registerInTransaction);
    this.voucherLayout = this.voucherDefinitionService.buildDetailLoteTransaction({
      transaction: {
        date: state.transaction.dateParsed,
        lote: String(state.transaction.lote),
        accountName: state.transaction.accountName,
        sourceAccount: state.transaction.account,
        status: state.transaction.status,
      }
    });

    this.voucherModalLayout = this.modalVoucherDefinitionService.buildMultiple365LoteModalLayout({
      transaction: {
        date: `${state.transaction.date}${state.transaction.hour}`,
        lote: String(state.transaction.lote),
        accountName: state.transaction.accountName,
        sourceAccount: state.transaction.account,
        status: state.transaction.status,
        idTransaction: String(state.transaction.lote),
      }
    });

    this.credits = state.registerInTransaction.length;
    this.currency = state.registerInTransaction[0].currency;
    const calcTotal = state.registerInTransaction.reduce((acc, register) => acc + this.utils.parseNumberAsFloat(register.amount), 0);
    this.total = this.adfFormat.formatAmount(calcTotal.toFixed(2)) + '';
  }

  getTableActions(transaction: any) {
    const transactionSelected = transaction as ILoadItem<ILookUpUniTransactionInLoteRegisterMapped>;

    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);


    if (transactionSelected.action === ETransactionHistoryTableActions.VIEW_DETAIL && state.view === ETMConsultACHMultipleView.UNI) {
      this.manageGetTransactionDetailForUniOutgoing(transactionSelected.item);
      return;
    }

    this.manageGetTransactionDetail365Multiple(transactionSelected.item as unknown as ILookUpMultiple365RegisterInLote);

  }

  private manageGetTransactionDetailForUniOutgoing(transaction: ILookUpUniTransactionInLoteRegisterMapped) {
    this.utils.showLoader();
    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);

    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        ...state,
        transactionDetail: this.buildACHUniDetailTransaction({
          transactionSelected: transaction,
          loteSelected: state.transaction,
        }),
      },
      [PROTECTED_PARAMETER_ROUTE]: AdminPanelProvidersProtectedParameters.DETAIL,
    });

    this.router.navigate([ETMConsultACHUrlCollection.DETAIL]).finally(() => this.utils.hideLoader());
  }

  private buildACHUniDetailTransaction(parameters: ITMAchUniMultipleTransactionBuilderParameters) {
    const { transactionSelected, loteSelected } = parameters;

    return new ACHTransactionAtomicBuilder()
      .typeOperation(this.mappedUtilService.mappedService(transactionSelected.type))
      .service(ETMLookUpAchTypeTransaction.UNI)
      .date(`${loteSelected.date} ${loteSelected.hour}`)
      .idTransference(transactionSelected.id)
      .sourceAccount(loteSelected.account)
      .sourceAccountName(loteSelected.name)
      .bankName(transactionSelected.bankName)
      .targetAccount(transactionSelected.account)
      .targetAccountName(transactionSelected.name)
      .comment(transactionSelected.comment)
      .amount(String(this.utils.formatAmount(transactionSelected.amount)))
      .currency(transactionSelected.currency)
      .product(String(transactionSelected.product))
      .status(this.mappedUtilService.mappedStatus(transactionSelected.statusDescription))
      .dateRaw(loteSelected.date, loteSelected.hour)
      .build();
  }


  private manageGetTransactionDetail365Multiple(loteSelected: ILookUpMultiple365RegisterInLote) {
    this.utils.showLoader();
    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);

    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        ...state,
        transactionDetail: this.buildACH365MultipleDetailTransaction({
          transactionSelected: state.transaction,
          loteSelected,
        }),
      },
      [PROTECTED_PARAMETER_ROUTE]: AdminPanelProvidersProtectedParameters.DETAIL,
    });

    this.router.navigate([ETMConsultACHUrlCollection.DETAIL]).finally(() => this.utils.hideLoader());
  }

  private buildACH365MultipleDetailTransaction(parameters: ITMAch365MultipleTransactionBuilderParameters) {
    const { transactionSelected, loteSelected } = parameters;

    return new ACHTransactionAtomicBuilder()
      .typeOperation(this.mappedUtilService.mappedService(transactionSelected.typeOperation))
      .service(ETMLookUpAchTypeTransaction.UNI)
      .date(this.adfFormat.getFormatDateTime(`${transactionSelected.date}${transactionSelected.hour}`).numberFormat.replace('AM', '').replace('PN', ''))
      .idTransference(loteSelected.id)
      .sourceAccount(transactionSelected.account)
      .sourceAccountName(transactionSelected.accountName)
      .bankName(loteSelected.bankName)
      .targetAccount(loteSelected.account)
      .targetAccountName(loteSelected.name)
      .comment(loteSelected.comment)
      .amount(String(this.utils.formatAmount(loteSelected.amount)))
      .currency(transactionSelected.currency)
      .product(String(loteSelected.product))
      .status(loteSelected.status)
      .dateRaw(transactionSelected.date, transactionSelected.hour)
      .build();
  }


  previous() {
    this.utils.showLoader();
    const { registerInTransaction, transaction, view, ...rest } = this.parameterManagement.getParameter<ITMConsultACHLote>(PROTECTED_PARAMETER_STATE);

    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: rest,
      [PROTECTED_PARAMETER_ROUTE]: AdminPanelProvidersProtectedParameters.LOOK_UP_MULTIPLE,
    });

    this.router.navigate([ETMConsultACHUrlCollection.CONSULT_MULTIPLE]).finally(() => {});
  }

  print() {
    this.openProofModal();
  }

  openProofModal(): void {
    const modal = this.modalService.open(TmAch365ProofModalLoteComponent, {
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'} voucher-modal voucher-modal-bisv t365 tm-ach`,
      size: `lg`,
    });

    const state = this.parameterManagement.getParameter<ITMConsultACHLoteMultiple365>(PROTECTED_PARAMETER_STATE);
    modal.componentInstance.uploadedAccountsLayout = this.tableDefinitionService.buildTableLayoutForMultiple365ProofModal(state.registerInTransaction);
    modal.componentInstance.data = this.voucherModalLayout;
    modal.componentInstance.subTitile = this.tableLayout;
    modal.componentInstance.credits = this.credits;
    modal.componentInstance.total = this.total;
    modal.componentInstance.currency = this.currency;

    modal.result
      .then((isConfirm: boolean) => {
        if (!isConfirm) {
          return;
        }
        this.exportFile();
      })
      .catch((error) => error);
  }

  exportFile() {
    const { transaction, registerInTransaction } = this.parameterManagement.getParameter<ITMConsultACHLoteMultiple365>(PROTECTED_PARAMETER_STATE);

    const data = {
      registers: registerInTransaction,
      reference: String(transaction.lote),
      credits: this.credits,
      total: this.total,
      currency: this.currency,
      date: this.adfFormat.getFormatDateTime(`${transaction.date}${transaction.hour}`),
      lote: String(transaction.lote),
      status: transaction.status,
      sourceAccount: transaction.account,
      idTransaction: String(transaction.lote),
      accountName: transaction.accountName,
    };

    const label = this.translate.instant('tm:ach:consult_ach_lote_ach_multiple_365');
    const fileName = `${label}${data.lote}_${Date.now()}`;

    this.pdfService.pdfGenerate(data, String(transaction.lote), fileName, 268, '', undefined, true);
  }

}
