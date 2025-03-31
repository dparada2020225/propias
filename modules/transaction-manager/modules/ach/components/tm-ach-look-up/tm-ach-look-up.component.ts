import { Component, OnInit } from '@angular/core';
import { ILoadItem, ITableStructure } from '@adf/components';
import {
  ITMConsultACHAtomicRegisterMapped, ITMConsultMultipleRegisterMapped, TConsultMultipleACHListRegisters,
  TLookUpACHRegisterAtomicMapped
} from '../../interfaces/tm-ach-register.interface';
import { IFlowError } from '../../../../../../models/error.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../../../../../service/common/util.service';
import { ETMConsultACHMultipleView, ETMConsultACHView } from '../../enum/view.enum';
import { ETMConsultACHUrlCollection } from '../../enum/url-collection.enum';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { TmdAchTableService } from '../../services/definition/tmd-ach-table.service';
import {
  ITMConsultACHDetailTransactionState,
  ITMConsultACHHomeState,
  ITMConsultACHLote, ITMConsultACHLoteMultiple365
} from '../../interfaces/state.interface';
import { ETMACHService, ETMACHTypeTransaction } from '../../enum/form-control-name.enum';
import { ETransactionHistoryTableActions } from '../../../transaction-history/enums/th-table-keys.enum';
import {
  ACHTransactionAtomicBuilder,
} from '../../interfaces/tm-atomic-transaction-detail.interface';
import { TmAchStorageService } from '../../services/execution/tm-ach-storage.service';
import { TmAchTransactionService } from '../../services/transaction/tm-ach-transaction.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ITMConsultACHMultiple365Mapped,
  TTMConsultACHMultiple365List
} from '../../interfaces/tm-multiple-365.interface';
import { ITMLookUpAch365RegisterMapped, ITMLookUpAchRegisterMapped } from '../../interfaces/transfer-mapped.interface';
import {
  ITMAchUniIncomingTransactionBuilderParameters,
  ITMAchUniTransactionBuilderParameters, ITMAcn365TransactionBuilderParameters
} from '../../interfaces/tm-detail.interface';
import {
  BisvGeneralParameters,
  IACHBiesGeneralParameters
} from '../../../../../../models/ach-general-parameters.interface';
import { ITMLookUpAchUniMultipleRegisterMapped } from '../../interfaces/tm-uni-multiple.interface';
import { ETMLookUpAchTypeService, ETMLookUpAchTypeTransaction } from '../../enum/catalog.enum';
import { AdminPanelProvidersProtectedParameters } from '../../enum/route-protected.enum';
import { ILookUpTransfer368LoteMappedResponse } from '../../interfaces/t365-multiple-resposne.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'byte-tm-ach-look-up',
  templateUrl: './tm-ach-look-up.component.html',
  styleUrls: ['./tm-ach-look-up.component.scss']
})
export class TmAchLookUpComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  transactionListAtomicTableLayout!: ITableStructure<ITMConsultACHAtomicRegisterMapped>;
  transactionAtomicList: TLookUpACHRegisterAtomicMapped = [];

  transactionListMultipleTableLayout!: ITableStructure<ITMConsultMultipleRegisterMapped>;
  transactionMultipleList: TConsultMultipleACHListRegisters = [];

  transactionListMultiple365TableLayout!: ITableStructure<ITMConsultACHMultiple365Mapped>;
  transactionMultiple365List: TTMConsultACHMultiple365List = [];

  view: ETMConsultACHView = ETMConsultACHView.ATOMIC;
  settings: IACHBiesGeneralParameters = new BisvGeneralParameters().build();
  subTitile = '';

  isShowAtomicTransferenceTable = false;
  isShowMultipleUNITransferenceTable = false;
  isShowMultiple365TransferenceTable = false;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get userVirtualScrollInTableAssociated() {
    return this.transactionListAtomicTableLayout.items.length > 8;
  }

  get userVirtualScrollInTableMultiple() {
    return this.transactionListMultipleTableLayout.items.length > 8;
  }

  get userVirtualScrollInTableMultiple365() {
    return this.transactionListMultiple365TableLayout.items.length > 8;
  }

  get tableClassName() {
    const state = this.parameterManagement.getParameter<ITMConsultACHHomeState>(PROTECTED_PARAMETER_STATE);
    if (!state) return 'grid-full';

    const { formValues: { typeService } } = this.parameterManagement.getParameter<ITMConsultACHHomeState>(PROTECTED_PARAMETER_STATE);
    return typeService === ETMLookUpAchTypeService.INCOMING ? 'grid-8' : 'grid-full';
  }

  constructor(
    private router: Router,
    private utils: UtilService,
    private parameterManagement: ParameterManagementService,
    private activatedRouter: ActivatedRoute,
    private tableDefinitionService: TmdAchTableService,
    private storageService: TmAchStorageService,
    private transactionService: TmAchTransactionService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.initState();
    this.initDefinition();
    this.utils.hideLoader();
  }

  initState() {
    this.getTransactionList();
    this.getGeneralParameters();
  }

  getTransactionList() {
    const transactionListResponse = this.activatedRouter.snapshot.data['transactionList'];

    if (transactionListResponse.hasOwnProperty('error')) {
      this.showAlert('error', (transactionListResponse as IFlowError).message);
      return;
    }

    this.view = this.activatedRouter.snapshot.data['view'];
    const { formValues } = this.parameterManagement.getParameter<ITMConsultACHHomeState>(PROTECTED_PARAMETER_STATE);

    if (this.view === ETMConsultACHView.ATOMIC) {
      this.transactionAtomicList = transactionListResponse;
      return;
    }

    if (formValues.service === ETMACHService.MULTIPLE_UNI) {
      this.transactionMultipleList = transactionListResponse;
    }

    if (formValues.service === ETMACHService.MULTIPLE_365) {
      this.transactionMultiple365List = transactionListResponse;
    }
  }

  getGeneralParameters() {
    const generalParametersResponse = this.activatedRouter.snapshot.data['generalParameters'];

    if (generalParametersResponse.hasOwnProperty('error')) {
      this.showAlert('error', (generalParametersResponse as IFlowError).message);
      return;
    }

    this.settings = generalParametersResponse;
  }

  initDefinition() {
    const viewMapped = {
      [ETMConsultACHView.MULTIPLE]: () => this.launchViewForMultipleTransference(),
      [ETMConsultACHView.ATOMIC]: () => this.buildDefinitionForAtomicTransference(),
    }

    const action = viewMapped[this.view];
    if (!action) return;

    action();
  }

  launchViewForMultipleTransference() {
    const { formValues } = this.parameterManagement.getParameter<ITMConsultACHHomeState>(PROTECTED_PARAMETER_STATE);

    const mappedView = {
      [ETMACHService.MULTIPLE_UNI]: () => this.buildDefinitionForMultipleTransference(),
      [ETMACHService.MULTIPLE_365]: () => this.buildDefinitionForMultiple365Transference(),
    }

    const view = mappedView[formValues.service];
    if (!view) return;

    view();
  }

  /* ============================================ MANAGE VIEW FOR ATOMIC TRANSACTION ============================================== */

  buildDefinitionForAtomicTransference() {
    const { formValues } = this.parameterManagement.getParameter<ITMConsultACHHomeState>(PROTECTED_PARAMETER_STATE);

    const mappedSubtitle = {
      [ETMACHTypeTransaction.UNI]: 'tm:ach:subtitle_uni',
      [ETMACHTypeTransaction.MOVIL_365]: 'tm:ach:subtitle_365_movil',
      [ETMACHTypeTransaction.NORMAL_365]: 'tm:ach:subtitle_365',
      [ETMACHTypeTransaction.SIPA]: 'tm:ach:subtitle_365_sipa',
    }

    this.subTitile = mappedSubtitle[formValues.typeTransaction];
    this.isShowAtomicTransferenceTable = true;
    this.transactionListAtomicTableLayout = this.tableDefinitionService.buildTableLayoutForAtomicTransference({
      typeTransaction: formValues.typeTransaction,
      typeService: formValues.typeService,
      listTransactions: this.getMaskAmountList(this.transactionAtomicList),
    });
  }

  getMaskAmountList(data: TLookUpACHRegisterAtomicMapped): TLookUpACHRegisterAtomicMapped {
    return data.map(item => ({
      ...item,
      amount: String(this.utils.formatAmount(item.amount))
    })) as TLookUpACHRegisterAtomicMapped;
  }

  getTableActionsForAtomicTransference(transaction: any) {
    const transactionSelected = transaction as ILoadItem<ITMLookUpAchRegisterMapped>;

    if (transactionSelected.action === ETransactionHistoryTableActions.VIEW_DETAIL) {
      this.manageGetAtomicTransactionDetail(transactionSelected.item);
      return;
    }

    console.log(transactionSelected);
  }

  manageGetAtomicTransactionDetail(transaction: ITMLookUpAchRegisterMapped) {
    const { formValues: { typeTransaction } } = this.parameterManagement.getParameter<ITMConsultACHHomeState>(PROTECTED_PARAMETER_STATE);

    if (typeTransaction === ETMLookUpAchTypeTransaction.UNI) {
      this.manageGetTransactionDetailForUNI(transaction);
      return;
    }


    this.manageGetTransactionDetailForM365(transaction as ITMLookUpAch365RegisterMapped)
  }

  private manageGetTransactionDetailForUNI(transaction: ITMLookUpAchRegisterMapped) {
    const { formValues: { typeService } } = this.parameterManagement.getParameter<ITMConsultACHHomeState>(PROTECTED_PARAMETER_STATE);

    if (typeService === ETMLookUpAchTypeService.OUTGOING) {
      return this.manageGetTransactionDetailForUniOutgoing(transaction);
    }

    return this.manageGeTransactionDetailForUniIncoming(transaction);
  }

  private manageGeTransactionDetailForUniIncoming(transaction: ITMLookUpAchRegisterMapped) {
    this.utils.showLoader();
    const state = this.parameterManagement.getParameter<ITMConsultACHHomeState>(PROTECTED_PARAMETER_STATE);

    this.transactionService.getUniIncomingTransactionDetail({
      transactionId: transaction.id,
    }).subscribe({
      next: (response) => {
        this.utils.showLoader();
        this.parameterManagement.sendParameters({
          [PROTECTED_PARAMETER_STATE]: {
            ...state,
            from: ETMConsultACHView.ATOMIC,
            transferenceId: response.id.toString(),
            transactionDetail: this.buildACHUniIncomingDetailTransaction({
              transaction: response,
              transactionSelected: transaction,
            }),
          } as ITMConsultACHDetailTransactionState,
          [PROTECTED_PARAMETER_ROUTE]: AdminPanelProvidersProtectedParameters.DETAIL,
        });

        this.router.navigate([ETMConsultACHUrlCollection.DETAIL]).finally(() => this.utils.hideLoader());
      },
      error: (error: HttpErrorResponse) => {
        this.utils.hideLoader();
        this.utils.scrollToTop();
        this.showAlert('error', error?.error?.message);
      }
    });
  }

  private manageGetTransactionDetailForUniOutgoing(transaction: ITMLookUpAchRegisterMapped) {
    this.utils.showLoader();
    const state = this.parameterManagement.getParameter<ITMConsultACHHomeState>(PROTECTED_PARAMETER_STATE);

    this.transactionService.getUniOutgoingTransactionDetail({
      transactionId: transaction.id,
      service: transaction.service,
    }).subscribe({
      next: (response) => {
        this.utils.showLoader();
        this.parameterManagement.sendParameters({
          [PROTECTED_PARAMETER_STATE]: {
            ...state,
            from: ETMConsultACHView.ATOMIC,
            transferenceId: response.authorizationNumber,
            transactionDetail: this.buildACHUniDetailTransaction({
              transaction: response,
              transactionSelected: transaction,
            }),
          } as ITMConsultACHDetailTransactionState,
          [PROTECTED_PARAMETER_ROUTE]: AdminPanelProvidersProtectedParameters.DETAIL,
        });

        this.router.navigate([ETMConsultACHUrlCollection.DETAIL]).finally(() => this.utils.hideLoader());
      },
      error: (error: HttpErrorResponse) => {
        this.utils.hideLoader();
        this.utils.scrollToTop();
        this.showAlert('error', error?.error?.message);
      }
    });
  }

  private buildACHUniDetailTransaction(parameters: ITMAchUniTransactionBuilderParameters) {
    const { transaction, transactionSelected } = parameters;
    const bankName = this.settings.banks.find(bank => {
      return bank.routes.find(route => Number(route.code) === Number(transaction.receiverBankId))
    });

    return new ACHTransactionAtomicBuilder()
      .typeOperation(transactionSelected.operation)
      .service(transaction.serviceType)
      .date(`${transactionSelected.dateParsed} ${transactionSelected.hour}`)
      .idTransference(transactionSelected.id)
      .sourceAccount(transactionSelected.account)
      .sourceAccountName(transactionSelected.name)
      .bankName(bankName ? bankName.description : transaction.receiverBankId)
      .targetAccount(transaction.destinationAccount)
      .targetAccountName(transaction.recipientName)
      .comment(transaction.description)
      .amount(String(this.utils.formatAmount(transaction.amount)))
      .currency(transactionSelected.currency)
      .product(String(transaction.destinationType))
      .status(transactionSelected.status)
      .typeTransaction('UNI')
      .dateRaw(transactionSelected.dateParsed, transactionSelected.hour)
      .build();
  }

  private buildACHUniIncomingDetailTransaction(parameters: ITMAchUniIncomingTransactionBuilderParameters) {
    const { transaction, transactionSelected } = parameters;

    const bankName = this.settings.banks.find(bank => {
      return bank.routes.find(route => Number(route.code) === Number(transaction.receivingBankId));
    });

    return new ACHTransactionAtomicBuilder()
      .typeOperation(transactionSelected.operation)
      .service(ETMLookUpAchTypeTransaction.UNI)
      .date(`${transactionSelected.dateParsed} ${transactionSelected.hour}`)
      .idTransference(transactionSelected.id)
      .sourceAccount(transaction.senderAccount)
      .sourceAccountName(transaction.senderName)
      .bankName(bankName ? bankName.description : transaction.senderBankId)
      .targetAccount(transactionSelected.account)
      .targetAccountName(transaction.receivingName)
      .comment(transaction.message)
      .amount(String(this.utils.formatAmount(transaction.amount)))
      .currency(transactionSelected.currency)
      .product(String(this.mappedProductTypeForUniIncoming(transaction.receivingAccountType)))
      .status(transactionSelected.status)
      .typeTransaction(ETMLookUpAchTypeTransaction.UNI)
      .dateRaw(transactionSelected.dateParsed, transactionSelected.hour)
      .build();
  }

  private mappedProductTypeForUniIncoming(product: string) {
    const mapped = {
      M: this.translate.instant('ach:label_product_m'),
      A: this.translate.instant('ach:label_product_a'),
      PR: this.translate.instant('ach:label_product_pr'),
      TC: this.translate.instant('ach:label_product_tc'),
      B: this.translate.instant('ach:label_product_b'),
    }

    return mapped[product.toUpperCase()] ?? product;
  }


  /* ============================================ MANAGE VIEW FOR ATOMIC TRANSACTION ============================================== */

  private manageGetTransactionDetailForM365(transaction: ITMLookUpAch365RegisterMapped) {
    this.utils.showLoader();
    const state = this.parameterManagement.getParameter<ITMConsultACHHomeState>(PROTECTED_PARAMETER_STATE);

    this.transactionService.getTransactionDetailFor365Transfer(transaction.id, transaction.operationRaw).subscribe({
      next: (response) => {
        this.parameterManagement.sendParameters({
          [PROTECTED_PARAMETER_STATE]: {
            ...state,
            from: ETMConsultACHView.ATOMIC,
            transactionDetail: this.buildACH365DetailTransaction({
              transactionDetail: response,
              transactionSelected: transaction,
            }),
          } as ITMConsultACHDetailTransactionState,
          [PROTECTED_PARAMETER_ROUTE]: AdminPanelProvidersProtectedParameters.DETAIL,
        });

        this.router.navigate([ETMConsultACHUrlCollection.DETAIL]).finally(() => this.utils.hideLoader());
      },
      error: (error: HttpErrorResponse) => {
        this.utils.hideLoader();
        this.utils.scrollToTop();
        this.showAlert('error', error?.error?.message);
      }
    });
  }

  private buildACH365DetailTransaction(parameters: ITMAcn365TransactionBuilderParameters) {
    const { transactionDetail, transactionSelected } = parameters;

    return new ACHTransactionAtomicBuilder()
      .typeOperation(transactionSelected.operation)
      .service(transactionSelected.serviceRaw)
      .date(`${transactionSelected.dateParsed} ${transactionSelected.hour}`)
      .idTransference(transactionSelected.id)
      .sourceAccount(transactionSelected.account)
      .sourceAccountName(transactionSelected.name)
      .bankName(transactionDetail.bankName)
      .targetAccount(transactionDetail.targetAccount)
      .targetAccountName(transactionDetail.targetAccountName)
      .comment(transactionDetail.comment)
      .amount(String(this.utils.formatAmount(transactionSelected.amount)))
      .currency(transactionSelected.currency)
      .product(String(transactionDetail.targetProductName))
      .status(transactionSelected.status)
      .dateRaw(transactionDetail.date, transactionSelected.hour)
      .typeTransaction(transactionSelected.serviceRaw)
      .build();
  }


  /* ============================================ MANAGE VIEW FOR MULTIPLE UNI TRANSACTION ============================================== */

  buildDefinitionForMultipleTransference() {
    this.subTitile = 'tm:ach:subtitle_multiple_uni';
    this.isShowMultipleUNITransferenceTable = true;
    this.transactionListMultipleTableLayout = this.tableDefinitionService.buildTableLayoutForMultipleTransference(this.transactionMultipleList);
  }

  getTableActionsForMultipleTransference(transaction: any) {
    const transactionSelected = transaction as ILoadItem<ITMLookUpAchUniMultipleRegisterMapped>;

    if (transactionSelected.action === ETransactionHistoryTableActions.VIEW_DETAIL) {
      this.manageGetMultipleTransactionDetail(transactionSelected.item);
      return;
    }

    console.log(transactionSelected);
  }

  manageGetMultipleTransactionDetail(transaction: ITMLookUpAchUniMultipleRegisterMapped) {
    const { formValues: { service } } = this.parameterManagement.getParameter<ITMConsultACHHomeState>(PROTECTED_PARAMETER_STATE);

    if (service == 'MUNI') {
      this.manageGetTransactionDetailForUniTransference(transaction);
      return;
    }
  }

  private manageGetTransactionDetailForUniTransference(transaction: ITMLookUpAchUniMultipleRegisterMapped) {
    const state = this.parameterManagement.getParameter<ITMConsultACHHomeState>(PROTECTED_PARAMETER_STATE);

    this.utils.showLoader();
    this.transactionService.getLoteDetail(transaction.lote, this.settings)
      .subscribe({
        next: (response) => {
          this.parameterManagement.sendParameters({
            [PROTECTED_PARAMETER_STATE]: {
              ...state,
              transaction,
              registerInTransaction: response,
              from: ETMConsultACHView.MULTIPLE,
              view: ETMConsultACHMultipleView.UNI,
            } as ITMConsultACHLote,
            [PROTECTED_PARAMETER_ROUTE]: AdminPanelProvidersProtectedParameters.LOTE,
          });

          this.router.navigate([ETMConsultACHUrlCollection.LOTE]).finally(() => this.utils.hideLoader());
        },
        error: (error: HttpErrorResponse) => {
          this.utils.hideLoader();
          this.utils.scrollToTop();
          this.showAlert('error', error?.error?.message);
        }
      });
  }


  /* ============================================ MANAGE VIEW FOR MULTIPLE UNI TRANSACTION ============================================== */


  /* ============================================ MANAGE VIEW FOR MULTIPLE 365 TRANSACTION ============================================== */

  buildDefinitionForMultiple365Transference() {
    this.subTitile = 'tm:ach:subtitle_multiple_365';
    this.isShowMultiple365TransferenceTable = true;
    this.transactionListMultiple365TableLayout = this.tableDefinitionService.buildTableLayoutForMultiple365Transference(this.transactionMultiple365List);
  }

  getTableActionsForMultiple365Transference(transaction: any) {
    const transactionSelected = transaction as ILoadItem<ILookUpTransfer368LoteMappedResponse>;

    if (transactionSelected.action === ETransactionHistoryTableActions.VIEW_DETAIL) {
      this.manageGetMultiple365TransactionDetail(transactionSelected.item);
      return;
    }

    console.log(transactionSelected);
  }

  manageGetMultiple365TransactionDetail(transaction: ILookUpTransfer368LoteMappedResponse) {
    const state = this.parameterManagement.getParameter<ITMConsultACHHomeState>(PROTECTED_PARAMETER_STATE);

    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        ...state,
        transaction,
        registerInTransaction: transaction.registers,
        from: ETMConsultACHView.MULTIPLE,
        view: ETMConsultACHMultipleView.MULTIPLE_365,
      } as ITMConsultACHLoteMultiple365,
      [PROTECTED_PARAMETER_ROUTE]: AdminPanelProvidersProtectedParameters.LOTE,
    });

    this.router.navigate([ETMConsultACHUrlCollection.LOTE]).finally(() => this.utils.hideLoader());
  }


  /* ============================================ MANAGE VIEW FOR MULTIPLE 365 TRANSACTION ============================================== */

  previous() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: null,
      [PROTECTED_PARAMETER_ROUTE]: null,

    });

    this.storageService.setAtomicTransactionList([]);
    this.router.navigate([ETMConsultACHUrlCollection.HOME]).finally(() => {});
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

}
