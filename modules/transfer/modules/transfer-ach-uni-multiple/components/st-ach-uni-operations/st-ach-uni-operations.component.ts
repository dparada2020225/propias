import { Component, OnInit } from '@angular/core';
import {
  AdfFormatService,
  IConfirmationModal,
  IDataReading,
  IHeadBandAttribute,
  ITableStructure
} from '@adf/components';
import { IPrint } from '../../../../interface/print-data-interface';
import { IAccount } from '../../../../../../models/account.inteface';
import { ETMAchUniView } from '../../enum/ach-uni-view.enum';
import { UtilService } from '../../../../../../service/common/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TmAchUniVoucherService } from '../../services/definition/tm-ach-uni-voucher.service';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { IStAchUniState, IStOperationAchUniState } from '../../interfaces/st-uni-operations.interface';
import { TmCommonService } from '../../../../../transaction-manager/services/tm-common.service';
import {
  ESignatureTrackingUrlFlow
} from '../../../../../transaction-manager/modules/signature-tracking/enum/st-navigate-enum';
import { IFlowError } from '../../../../../../models/error.interface';
import { TBisvMassiveAchLoteDetailMappedResponse } from '../../interfaces/lote-detail.interface';
import {
  StOperationHandlerService
} from '../../../../../transaction-manager/modules/signature-tracking/services/execution/handlers/st-operation-handler.service';
import {
  ESignatureTrackingTypeAction
} from '../../../../../transaction-manager/modules/signature-tracking/enum/st-transaction-status.enum';
import {
  StBisvAtomicAchUniMultipleService
} from '../../../../../transaction-manager/modules/signature-tracking/services/execution/definitions/bisv/atomic/st-bisv-atomic-ach-uni-multiple.service';
import { IUserInfo } from '../../../../../../models/user-info.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'byte-st-ach-uni-operations',
  templateUrl: './st-ach-uni-operations.component.html',
  styleUrls: ['./st-ach-uni-operations.component.scss']
})
export class StAchUniOperationsComponent implements OnInit {

  typeAlert: string | null = null;
  messageAlert: string | null = null;

  voucherLayout!: IDataReading;
  tableStructure!: ITableStructure;
  voucherModalLayout!: IConfirmationModal;
  pdfLayout!: IPrint;
  headbandLayout: IHeadBandAttribute[] = [];

  sourceAccountSelected!: IAccount;
  view: ETMAchUniView = ETMAchUniView.ST_DETAIL_;
  isShowNextButton = true;
  nextButtonMessage = 'print';

  registers: TBisvMassiveAchLoteDetailMappedResponse = [];

  title = '';
  subtitle = '';

  credits = 0;
  total = '';
  currency = '';

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get userVirtualScrollInTable() {
    return this.tableStructure.items.length > 8
  }

  constructor(
    private utils: UtilService,
    private router: Router,
    private tmAchUniVoucherDefinitionService: TmAchUniVoucherService,
    private parameterManagement: ParameterManagementService,
    private activatedRoute: ActivatedRoute,
    private tmCommonService: TmCommonService,
    private adfFormat: AdfFormatService,
    private stOperationHandler: StOperationHandlerService,
    private stProcessService: StBisvAtomicAchUniMultipleService,
    private translate: TranslateService,
    ) {
    this.translate.onLangChange.subscribe({
      next: () => {
        this.manageBuildViewVoucher();
      }
    })
  }

  ngOnInit(): void {
    this.initState();
    this.manageBuildViewVoucher();
    this.utils.hideLoader();
  }

  initState() {
    const { sourceAccount } = this.parameterManagement.getParameter<IStAchUniState>(PROTECTED_PARAMETER_STATE);
    this.sourceAccountSelected = sourceAccount;
    this.view = this.activatedRoute.snapshot.data['view'];

    this.getLoteTransactionDetail();
    this.calcSummary();
  }

  getLoteTransactionDetail() {
    const loteResponse = this.activatedRoute.snapshot.data['lote'];

    if (loteResponse.hasOwnProperty('error')) {
      this.isShowNextButton = false;
      this.showAlert('error', (loteResponse as IFlowError).message);
      return;
    }

    this.registers = loteResponse;
  }


  manageBuildViewVoucher() {
    const mappedView = {
      [ETMAchUniView.ST_DETAIL_]: () => this.buildViewForStDetail(),
      [ETMAchUniView.ST_OPERATION]: () => this.buildViewForStOperation(),
    }

    const view = mappedView[this.view];
    if (!view) return;

    view();
  }

  buildViewForStDetail() {
    this.buildDefaultVoucher();
    this.title =  'signature_tracking_label';
    this.subtitle =  'view_detail_transaction';
    this.isShowNextButton = false;
  }

  buildViewForStOperation() {
    this.buildDefaultVoucher();
    const { action } = this.parameterManagement.getParameter<IStOperationAchUniState>(PROTECTED_PARAMETER_STATE);

    const txt = this.tmCommonService.getTitleAndSubtitleStOperation(action);
    this.title = 'signature_tracking_label';
    this.subtitle = txt.subtitleMessage;
    this.nextButtonMessage = txt.buttonMessage;
  }

  private buildDefaultVoucher() {
    this.voucherLayout = this.tmAchUniVoucherDefinitionService.buildVoucherConfirmationLayout({
      sourceAccount: this.sourceAccountSelected,
    });

    this.tableStructure = this.tmAchUniVoucherDefinitionService.buildTableLayoutForStOperations(this.registers);
  }


  calcSummary() {
    const { transactionDetail } = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);
    this.credits = Number(transactionDetail.credits);
    this.currency = this.sourceAccountSelected.currency;
    const calcTotal = this.registers.reduce((acc, register) => acc + this.utils.parseNumberAsFloat(register.amount), 0);
    this.total = this.adfFormat.formatAmount(calcTotal.toFixed(2)) + '';
  }

  previous() {
    const { position } = this.parameterManagement.getParameter<IStAchUniState>(PROTECTED_PARAMETER_STATE);

    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        position,
      },
      [PROTECTED_PARAMETER_ROUTE]: null,
    });

    this.router.navigate([ESignatureTrackingUrlFlow.HOME]).finally(() => {});
  }

  nextStep() {
    this.manageExecuteOperation();
  }

  manageExecuteOperation() {
    const {
      transactionSelected,
      position,
      action } = this.parameterManagement.getParameter('navigateStateParameters');

    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');

    if (action === ESignatureTrackingTypeAction.PROCESS) {
      this.stProcessService.execute({
        transaction: transactionSelected,
        sourceAccount: this.sourceAccountSelected,
        signatureType: userInfo.signatureType,
        loteDetail: this.registers,
      })
      return;
    }

    this.stOperationHandler.operationManager({
      transactionSelected,
      position,
      action,
    });
  }

  showAlert(typeAlert: string, message: string) {
    this.typeAlert = typeAlert;
    this.messageAlert = message;
  }
}
