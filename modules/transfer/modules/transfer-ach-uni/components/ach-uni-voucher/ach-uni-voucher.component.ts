import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransfersPrintService } from 'src/app/modules/transfer/prints/transfers-print.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { IAchAccount } from '../../../transfer-ach/interfaces/ach-account-interface';
import { IAccount } from 'src/app/models/account.inteface';
import { AchUniTransactionNavigateParameterState } from '../../interfaces/ach-uni-transaction-navigate-parameter-state';
import { AchUniFormValues } from '../../interfaces/ach-uni-transfer.interface';
import { EACHTypeTransaction } from '../../../transfer-ach/enum/transfer-ach.enum';
import { IPrint } from 'src/app/modules/transfer/interface/print-data-interface';
import { AdfConfirmationModalComponent, IConfirmationModal, IDataReading, IHeadBandAttribute } from '@adf/components';
import { AchUniTransferUrlNavigationCollection } from '../../enums/ach-uni-navigation-parameter.enum';
import { IAchUniVoucherLayout } from '../../interfaces/ach-uni-definition';
import { AchUniPurpose } from '../../interfaces/ach-uni-purpose';
import { AchUniBank } from '../../interfaces/ach-uni-bank';
import { EachUniTransferManagerService } from '../../services/execution/e-ach-uni-transfer-manager.service';
import { EACHUNIView } from '../../enums/view.enum';
import {
  ESignatureTrackingUrlFlow
} from '../../../../../transaction-manager/modules/signature-tracking/enum/st-navigate-enum';
import { PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import {
  TAchUniTransferVoucherService
} from '../../services/definition/transaction/t-ach-uni-transfer-voucher.service';
import { TmCommonService } from '../../../../../transaction-manager/services/tm-common.service';
import {
  ESignatureTrackingTypeAction
} from '../../../../../transaction-manager/modules/signature-tracking/enum/st-transaction-status.enum';
import {
  StOperationHandlerService
} from '../../../../../transaction-manager/modules/signature-tracking/services/execution/handlers/st-operation-handler.service';
import {
  StBisvAtomicAchService
} from '../../../../../transaction-manager/modules/signature-tracking/services/execution/definitions/bisv/atomic/st-bisv-atomic-ach.service';
import { AchUniTransactionViewMode } from '../../enums/AchUniTransactionViewMode.enum';
import { IHeadBandLayoutConfirm } from '../../../../../../models/util-work-flow.interface';
import { AchUniPdfCustom } from '../../enums/ach-uni-pdf-custom.enum';

@Component({
  selector: 'byte-ach-uni-voucher',
  templateUrl: './ach-uni-voucher.component.html',
  styleUrls: ['./ach-uni-voucher.component.scss']
})
export class AchUniVoucherComponent implements OnInit {

  urlUni: string = 'assets/images/logos/SVG_BIES_TOB_UNI_Logo.svg';
  typeAlert: string | undefined;
  messageAlert: string | undefined;
  isShowPrintButton: boolean = false;
  isShowHeadband = true;

  view: EACHUNIView = EACHUNIView.DEFAULT;
  associatedAccounts: IAchAccount[] = [];

  accountSelectedDebited: IAccount | null = null;
  accountSelectedDestination!: IAccount;
  purposeSelect!: AchUniPurpose;
  bankSelect!: AchUniBank;
  formValues: AchUniFormValues | undefined;
  dateTime: string | undefined;
  reference: string | undefined;
  typeTransaction: EACHTypeTransaction | undefined;
  currentTabPosition: number | undefined;
  title = 'transfers_other_banks';
  subtitle = 'ach-uni:confirm-transfer';
  footerText = 'ach-uni:transfer-info';


  voucherLayout: IDataReading | null = null;
  voucherModalLayout: IConfirmationModal | null = null;
  pdfLayout!: IPrint;
  headbandLayout: IHeadBandAttribute[] = [];
  printButtonMessage = 'print';
  responseTransaction: any;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get typePrevButton() {
    return 'secondary';
  }

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private persistStepStateService: ParameterManagementService,
    private pdfService: TransfersPrintService,
    private transactionExecuteManagerDefinition: EachUniTransferManagerService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private voucherDefinitionService: TAchUniTransferVoucherService,
    private utils: UtilService,
    private tmCommonService: TmCommonService,
    private stOperationHandler: StOperationHandlerService,
    private activatedRouter: ActivatedRoute,
    private stProcessAtomicService: StBisvAtomicAchService,
  ) {
    this.translate.onLangChange.subscribe({
      next: () => {
        this.manageBuildViewVoucher();
      }
    })
  }

  ngOnInit(): void {
    this.view = this.activatedRoute.snapshot.data['view'];
    this.associatedAccounts = this.activatedRoute.snapshot.data?.['associatedAccounts'] ?? [];

    this.initDefinition();
    this.manageBuildViewVoucher();
    this.utils.hideLoader();
  }

  initDefinition() {

    const achUniStateParameters: AchUniTransactionNavigateParameterState = this.persistStepStateService.getParameter('navigateStateParameters');

    this.accountSelectedDestination = achUniStateParameters?.accountDestination;
    this.accountSelectedDebited = achUniStateParameters?.accountDebited;
    this.formValues = achUniStateParameters?.formValues;
    this.dateTime = achUniStateParameters?.response?.date ?? achUniStateParameters?.transactionResponse?.dateTime;
    this.reference = achUniStateParameters?.transactionResponse?.data?.referenceNumber ?? achUniStateParameters?.transactionResponse?.reference;
    this.responseTransaction = achUniStateParameters?.transactionResponse?.data;
    this.typeTransaction = achUniStateParameters?.typeTransaction;
    this.currentTabPosition = achUniStateParameters?.position;
    this.bankSelect = achUniStateParameters?.bank;

    if(this.view === EACHUNIView.DEFAULT || this.view === EACHUNIView.DEFAULT_CONFIRMATION){
      this.purposeSelect = achUniStateParameters?.purpose;
    }

  }

  manageBuildViewVoucher() {
    const mappedView = {
      [EACHUNIView.DEFAULT]: () => this.voucherDefinitionForDefaultTransaction(),
      [EACHUNIView.DEFAULT_CONFIRMATION]: () => this.voucherDefinitionForDefaultTransaction(),
      [EACHUNIView.ST_OPERATION]: () => this.buildViewForStOperation(),
      [EACHUNIView.ST_DETAIL]: () => this.buildViewForStDetail(),
      [AchUniTransactionViewMode.SIGNATURE_TRACKING_MODIFY]: () => this.buildViewForStUpdatedVoucher(),
    }

    const view = mappedView[this.view];
    if (!view) return;

    view();
  }

  voucherDefinitionForDefaultTransaction() {

    // Flujo de ACH
    // Transacción inmediata, y transacción hacia firmas

    switch (this.typeTransaction) {
      case EACHTypeTransaction.DEFAULT:
        this.buildVoucherForDefaultTransactionAndTransactionHistory(true);
        break;
    }
  }

  buildVoucherForDefaultTransactionAndTransactionHistory(isShowAlert: boolean) {
    const targetAccount = this.associatedAccounts.find((account) => account.account === this.accountSelectedDestination?.account);
    // this.isShowPrintButton = true;

    const parametersVoucher: IAchUniVoucherLayout = {
      title: (this.view === EACHUNIView.DEFAULT_CONFIRMATION) ? 'ach-uni:title-voucher' : 'transfers_other_banks',
      subtitle: 'ach-uni:confirm-transfer',
      titlePdf:  (this.view === EACHUNIView.DEFAULT_CONFIRMATION) ? 'ach-uni:title-voucher' : 'transfers_other_banks',
      fileNamePdf: this.translate.instant('pdf:ach'),
      formValues: this.formValues as AchUniFormValues,
      sourceAccount: this.accountSelectedDebited as IAccount,
      targetAccount: this.accountSelectedDestination,
      reference: this.reference as string,
      dateTime: this.dateTime as string,
      purpose: this.purposeSelect,
      bank: this.bankSelect,
      commission: this.formValues?.commission ?? ''
    };

    const { pdfLayout, voucherLayout, voucherModalLayout, headBandLayout } = this.transactionExecuteManagerDefinition.buildVoucherScreen(parametersVoucher);

    this.voucherLayout = voucherLayout;
    this.voucherModalLayout = voucherModalLayout;
    this.pdfLayout = pdfLayout as IPrint;
    this.headbandLayout = headBandLayout;

    if(this.responseTransaction?.errorCode === '039'){
      isShowAlert && this.showAlert('warning', this.responseTransaction?.errorDescription);
      this.isShowPrintButton = false;
      this.isShowHeadband = false;
    }

    if(this.responseTransaction?.errorCode === '0'){
      isShowAlert && this.showAlert('success',  this.responseTransaction?.errorDescription || 'ach-uni:transfer-success');
      this.isShowPrintButton = true;
      this.isShowHeadband = true;
    }

    if(this.responseTransaction?.errorCode === '124'){
      isShowAlert && this.showAlert('success', this.responseTransaction?.errorDescription || 'ach-uni:transfer-success-other-hour');
      this.isShowPrintButton = true;
      this.isShowHeadband = false;
    }
  }

  buildViewForStDetail() {
    const state = this.persistStepStateService.getParameter(PROTECTED_PARAMETER_STATE);
    const purposeList: AchUniPurpose[] = this.activatedRouter.snapshot.data['getPurposeList'] ?? [];


    if(this.view === EACHUNIView.ST_DETAIL){
      state.purpose = purposeList.find((purpose: AchUniPurpose) => purpose.code === state.formValues.purpose);
    }

    this.title = 'signature_tracking_label';
    this.subtitle = 'view_detail_transaction';
    this.footerText = 'ach:bisv:label_ach_atomic_footer_st';
    this.isShowHeadband = false;
    this.isShowPrintButton = false;
    this.voucherLayout = this.voucherDefinitionService.buildVoucherForStView(state);
  }

  buildViewForStUpdatedVoucher() {
    const state = this.persistStepStateService.getParameter(PROTECTED_PARAMETER_STATE);
    const purposeList: AchUniPurpose[] = this.activatedRouter.snapshot.data['getPurposeList'] ?? [];

    if(this.view === EACHUNIView.ST_DETAIL){
      state.purpose = purposeList.find((purpose: AchUniPurpose) => purpose.code === state.purpose.code);
    }

    const parametersVoucher: IAchUniVoucherLayout = {
      title: 'transfers_other_banks',
      subtitle: 'ach-uni:confirm-transfer',
      titlePdf: 'transfers_other_banks',
      fileNamePdf: this.translate.instant('pdf:ach'),
      formValues: this.formValues as AchUniFormValues,
      sourceAccount: this.accountSelectedDebited as IAccount,
      targetAccount: this.accountSelectedDestination,
      reference: state?.transactionResponse?.reference,
      dateTime: state?.transactionResponse?.dateTime,
      purpose: state?.purpose,
      bank: this.bankSelect,
      commission: this.formValues?.commission ?? ''
    };

    const { voucherLayout, headBandLayout } = this.transactionExecuteManagerDefinition.buildVoucherScreen(parametersVoucher);

    this.voucherLayout = voucherLayout;
    this.headbandLayout = headBandLayout;

    this.title = 'signature_tracking_label';
    this.subtitle = 'signature_tackingModifyConfirmationTransaction';
    this.footerText = 'ach:bisv:label_ach_atomic_footer_st';
    this.isShowPrintButton = false;
    this.showAlert('success', 'signature_trackingModifyMessage');
  }

  buildViewForStOperation() {
    const state = this.persistStepStateService.getParameter(PROTECTED_PARAMETER_STATE);
    const purposeList: AchUniPurpose[] = this.activatedRouter.snapshot.data['getPurposeList'] ?? [];
    this.isShowPrintButton = true;
    if(this.view === EACHUNIView.ST_OPERATION){
      state.purpose = purposeList.find((purpose: AchUniPurpose) => purpose.code === state.purpose.code);
    }

    const txt = this.tmCommonService.getTitleAndSubtitleStOperation(state.action);
    this.title = 'signature_tracking_label';
    this.footerText = 'ach:bisv:label_ach_atomic_footer_st';
    this.subtitle = txt.subtitleMessage;
    this.printButtonMessage = txt.buttonMessage;
    this.isShowHeadband = false;
    this.voucherLayout = this.voucherDefinitionService.buildVoucherForStView(state);
  }

  print() {
    if (this.view === EACHUNIView.DEFAULT || this.view === EACHUNIView.DEFAULT_CONFIRMATION) {
      this.openProofACHTransactionModal();
      return;
    }

    if (this.view === EACHUNIView.ST_OPERATION) {
      this.manageExecuteOperation();
      return;
    }
  }

  manageExecuteOperation() {
    const {
      transactionSelected,
      position,
      action } = this.persistStepStateService.getParameter('navigateStateParameters');

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

  openProofACHTransactionModal(): void {
    const modal = this.modalService.open(AdfConfirmationModalComponent, {
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'} voucher-modal voucher-modal-bisv`,
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

  back() {
    if (this.view ===  EACHUNIView.DEFAULT || this.view ===  EACHUNIView.DEFAULT_CONFIRMATION) {
      this.utils.showLoader();
      this.resetStorage();
      this.router.navigate([AchUniTransferUrlNavigationCollection.HOME_APP]).finally(() => {});
      return;
    }

    this.utils.showLoader();
    this.resetStorageForSt();
    this.router.navigate([ESignatureTrackingUrlFlow.HOME]).finally(() => {});
  }

  exportFile() {
    const { account, reference, title, fileName, items } = this.pdfLayout;
    this.pdfService.pdfGenerate(account, reference, fileName, 268, title, items, true, AchUniPdfCustom.UNI);
  }

  resetStorage(navParameters?: string) {
    this.persistStepStateService.sendParameters({
      achParametersForm: null,
      navigationProtectedParameter: navParameters,
      navigateStateParameters: null,
    });
  }

  resetStorageForSt() {
    const state = this.persistStepStateService.getParameter(PROTECTED_PARAMETER_STATE);
    this.persistStepStateService.sendParameters({
      navigationProtectedParameter: null,
      navigateStateParameters: {
        position: state.position,
      },
    });
  }

  showAlert(typeAlert?: string, message?: string) {
    this.typeAlert = typeAlert;
    this.messageAlert = message;
  }

  hiddenAlert() {
    this.typeAlert = undefined;
    this.messageAlert = undefined;
  }



}
