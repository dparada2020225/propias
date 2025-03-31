import { Injectable } from '@angular/core';
import { concatMap, Subject } from 'rxjs';
import { UtilService } from '../../../../../../../service/common/util.service';
import { Router } from '@angular/router';
import { ThirdPartyLoansService } from '../../transaction/third-party-loans.service';
import {
  ParameterManagementService
} from '../../../../../../../service/navegation-parameters/parameter-management.service';
import { TpldTableManagerService } from '../../definition/table/tpld-table-manager.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  IConfirmationData,
  IConsultDetailTPL, ILoansResponse,
  IThirdPartyLoanAssociate
} from '../../../interfaces/crud/crud-third-party-loans-interface';
import { ITPLAccountsBodyRequest } from '../../../interfaces/third-party-loans.interface';
import {
  ENavigateProtectionParameter,
  EPaymentLoansFlowView, ETPLPaymentCRUDUrlNavigationCollection,
  ETPLPaymentUrlNavigationCollection
} from '../../../enum/navigate-protection-parameter.enum';
import { environment } from '../../../../../../../../environments/environment';
import { AdfAlertModalComponent, ILoadItem } from '@adf/components';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TpleThirdPartyLoansService {

  private message$: Subject<string> = new Subject();

  get messageAlert() {
    return this.message$.asObservable();
  }


  constructor(
    private utils: UtilService,
    private tplThirdPartyService: ThirdPartyLoansService,
    private parameterManagementService: ParameterManagementService,
    private router: Router,
    private tableManagerService: TpldTableManagerService,
    private modalService: NgbModal,
  ) { }

  parseThirdPartyLoans(loanList: IThirdPartyLoanAssociate[]) {
    return loanList.map((loan) => ({
      ...loan,
      currencyCode: this.utils.getCurrencySymbolToIso(loan?.currencyCode ?? 'UNDEFINED'),
    }));
  }

  getThirdPartyLoans(parameters: ITPLAccountsBodyRequest) {
    return this.tplThirdPartyService.getThirdPartyLoansAccount(parameters)
  }


  /* ==================================== TABLE ACTIONS ==============================*/
  gotToPayment(loanTransaction: IThirdPartyLoanAssociate, view: EPaymentLoansFlowView) {
    const paramsToPaymentDetail = {
      navigateStateParameters: {
        loanToPayment: loanTransaction,
        view,
      },
      navigationProtectedParameter: ENavigateProtectionParameter.PAYMENT,
    };

    this.parameterManagementService.sendParameters(paramsToPaymentDetail);
    this.router.navigate([ETPLPaymentUrlNavigationCollection.HOME_TRANSACTION]).then(() => {});
  }


  handleUpdateThirdPartyLoan(selectAccount: IThirdPartyLoanAssociate, view: EPaymentLoansFlowView) {
    this.utils.showLoader();

    this.parameterManagementService.sendParameters({
      navigateStateParameters: {
        ...selectAccount,
        view,
      },
      navigationProtectedParameter: ENavigateProtectionParameter.UPDATE,
    });

    this.router.navigate([ETPLPaymentCRUDUrlNavigationCollection.UPDATE_HOME]).then(() => {});
  }

  openDeleteModal(selectedLoan: ILoadItem<IThirdPartyLoanAssociate>, view: EPaymentLoansFlowView) {
    const modal = this.modalService.open(AdfAlertModalComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} alert-modal`,
      size: `lg`,
    });

    modal.componentInstance.data = this.tableManagerService.buildDeleteAlert();


    modal.result.then((isResult)  => {
      if (!isResult) { return; }

      this.handleDelete(selectedLoan, view);
    });
  }

  private handleDeleteThirdPartyLoan(selectedLoan: ILoadItem<IThirdPartyLoanAssociate>) {
    const idLoan = `${selectedLoan.item.identifier}`;
    let detailLoan: IConsultDetailTPL;

    return this.getDetailLoan(selectedLoan.item)
      .pipe(
        concatMap((detailResponse) => {
          detailLoan = detailResponse;
          return this.deleteLoan(selectedLoan.item);
        }),
        map((response) => this.buildDeleteResponse(detailLoan, idLoan, response)),
      );

  }

  private handleDelete(selectedLoan: ILoadItem<IThirdPartyLoanAssociate>, view: EPaymentLoansFlowView) {
    this.utils.showLoader();

    this.handleDeleteThirdPartyLoan(selectedLoan)
      .subscribe({
        next: (response) => {
          const { data, reference, dateTime } = response ?? {};
          const dataResponse: IConfirmationData = {
            reference,
            dateTime,
            action: 'delete',
            message: 'loan_elimination_successfully',
            data: data,
          };

          this.parameterManagementService.sendParameters({
            navigateStateParameters: {
              ...dataResponse,
              view,
            },
            navigationProtectedParameter: ENavigateProtectionParameter.CONFIRMATION,
          });
          this.router.navigate([ETPLPaymentUrlNavigationCollection.DEFAULT_CONFIRMATION]).then(() => {});
        },
        error: (error: HttpErrorResponse) => {
          this.message$.next(error?.error?.message ?? 'error:getting_detail_loan');
          this.utils.hideLoader();
        },
      })

  }

  private getDetailLoan(selectedLoan: IThirdPartyLoanAssociate) {
    return this.tplThirdPartyService.consultDetail({
      identifier: `${selectedLoan?.identifier}`,
    });
  }

  private deleteLoan(selectedLoan: IThirdPartyLoanAssociate) {
    return this.tplThirdPartyService.deleteLoan({
      identifier: `${selectedLoan.identifier}`,
    });
  }

  private buildDeleteResponse(detailLoan: IConsultDetailTPL, loanId: string, deleteLoanResponse: ILoansResponse) {
    const dataDeleteConfirmation = {
      identifier: loanId,
      currency: detailLoan.currency,
      type: detailLoan.type,
      alias: detailLoan.alias,
      loanName: detailLoan.loanName,
      email: detailLoan.email,
      status: detailLoan.status,
    };

    return {
      data: dataDeleteConfirmation,
      reference: deleteLoanResponse.reference,
      dateTime: deleteLoanResponse.dateTime,
    }
  }
}
