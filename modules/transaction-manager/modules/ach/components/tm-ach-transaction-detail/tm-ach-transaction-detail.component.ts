import { Component, OnInit } from '@angular/core';
import { AdfConfirmationModalComponent, IConfirmationModal, IDataReading } from '@adf/components';
import { UtilService } from '../../../../../../service/common/util.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { ITMConsultACHDetailTransactionState, ITMConsultACHSignatoryListState } from '../../interfaces/state.interface';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { ETMConsultACHView } from '../../enum/view.enum';
import { ETMConsultACHUrlCollection } from '../../enum/url-collection.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IPrint } from '../../../../../transfer/interface/print-data-interface';
import { TmAchDetailPrintService } from '../../services/print/tm-ach-detail-print.service';
import { TmAchTransactionService } from '../../services/transaction/tm-ach-transaction.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TmdAchAtomicVoucherService } from '../../services/definition/tmd-ach-atomic-voucher.service';
import { ETMACHService } from '../../enum/form-control-name.enum';
import { TmdAchMultipleVoucherService } from '../../services/definition/tmd-ach-multiple-voucher.service';
import { AdminPanelProvidersProtectedParameters } from '../../enum/route-protected.enum';
import { IUserInfo } from '../../../../../../models/user-info.interface';

@Component({
  selector: 'byte-tm-ach-transaction-detail',
  templateUrl: './tm-ach-transaction-detail.component.html',
  styleUrls: ['./tm-ach-transaction-detail.component.scss']
})
export class TmAchTransactionDetailComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  voucherLayout!: IDataReading;
  voucherModalLayout!: IConfirmationModal;
  pdfLayout!: IPrint;
  isShowSignatureBtn = false;
  title = 'tm-ach-uni:subtitle_base'

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private router: Router,
    private utils: UtilService,
    private modalService: NgbModal,
    private parameterManagement: ParameterManagementService,
    private atomicVoucherService: TmdAchAtomicVoucherService,
    private multipleVoucherService: TmdAchMultipleVoucherService,
    private pdfService: TmAchDetailPrintService,
    private transactionService: TmAchTransactionService,
  ) { }

  ngOnInit(): void {
    const { formValues } = this.parameterManagement.getParameter<ITMConsultACHDetailTransactionState>(PROTECTED_PARAMETER_STATE);
    const clientType = this.parameterManagement.getParameter('clientType');
    this.isShowSignatureBtn = clientType === 'J';

    const mappedVoucherByService = {
      [ETMACHService.ATOMIC]: () => this.buildViewForAtomicTransaction(),
      [ETMACHService.MULTIPLE_365]: () => this.buildViewForMultipleTransaction(),
      [ETMACHService.MULTIPLE_UNI]: () => this.buildViewForMultipleTransaction(),
    }

    const view = mappedVoucherByService[formValues.service];

    if (!view) return;
    view();
  }

  buildViewForAtomicTransaction() {
    const { transactionDetail, formValues } = this.parameterManagement.getParameter<ITMConsultACHDetailTransactionState>(PROTECTED_PARAMETER_STATE);

    const { pdfLayout, voucherLayout, modalLayout } = this.atomicVoucherService.buildVoucher({
      transaction: transactionDetail,
      typeService: formValues.service,
    });

    this.pdfLayout = pdfLayout;
    this.voucherLayout = voucherLayout;
    this.voucherModalLayout = modalLayout;
  }

  buildViewForMultipleTransaction() {
    const { transactionDetail, formValues } = this.parameterManagement.getParameter<ITMConsultACHDetailTransactionState>(PROTECTED_PARAMETER_STATE);

    const { service } = formValues;

    if (service === 'MUNI') {
      this.title = 'tm-ach-uni:subtitle_detail_transaction'
    }

    if (service === 'M365') {
      this.title = 'tm-ach-m365:subtitle_detail_transaction'
    }


    const { pdfLayout, voucherLayout, modalLayout } = this.multipleVoucherService.buildVoucher({
      transaction: transactionDetail,
      typeService: formValues.service,
    });

    this.pdfLayout = pdfLayout;
    this.voucherLayout = voucherLayout;
    this.voucherModalLayout = modalLayout;
  }

  previous() {
    const { from , formValues } = this.parameterManagement.getParameter<ITMConsultACHDetailTransactionState>(PROTECTED_PARAMETER_STATE);
    const isAtomic = from === ETMConsultACHView.ATOMIC;
    this.utils.showLoader();

    if  (isAtomic) {
      this.parameterManagement.sendParameters({
        [PROTECTED_PARAMETER_STATE]: {
          formValues,
        },
        [PROTECTED_PARAMETER_ROUTE]: AdminPanelProvidersProtectedParameters.LOOK_UP_ATOMIC,
      });

      this.router.navigate([ETMConsultACHUrlCollection.CONSULT_ATOMIC]).finally(() => {});
      return;
    }



    const { transactionDetail, ...rest } = this.parameterManagement.getParameter<ITMConsultACHDetailTransactionState>(PROTECTED_PARAMETER_STATE);

    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        ...rest,
      },
      [PROTECTED_PARAMETER_ROUTE]: AdminPanelProvidersProtectedParameters.LOTE,
    });

    this.router.navigate([ETMConsultACHUrlCollection.LOTE]).finally(() => {});

  }

  print() {
    this.openProofModal();
  }

  getSignatureDetail() {
    this.showAlert('error', 'consult_ach:label_not_signatures');
    this.utils.scrollToTop();
    setTimeout(() => {
      this.messageAlert = '';
      this.typeAlert = '';
    }, 10000)
    return;
  }

  manageGetSignatureListByTransfer() {
    const { transferenceId } = this.parameterManagement.getParameter<ITMConsultACHDetailTransactionState>(PROTECTED_PARAMETER_STATE);

    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');
    this.utils.showLoader();
    this.transactionService.getSignatoryByTransaction(userInfo.customerCode, transferenceId).subscribe({
      next: (value) => {
        const state = this.parameterManagement.getParameter<ITMConsultACHDetailTransactionState>(PROTECTED_PARAMETER_STATE);

        this.parameterManagement.sendParameters({
          [PROTECTED_PARAMETER_STATE]: {
            ...state,
            listSignatories: value,
          } as ITMConsultACHSignatoryListState,
          [PROTECTED_PARAMETER_ROUTE]: AdminPanelProvidersProtectedParameters.SIGNATURES,
        });
        this.router.navigate([ETMConsultACHUrlCollection.SIGNATORIES]).finally(() => this.utils.hideLoader());
      },
      error: (error: HttpErrorResponse) => {
        this.utils.hideLoader();
        this.utils.scrollToTop();
        this.showAlert('error', error?.error?.message ?? 'error:st-missing-connection');
      }
    })
  }

  openProofModal(): void {
    const modal = this.modalService.open(AdfConfirmationModalComponent, {
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'} voucher-modal voucher-modal-bisv t365 tm-ach`,
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

    this.pdfService.pdfGenerate(
      account,
      reference,
      fileName,
      268,
      title,
      items,
      true
    );
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

}
