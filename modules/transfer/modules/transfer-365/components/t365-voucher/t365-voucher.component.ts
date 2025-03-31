import { Component, OnInit } from '@angular/core';
import { IAccount } from '../../../../../../models/account.inteface';
import { V3IAchAccount } from '../../../transfer-ach/interfaces/ach-account-interface';
import {
  I365ConfirmationState,
  I365FormValues,
  I365StDetailSTate,
  I365StOperationState
} from '../../interfaces/state.interface';
import {
  AdfConfirmationModalComponent,
  AdfFormatService,
  IConfirmationModal,
  IDataReading,
  IHeadBandAttribute
} from '@adf/components';
import { E365UrlCollection } from '../../enum/url-collection.enum';
import { UtilService } from '../../../../../../service/common/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { T365dVoucherService } from '../../services/definition/t365d-voucher.service';
import { ET365View } from '../../enum/view.enum';
import { EACHTypeTransaction } from '../../../transfer-ach/enum/transfer-ach.enum';
import { IPrint } from '../../../../interface/print-data-interface';
import { IHeadBandLayoutConfirm } from '../../../../../../models/util-work-flow.interface';
import { UtilWorkFlowService } from '../../../../../../service/common/util-work-flow.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { T365dModalService } from '../../services/definition/t365d-modal.service';
import { T365dPdfService } from '../../services/definition/t365d-pdf.service';
import { T365PrintPdfService } from '../../services/print/t365-print-pdf.service';
import { M365StorageService } from '../../../transfer-365-movil/services/execution/m365-storage.service';
import {
  ESignatureTrackingUrlFlow
} from '../../../../../transaction-manager/modules/signature-tracking/enum/st-navigate-enum';
import { M365StOperation } from '../../../transfer-365-movil/interfaces/state.interface';
import { TmCommonService } from '../../../../../transaction-manager/services/tm-common.service';
import {
  ESignatureTrackingTypeAction
} from '../../../../../transaction-manager/modules/signature-tracking/enum/st-transaction-status.enum';
import {
  StOperationHandlerService
} from '../../../../../transaction-manager/modules/signature-tracking/services/execution/handlers/st-operation-handler.service';
import { IACHBiesGeneralParameterBank } from '../../../../../../models/ach-general-parameters.interface';
import {
  StBisvAtomicAchService
} from '../../../../../transaction-manager/modules/signature-tracking/services/execution/definitions/bisv/atomic/st-bisv-atomic-ach.service';
import { T365RouteProtected } from '../../enum/route-protected.enum';

@Component({
  selector: 'byte-t365-voucher',
  templateUrl: './t365-voucher.component.html',
  styleUrls: ['./t365-voucher.component.scss']
})
export class T365VoucherComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  sourceAccountSelected!: IAccount;
  targetAccountSelected!: V3IAchAccount;
  bankSettingSelected!: IACHBiesGeneralParameterBank;
  formValues!: I365FormValues;

  voucherLayout!: IDataReading;
  voucherModalLayout!: IConfirmationModal;
  pdfLayout!: IPrint;
  headbandLayout: IHeadBandAttribute[] = [];

  view: ET365View = ET365View.DEFAULT;
  isShowNextButton = true;
  isShowHeadBand = true;
  nextButtonMessage = 'print';
  titleVoucher = 'ach:bisv:label_home';
  subTitleVoucher = 'ach:bisv:label_confirm_subtitle';

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get buttonContainerClassName() {
    return this.isShowHeadBand ? '' : 'no-border';
  }



  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManagement: ParameterManagementService,
    private confirmationVoucherDefinitionService: T365dVoucherService,
    private activatedRoute: ActivatedRoute,
    private utilWorkFlow: UtilWorkFlowService,
    private adfFormat: AdfFormatService,
    private modalService: NgbModal,
    private modalLayoutDefinitionService: T365dModalService,
    private pdfLayoutDefinition: T365dPdfService,
    private pdfService: T365PrintPdfService,
    private t365StorageService: M365StorageService,
    private tmCommonService: TmCommonService,
    private stOperationHandler: StOperationHandlerService,
    private stProcessAtomicService: StBisvAtomicAchService,
  ) { }

  ngOnInit(): void {
    this.initState();
    this.manageBuildViewVoucher();
    this.utils.hideLoader();
  }

  initState() {
    const state = this.parameterManagement.getParameter<I365ConfirmationState>(PROTECTED_PARAMETER_STATE);
    this.view = this.activatedRoute.snapshot.data['view'];


    this.bankSettingSelected = state.bankSelected;
    this.sourceAccountSelected = state.sourceAccountSelected;
    this.targetAccountSelected = state.targetAccountSelected;
    this.formValues = state.formValues;
  }

  manageBuildViewVoucher() {
    const mappedView = {
      [ET365View.DEFAULT]: () => this.buildDefaultVoucher(),
      [ET365View.ST_DETAIL]: () => this.buildVoucherForStDetailTransaction(),
      [ET365View.ST_OPERATION]: () => this.buildVoucherForStOperation(),
    }

    const view = mappedView[this.view];
    if (!view) return;

    view();
  }

  buildDefaultVoucher() {
    this.voucherLayout = this.confirmationVoucherDefinitionService.buildVoucherConfirmationLayout({
      formValues: this.formValues,
      targetAccountSelected: this.targetAccountSelected,
      sourceAccountSelected: this.sourceAccountSelected,
      bankSelected: this.bankSettingSelected,
    });

    const { typeTransaction,  message } = this.parameterManagement.getParameter<I365ConfirmationState>(PROTECTED_PARAMETER_STATE);
    this.isShowNextButton = typeTransaction === EACHTypeTransaction.DEFAULT;
    const alertMessage = typeTransaction === EACHTypeTransaction.DEFAULT ? 'ach:bisv:label_success_transaction' : message ?? 'signature_tracking:send_successfully';
    const statusMessage = typeTransaction === EACHTypeTransaction.DEFAULT ? 'success' : 'warning';

    this.showAlert(statusMessage, alertMessage);
    this.buildHeadBand();
    this.buildProofModalLayout();
  }

  buildVoucherForStDetailTransaction() {
    const {
      formValues,
      targetAccountSelected,
      sourceAccountSelected,
      bankSelected,
    } = this.parameterManagement.getParameter<I365StDetailSTate>(PROTECTED_PARAMETER_STATE);

    this.voucherLayout = this.confirmationVoucherDefinitionService.buildVoucherConfirmationLayout({
      formValues,
      targetAccountSelected,
      sourceAccountSelected,
      bankSelected,
    });

    this.titleVoucher = 'signature_tracking_label';
    this.subTitleVoucher = 'view_detail_transaction';
    this.isShowHeadBand = false;
    this.isShowNextButton = false;
  }

  buildVoucherForStOperation() {
    const {
      formValues,
      targetAccountSelected,
      sourceAccountSelected,
      bankSelected,
      action,
    } = this.parameterManagement.getParameter<I365StOperationState>(PROTECTED_PARAMETER_STATE);

    this.voucherLayout = this.confirmationVoucherDefinitionService.buildVoucherConfirmationLayout({
      formValues,
      targetAccountSelected,
      sourceAccountSelected,
      bankSelected,
    });


    const txt = this.tmCommonService.getTitleAndSubtitleStOperation(action);
    this.titleVoucher = 'signature_tracking_label';
    this.subTitleVoucher = txt.subtitleMessage;
    this.nextButtonMessage = txt.buttonMessage;
    this.isShowHeadBand = false;
  }

  buildHeadBand() {
    const { typeTransaction, transactionResponse } = this.parameterManagement.getParameter<I365ConfirmationState>(PROTECTED_PARAMETER_STATE);
    this.isShowHeadBand = typeTransaction === EACHTypeTransaction.DEFAULT;

    if (!this.isShowHeadBand) return;

    const headBandLayoutConfirm: IHeadBandLayoutConfirm = {
      date: this.adfFormat.getFormatDateTime(transactionResponse?.dateTime ?? ''),
      reference: transactionResponse?.reference ?? '',
    };

    this.headbandLayout = this.utilWorkFlow.getHeadBandLayoutConfirm(headBandLayoutConfirm);
  }

  buildProofModalLayout() {
    const { typeTransaction, transactionResponse } = this.parameterManagement.getParameter<I365ConfirmationState>(PROTECTED_PARAMETER_STATE);
    const isShowModalLayout = typeTransaction === EACHTypeTransaction.DEFAULT;

    if  (!isShowModalLayout) return;

    this.voucherModalLayout = this.modalLayoutDefinitionService.buildTransferModalLayout({
      formValues: this.formValues,
      targetAccountSelected: this.targetAccountSelected,
      sourceAccountSelected: this.sourceAccountSelected,
      bankSelected: this.bankSettingSelected,
      transactionResponse,
    });

    this.pdfLayout = this.pdfLayoutDefinition.buildTransferPdf({
      formValues: this.formValues,
      targetAccountSelected: this.targetAccountSelected,
      sourceAccountSelected: this.sourceAccountSelected,
      bankSelected: this.bankSettingSelected,
      transactionResponse,
    });
  }

  previous() {
    if (this.view === ET365View.DEFAULT) {
      this.t365StorageService.setSourceAccountList([]);
      this.utils.showLoader();
      this.parameterManagement.sendParameters({
        [PROTECTED_PARAMETER_STATE]: null,
        [PROTECTED_PARAMETER_ROUTE]: T365RouteProtected.HOME,
      });
      this.router.navigate([E365UrlCollection.HOME]).finally(() => {});
      return;
    }

    const { position } = this.parameterManagement.getParameter<I365StDetailSTate>(PROTECTED_PARAMETER_STATE);
    this.storageToBackSignatureTracking(position);
    this.router.navigate([ESignatureTrackingUrlFlow.HOME]).finally(() => this.utils.hideLoader());
  }

  nextStep() {
    if (this.view === ET365View.DEFAULT) {
      this.openProofModal();
      return;
    }

    this.handleExecuteOperation();
  }

  openProofModal(): void {
    const modal = this.modalService.open(AdfConfirmationModalComponent, {
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'} voucher-modal voucher-modal-bisv t365`,
      size: `lg`,
    });

    modal.componentInstance.data = this.voucherModalLayout;

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
    const { account, reference, title, fileName, items } = this.pdfLayout;
    this.pdfService.pdfGenerate(account, reference, fileName, 268, title, items, true);
  }

  handleExecuteOperation() {
    const {
      transactionSelected,
      position,
      action } = this.parameterManagement.getParameter<M365StOperation>('navigateStateParameters');

    if (action === ESignatureTrackingTypeAction.PROCESS) {
      this.stProcessAtomicService.execute(transactionSelected);
      return;
    }

    this.stOperationHandler.operationManager({
      transactionSelected,
      position,
      action,
    });
  }

  storageToBackSignatureTracking(currentStep: number) {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: null,
      navigateStateParameters: {
        position: currentStep,
      },
    });
  }


  showAlert(typeAlert: string, message: string) {
    this.typeAlert = typeAlert;
    this.messageAlert = message;
  }


}
