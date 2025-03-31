import {
  AdfConfirmationModalComponent,
  AdfFormatService,
  DateTimeFormat,
  IConfirmationModal,
  IDataReading,
  IHeadBandAttribute,
  ILayout
} from '@adf/components';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { IHeadBandLayoutConfirm } from 'src/app/models/util-work-flow.interface';
import { IPrint } from 'src/app/modules/transfer/interface/print-data-interface';
import { TransfersPrintService } from 'src/app/modules/transfer/prints/transfers-print.service';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { environment } from 'src/environments/environment';
import { EConfirmationAction } from '../../enum/payment-form.enum';
import { IConfirmationData, IThirdPartyLoanAssociate } from '../../interfaces/crud/crud-third-party-loans-interface';
import { IDestinationData, IRootData, IVoucherPaymentTPL } from '../../interfaces/payment-interface';
import { TplCrudManagerService } from '../../services/definition/crud/tpl-crud-manager.service';
import { TpldPaymentManagerService } from '../../services/definition/payment/tpld-payment-manager.service';
import { Subscription } from 'rxjs';
import { TpleThirdPartyLoansService } from '../../services/execution/third-party-loan-payment/tple-third-party-loans.service';
import {
  ENavigateProtectionParameter,
  EPaymentLoansFlowView,
  ETPLPaymentUrlNavigationCollection
} from '../../enum/navigate-protection-parameter.enum';

@Component({
  selector: 'byte-tpl-confirmation-screen',
  templateUrl: './tpl-confirmation-screen.component.html',
  styleUrls: ['./tpl-confirmation-screen.component.scss'],
})
export class TplConfirmationScreenComponent implements OnInit, OnDestroy {
  //Form
  confirmationLayout!: ILayout;
  confirmationForm!: FormGroup;
  layoutJsonConfirmation: IDataReading | null = null;
  showPaymentButton: boolean = false;
  showPrintButton: boolean = false;

  //Modal
  layoutJsonVoucherModal!: IConfirmationModal;
  dataVoucher!: IVoucherPaymentTPL;

  //PDF
  pdfLayout!: IPrint;

  //defines the type of button
  typeButton: string | null = null;

  //define the text of primary button
  textButton: string | null = null;

  //Footer
  headBand: IHeadBandAttribute[] = [];
  dateTime: DateTimeFormat | null = null;

  //Header Alert
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  //Data
  confirmationData: IConfirmationData | null = null;
  routerSubscription: Subscription;
  currentView!: EPaymentLoansFlowView;

  constructor(
    private confirmationManagerService: TplCrudManagerService,
    private FormatService: AdfFormatService,
    private parameterManagementService: ParameterManagementService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private paymentManagerDefinition: TpldPaymentManagerService,
    private modalService: NgbModal,
    private pdfService: TransfersPrintService,
    private util: UtilService,
    private thirdPartyLoansExecuteService: TpleThirdPartyLoansService

  ) {
    this.routerSubscription = this.router.events.subscribe((event: any) => {
      if (event.navigationTrigger === 'popstate') {
        this.backTo();
      }
    });
  }

  ngOnInit(): void {
    this.initDefinition();
    this.util.hideLoader();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  initDefinition() {
    this.confirmationLayoutDefinition();
  }

  confirmationLayoutDefinition() {
    const parametersState = this.parameterManagementService.getParameter('navigateStateParameters');
    this.confirmationData = parametersState;
    this.currentView = parametersState?.view;

    this.layoutJsonConfirmation = this.confirmationManagerService.buildConfirmationLayout(this.confirmationData)!;
    this.buildConfirmation(this.confirmationData!);
  }

  buildConfirmation(confirmationData: IConfirmationData) {
    switch (confirmationData.action) {
      case EConfirmationAction.CREATE:
        this.showAlert('success', confirmationData.message);
        this.typeButton = 'secondary';
        this.showPrintButton = false;
        this.showPaymentButton = true;
        break;
      case EConfirmationAction.DELETE:
        this.showPaymentButton = false;
        this.showPrintButton = false;
        this.typeButton = 'primary';
        this.showAlert('success', confirmationData.message);
        break;
      case EConfirmationAction.PAYMENT:
        this.showAlert('success', confirmationData.message);
        this.typeButton = 'secondary';
        this.showPaymentButton = false;
        this.showPrintButton = true;
        break;
      case EConfirmationAction.ERROR_PAYMENT:
        this.showAlert('error', confirmationData.message);
        this.showPaymentButton = false;
        this.showPrintButton = false;
        this.typeButton = 'primary';
        break;
    }

    if (confirmationData.action === EConfirmationAction.ERROR_PAYMENT) {
      return;
    }

    this.dateTime = this.FormatService.getFormatDateTime(confirmationData.dateTime);

    const headBandLayoutConfirm: IHeadBandLayoutConfirm = {
      date: this.dateTime,
      reference: confirmationData.reference,
    };

    this.headBand = this.confirmationManagerService.buildHeadBandLayout(headBandLayoutConfirm);
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  backTo(): void {
    const parametersState = this.parameterManagementService.getParameter('navigateStateParameters');

    if (parametersState?.isError) {
      this.parameterManagementService.sendParameters({
        navigationProtectedParameter: ENavigateProtectionParameter.PAYMENT,
        navigateStateParameters: parametersState?.currentState,
      });

      this.router.navigate(['/loan/third-party-loans/payment']).then(() => {});
      return;
    }

    if(this.currentView === EPaymentLoansFlowView.ALL_LOANS){
      this.router.navigate([ETPLPaymentUrlNavigationCollection.HOME2]).then(() => {});
    } else {
      this.router.navigate([ETPLPaymentUrlNavigationCollection.HOME]).then(() => {});
    }

    this.parameterManagementService.sendParameters({
      navigationProtectedParameter: null,
      navigateStateParameters: null,
    });
  }

  goToPayment() {
    this.confirmationData!.data.currencyCode = this.util.getCurrencySymbolToIso(this.confirmationData?.data.currencyCode ?? 'UNDEFINED');
    this.thirdPartyLoansExecuteService.gotToPayment(this.confirmationData?.data as IThirdPartyLoanAssociate, this.currentView);
  }

  getDataVoucherModal() {
    const rootGroupData: IRootData = {
      dateOperation: this.confirmationData?.dateTime!,
      typeAccount: this.confirmationData?.data.accountProduct!,
      accountDebited: this.confirmationData?.data.accountDebited!,
      currency: this.confirmationData?.data.currency!,
      amountDebited: this.confirmationData?.data.amount!,
      nameAccount: this.confirmationData?.data.nameAccountDebited!,
    };

    const rootGroupDestination: IDestinationData = {
      accountCredit: this.confirmationData?.data.loanIdentifier!,
      nameLoan: this.confirmationData?.data.nameLoan!,
      typeAccount: parseInt(this.confirmationData?.data.loanProduct!),
      comment: this.confirmationData?.data.comment,
    };

    this.dataVoucher = {
      rootData: rootGroupData,
      destinationData: rootGroupDestination,
      reference: this.confirmationData?.reference!,
    };

    this.layoutJsonVoucherModal = this.paymentManagerDefinition.buildVoucherPaymentModal(this.dataVoucher);
    this.openModal();
  }

  async openModal() {
    const voucherModal = this.modalService.open(AdfConfirmationModalComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} voucher-modal`,
      size: `lg`,
    });

    voucherModal.componentInstance.data = this.layoutJsonVoucherModal;

    try {
      const isResult = await voucherModal.result;
      if (!isResult) {
        return;
      }

      this.exportFile();
    } catch (error) {}
  }

  exportFile() {
    this.pdfLayout = this.paymentManagerDefinition.buildVoucherPaymentPDF(this.dataVoucher);
    const { account, reference, title, fileName, items } = this.pdfLayout;

    this.pdfService.pdfGenerate(account, reference, fileName, 268, title, items, true);
  }
}
