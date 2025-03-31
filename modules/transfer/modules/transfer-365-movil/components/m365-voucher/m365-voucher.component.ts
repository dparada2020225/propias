import { Component, OnInit } from '@angular/core';
import { IAccount } from '../../../../../../models/account.inteface';
import {
  AdfConfirmationModalComponent,
  AdfFormatService,
  IConfirmationModal,
  IDataReading,
  IHeadBandAttribute
} from '@adf/components';
import { IPrint } from '../../../../interface/print-data-interface';
import { UtilService } from '../../../../../../service/common/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { UtilWorkFlowService } from '../../../../../../service/common/util-work-flow.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { T365PrintPdfService } from '../../../transfer-365/services/print/t365-print-pdf.service';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { EACHTypeTransaction } from '../../../transfer-ach/enum/transfer-ach.enum';
import { IHeadBandLayoutConfirm } from '../../../../../../models/util-work-flow.interface';
import { IM365FormValues } from '../../interfaces/form.interface';
import { MT365View } from '../../enum/view.enum';
import { M3635StateConfirmation, M365StOperation } from '../../interfaces/state.interface';
import { EM365UrlCollection } from '../../enum/url-collection.enum';
import { M365ModalService } from '../../services/definition/m365-modal.service';
import { M365PdfService } from '../../services/definition/m365-pdf.service';
import { M365VoucherService } from '../../services/definition/m365-voucher.service';
import { M365StorageService } from '../../services/execution/m365-storage.service';
import { TmCommonService } from '../../../../../transaction-manager/services/tm-common.service';
import {
  ESignatureTrackingTypeAction
} from '../../../../../transaction-manager/modules/signature-tracking/enum/st-transaction-status.enum';
import {
  ESignatureTrackingUrlFlow
} from '../../../../../transaction-manager/modules/signature-tracking/enum/st-navigate-enum';
import {
  StOperationHandlerService
} from '../../../../../transaction-manager/modules/signature-tracking/services/execution/handlers/st-operation-handler.service';
import {
  AM365Account
} from '../../../../../accounts-management/modules/t365-movil/interfaces/associated-account.interface';
import { IACHBiesGeneralParameterBank } from '../../../../../../models/ach-general-parameters.interface';
import {
  StBisvAtomicAchService
} from '../../../../../transaction-manager/modules/signature-tracking/services/execution/definitions/bisv/atomic/st-bisv-atomic-ach.service';
import { S365RouteProtected } from '../../enum/route-protected.enum';

@Component({
  selector: 'byte-m365-voucher',
  templateUrl: './m365-voucher.component.html',
  styleUrls: ['./m365-voucher.component.scss']
})
export class M365VoucherComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  sourceAccountSelected!: IAccount;
  beneficiarySelected: AM365Account | undefined;
  bankSettingSelected!: IACHBiesGeneralParameterBank;
  formValues!: IM365FormValues;

  voucherLayout!: IDataReading;
  voucherModalLayout!: IConfirmationModal;
  pdfLayout!: IPrint;
  headbandLayout: IHeadBandAttribute[] = [];

  view: MT365View = MT365View.DEFAULT;
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
    private confirmationVoucherDefinitionService: M365VoucherService,
    private activatedRoute: ActivatedRoute,
    private utilWorkFlow: UtilWorkFlowService,
    private adfFormat: AdfFormatService,
    private modalService: NgbModal,
    private modalLayoutDefinitionService: M365ModalService,
    private pdfLayoutDefinition: M365PdfService,
    private pdfService: T365PrintPdfService,
    private m365StorageService: M365StorageService,
    private stOperationHandler: StOperationHandlerService,
    private tmCommonService: TmCommonService,
    private stProcessAtomicService: StBisvAtomicAchService,
  ) { }

  ngOnInit(): void {
    this.initState();
    this.manageBuildViewVoucher();
    this.utils.hideLoader();
  }

  initState() {
    const state = this.parameterManagement.getParameter<M3635StateConfirmation>(PROTECTED_PARAMETER_STATE);
    this.view = this.activatedRoute.snapshot.data['view'];


    this.bankSettingSelected = state.bankSettingSelected;
    this.sourceAccountSelected = state.sourceAccountSelected;
    this.beneficiarySelected = state.beneficiarySelected;
    this.formValues = state.formValues;
  }

  manageBuildViewVoucher() {
    const mappedView = {
      [MT365View.DEFAULT]: () => this.buildDefaultVoucher(),
      [MT365View.ST_OPERATION]: () => this.buildVoucherForStOperation(),
      [MT365View.ST_DETAIL]: () => this.buildVoucherForStDetail(),
    }

    const view = mappedView[this.view];
    if (!view) return;

    view();
  }

  buildDefaultVoucher() {
    this.voucherLayout = this.confirmationVoucherDefinitionService.buildVoucherLayout({
      formValues: this.formValues,
      beneficiarySelected: this.beneficiarySelected,
      sourceAccountSelected: this.sourceAccountSelected,
      bankSettingSelected: this.bankSettingSelected,
    });

    const { typeTransaction,  message } = this.parameterManagement.getParameter<M3635StateConfirmation>(PROTECTED_PARAMETER_STATE);
    this.isShowNextButton = typeTransaction === EACHTypeTransaction.DEFAULT;
    const alertMessage = typeTransaction === EACHTypeTransaction.DEFAULT ? 'ach:bisv:label_success_transaction' : message ?? 'signature_tracking:send_successfully';
    const statusMessage = typeTransaction === EACHTypeTransaction.DEFAULT ? 'success' : 'warning';

    this.showAlert(statusMessage, alertMessage);
    this.buildHeadBand();
    this.buildProofModalLayout();
  }

  buildVoucherForStDetail() {
    this.voucherLayout = this.confirmationVoucherDefinitionService.buildVoucherLayout({
      formValues: this.formValues,
      beneficiarySelected: this.beneficiarySelected,
      sourceAccountSelected: this.sourceAccountSelected,
      bankSettingSelected: this.bankSettingSelected,
    });

    this.titleVoucher = 'signature_tracking_label';
    this.subTitleVoucher = 'view_detail_transaction';
    this.isShowHeadBand = false;
    this.isShowNextButton = false;
  }


  buildVoucherForStOperation() {
    const {
      action,
    } = this.parameterManagement.getParameter<M365StOperation>(PROTECTED_PARAMETER_STATE);

    this.voucherLayout = this.confirmationVoucherDefinitionService.buildVoucherLayout({
      formValues: this.formValues,
      beneficiarySelected: this.beneficiarySelected,
      sourceAccountSelected: this.sourceAccountSelected,
      bankSettingSelected: this.bankSettingSelected,
    });



    const txt = this.tmCommonService.getTitleAndSubtitleStOperation(action);
    this.titleVoucher = 'signature_tracking_label';
    this.subTitleVoucher = txt.subtitleMessage;
    this.nextButtonMessage = txt.buttonMessage;
    this.isShowHeadBand = false;
  }

  buildHeadBand() {
    const { typeTransaction, transactionResponse } = this.parameterManagement.getParameter<M3635StateConfirmation>(PROTECTED_PARAMETER_STATE);
    this.isShowHeadBand = typeTransaction === EACHTypeTransaction.DEFAULT;

    if (!this.isShowHeadBand) return;

    const headBandLayoutConfirm: IHeadBandLayoutConfirm = {
      date: this.adfFormat.getFormatDateTime(transactionResponse?.dateTime ?? ''),
      reference: transactionResponse?.reference ?? '',
    };

    this.headbandLayout = this.utilWorkFlow.getHeadBandLayoutConfirm(headBandLayoutConfirm);
  }

  buildProofModalLayout() {
    const { typeTransaction, transactionResponse } = this.parameterManagement.getParameter<M3635StateConfirmation>(PROTECTED_PARAMETER_STATE);
    const isShowModalLayout = typeTransaction === EACHTypeTransaction.DEFAULT;

    if  (!isShowModalLayout) return;

    this.voucherModalLayout = this.modalLayoutDefinitionService.buildTransferModalLayout({
      formValues: this.formValues,
      beneficiarySelected: this.beneficiarySelected,
      sourceAccountSelected: this.sourceAccountSelected,
      bankSettingSelected: this.bankSettingSelected,
      transactionResponse,
    });

    this.pdfLayout = this.pdfLayoutDefinition.buildTransferPdf({
      formValues: this.formValues,
      beneficiarySelected: this.beneficiarySelected,
      sourceAccountSelected: this.sourceAccountSelected,
      bankSettingSelected: this.bankSettingSelected,
      transactionResponse,
    });
  }

  previous() {
    this.utils.showLoader();
    if (this.view === MT365View.DEFAULT) {
      this.m365StorageService.setSourceAccountList([]);
      this.parameterManagement.sendParameters({
        [PROTECTED_PARAMETER_STATE]: null,
        [PROTECTED_PARAMETER_ROUTE]: S365RouteProtected.HOME,
      });
      this.router.navigate([EM365UrlCollection.HOME]).finally(() => {});

      return;
    }


    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);
    this.storageToBackSignatureTracking(state.position);
    this.router.navigate([ESignatureTrackingUrlFlow.HOME]).finally(() => this.utils.hideLoader());
  }

  nextStep() {
    if (this.view === MT365View.DEFAULT) {
      this.openProofModal();
      return;
    }

    this.handleExecuteOperation();
  }

  storageToBackSignatureTracking(currentStep: number) {
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_ROUTE]: null,
      [PROTECTED_PARAMETER_STATE]: {
        position: currentStep,
      },
    });
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

  showAlert(typeAlert: string, message: string) {
    this.typeAlert = typeAlert;
    this.messageAlert = message;
  }


}
