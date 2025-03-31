import { Component, OnInit } from '@angular/core';
import {
  AdfConfirmationModalComponent,
  AdfFormatService,
  IConfirmationModal,
  IDataReading,
  IHeadBandAttribute
} from '@adf/components';
import { IAccount } from '../../../../../../models/account.inteface';
import { IS365ConfirmationState, IS365HomeState } from '../../interfaces/state.interface';
import { PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { UtilService } from '../../../../../../service/common/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { S368dVoucherService } from '../../services/definition/s368d-voucher.service';
import { ES365UrlCollection } from '../../enum/url-collection.enum';
import { ES365View } from '../../enum/view.enum';
import { M3635StateConfirmation } from '../../../transfer-365-movil/interfaces/state.interface';
import { EACHTypeTransaction } from '../../../transfer-ach/enum/transfer-ach.enum';
import { IHeadBandLayoutConfirm } from '../../../../../../models/util-work-flow.interface';
import { UtilWorkFlowService } from '../../../../../../service/common/util-work-flow.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IPrint } from '../../../../interface/print-data-interface';
import { S368dModalService } from '../../services/definition/s368d-modal.service';
import { S368dPdfService } from '../../services/definition/s368d-pdf.service';
import { S368PdfService } from '../../services/print/s368-pdf.service';
import { ITMTransaction } from '../../../../../transaction-manager/interfaces/tm-transaction.interface';
import {
  ESignatureTrackingTypeAction
} from '../../../../../transaction-manager/modules/signature-tracking/enum/st-transaction-status.enum';
import {
  ESignatureTrackingUrlFlow
} from '../../../../../transaction-manager/modules/signature-tracking/enum/st-navigate-enum';
import { TmCommonService } from '../../../../../transaction-manager/services/tm-common.service';
import {
  StOperationHandlerService
} from '../../../../../transaction-manager/modules/signature-tracking/services/execution/handlers/st-operation-handler.service';
import { IAMS365Account } from '../../../../../accounts-management/interfaces/am-account-list.interface';

@Component({
  selector: 'byte-s365-voucher',
  templateUrl: './s365-voucher.component.html',
  styleUrls: ['./s365-voucher.component.scss']
})
export class S365VoucherComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  voucherLayout!: IDataReading;
  voucherModalLayout!: IConfirmationModal;
  pdfLayout!: IPrint;
  headbandLayout: IHeadBandAttribute[] = [];

  sourceAccountSelected!: IAccount;
  targetAccountSelected!: IAMS365Account;
  reasonSelected: any;

  view: ES365View = ES365View.DEFAULT;
  isShowNextButton = true;
  isShowHeadBand = true;
  isShowInfoTxt = true;
  nextButtonMessage = 'print';
  titleVoucher = 's365:label_home';
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
    private s365VoucherDefinition: S368dVoucherService,
    private s365ModalVoucherDefinition: S368dModalService,
    private s365PdfDefinition: S368dPdfService,
    private activatedRoute: ActivatedRoute,
    private utilWorkFlow: UtilWorkFlowService,
    private adfFormat: AdfFormatService,
    private modalService: NgbModal,
    private pdfService: S368PdfService,
    private stOperationHandler: StOperationHandlerService,
    private tmCommonService: TmCommonService,
  ) { }

  ngOnInit(): void {
    this.initState();
    this.manageBuildViewVoucher();
    this.utils.hideLoader();
  }

  manageBuildViewVoucher() {
    const mappedView = {
      [ES365View.DEFAULT]: () => this.buildDefaultVoucher(),
      [ES365View.ST_DETAIL]: () => this.buildVoucherForStDetail(),
      [ES365View.ST_OPERATIONS]: () => this.buildVoucherForStOperation(),
    }

    const view = mappedView[this.view];
    if (!view) return;

    view();
  }

  initState() {
    const state = this.parameterManagement.getParameter<IS365HomeState>(PROTECTED_PARAMETER_STATE);
    this.view = this.activatedRoute.snapshot.data['view'];

    this.sourceAccountSelected = state.sourceAccountSelected;
    this.targetAccountSelected = state.targetAccountSelected;
    this.reasonSelected = state.reasonSelected;
  }

  buildDefaultVoucher() {
    const state = this.parameterManagement.getParameter<IS365HomeState>(PROTECTED_PARAMETER_STATE);

    this.voucherLayout = this.s365VoucherDefinition.buildConfirmationVoucherLayout(state);
    const { typeTransaction,  message } = this.parameterManagement.getParameter<M3635StateConfirmation>(PROTECTED_PARAMETER_STATE);
    this.isShowNextButton = typeTransaction === EACHTypeTransaction.DEFAULT;
    const alertMessage = typeTransaction === EACHTypeTransaction.DEFAULT ? 'ach:bisv:label_success_transaction' : message ?? 'signature_tracking:send_successfully';
    const statusMessage = typeTransaction === EACHTypeTransaction.DEFAULT ? 'success' : 'warning';

    this.showAlert(statusMessage, alertMessage);
    this.buildHeadBand();
    this.buildProofModalLayout();
  }

  buildVoucherForStDetail() {
    const state = this.parameterManagement.getParameter<IS365HomeState>(PROTECTED_PARAMETER_STATE);

    this.voucherLayout = this.s365VoucherDefinition.buildConfirmationVoucherLayout({
      ...state,
    });

    this.titleVoucher = 'signature_tracking_label';
    this.subTitleVoucher = 'view_detail_transaction';
    this.isShowHeadBand = false;
    this.isShowNextButton = false;
    this.isShowInfoTxt = false;
  }

  buildVoucherForStOperation() {
    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);

    this.voucherLayout = this.s365VoucherDefinition.buildConfirmationVoucherLayout({
      ...state,
    });

    const txt = this.tmCommonService.getTitleAndSubtitleStOperation(state.action);
    this.titleVoucher = 'signature_tracking_label';
    this.subTitleVoucher = txt.subtitleMessage;
    this.nextButtonMessage = txt.buttonMessage;
    this.isShowHeadBand = false;
    this.isShowInfoTxt = false;
  }

  buildHeadBand() {
    const { typeTransaction, transactionResponse } = this.parameterManagement.getParameter<IS365ConfirmationState>(PROTECTED_PARAMETER_STATE);
    this.isShowHeadBand = typeTransaction === EACHTypeTransaction.DEFAULT;

    if (!this.isShowHeadBand) return;

    const headBandLayoutConfirm: IHeadBandLayoutConfirm = {
      date: this.adfFormat.getFormatDateTime(transactionResponse.dateTime),
      reference: transactionResponse.reference,
    };

    this.headbandLayout = this.utilWorkFlow.getHeadBandLayoutConfirm(headBandLayoutConfirm);
  }

  buildProofModalLayout() {
    const { typeTransaction, transactionResponse, message, ...rest } = this.parameterManagement.getParameter<IS365ConfirmationState>(PROTECTED_PARAMETER_STATE);
    const isShowModalLayout = typeTransaction === EACHTypeTransaction.DEFAULT;

    if  (!isShowModalLayout) return;

    this.voucherModalLayout = this.s365ModalVoucherDefinition.buildTransferModalLayout({
      ...rest,
      transactionResponse,
    });

    this.pdfLayout = this.s365PdfDefinition.buildTransferPdf({
      ...rest,
      transactionResponse,
    });
  }

  previous() {
    this.utils.showLoader();
    if (this.view === ES365View.DEFAULT) {
      this.parameterManagement.sendParameters({
        [PROTECTED_PARAMETER_STATE]: null,
      });
      this.router.navigate([ES365UrlCollection.HOME]).finally(() => {});

      return;
    }

    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);
    this.storageToBackSignatureTracking(state.position);
    this.router.navigate([ESignatureTrackingUrlFlow.HOME]).finally(() => this.utils.hideLoader());
  }

  nextStep() {
    if (this.view === ES365View.DEFAULT) {
      this.openProofModal();
      return;
    }

    this.handleExecuteOperation();
  }

  handleExecuteOperation() {
    const ownTransferState = this.parameterManagement.getParameter('navigateStateParameters');

    const transactionSelected: ITMTransaction = ownTransferState?.transactionSelected;
    const position: number = ownTransferState?.position;

    if (ownTransferState?.action === ESignatureTrackingTypeAction.PROCESS) {
      console.log('create service to process')
      return;
    }

    this.stOperationHandler.operationManager({
      transactionSelected,
      position,
      action: ownTransferState?.action
    });
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
        if (!isConfirm) return;

        this.exportFile();
      })
      .catch((error) => error);
  }

  exportFile() {
    const { account, reference, title, fileName, items } = this.pdfLayout;
    this.pdfService.pdfGenerate(account, reference, fileName, 268, title, items, true);
  }

  storageToBackSignatureTracking(currentStep: number) {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: null,
      navigateStateParameters: {
        position: currentStep,
      },
    });
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }
}
