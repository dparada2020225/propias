import {Component, OnInit} from '@angular/core';
import {
    ICrateAccountThirdTransferResponse,
    IGetThirdTransferResponse,
    TThirdTransferAddAccount
} from '../../../../interfaces/third-transfer-service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {TTDCRUDManagerService} from '../../../../services/definition/crud/manager/ttd-crud-manager.service';
import {AdfFormBuilderService, ILayout} from '@adf/components';
import {FormGroup} from '@angular/forms';
import {CreateThirdBuilder} from '../../../../interfaces/crud/create-third-interface';
import {TransferThirdService} from '../../../../services/transaction/transfer-third.service';
import {IThirdTransferCreateState} from '../../../../interfaces/third-transfer-persistence.interface';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {UtilService} from 'src/app/service/common/util.service';
import {
    EThirdCrudUrlNavigationCollection,
    EThirdTransferNavigateParameters
} from '../../../../enums/third-transfer-navigate-parameters.enum';
import {EProfile} from 'src/app/enums/profile.enum';
import {environment} from 'src/environments/environment';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UtilTransactionService} from '../../../../../../../../service/common/util-transaction.service';
import {HandleTokenRequestService} from '../../../../../../../../service/common/handle-token-request.service';
import {ModalTokenComponent} from '../../../../../../../../view/private/token/modal-token/modal-token.component';
import {ERequestTypeTransaction} from '../../../../../../../../enums/transaction-header.enum';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs';
import {HttpStatusCode} from '../../../../../../../../enums/http-status-code.enum';

@Component({
    selector: 'byte-tt-create-confirmation',
    templateUrl: './tt-create-confirmation.component.html',
    styleUrls: ['./tt-create-confirmation.component.scss'],
})
export class TtCreateConfirmationComponent implements OnInit {
    typeAlert: string | null = null;
    messageAlert: string | null = null;

    formLayout!: ILayout;
    form!: FormGroup;

    accountToAdd!: IGetThirdTransferResponse;

    typeProfile: string = EProfile.SALVADOR;
    profile: string = environment.profile;
    isAccountCancelled: boolean = false;

    get isDisabledButton(): boolean {
        return this.isAccountCancelled;
    }

    get customShow() {
        return this.typeAlert && this.messageAlert ? 'custom_show' : '';
    }

    get classNameLayout(): string {
        const className = {
            [EProfile.SALVADOR]: 'layout-bisv'
        }
        return className[this.profile] || '';
    }

    get classNameButtons(): string {
        const className = {
            [EProfile.SALVADOR]: 'no-line_sv hover_button-primary-sv buttons-sv'
        }

        return className[this.profile] || '';
    }

    constructor(
        private router: Router,
        private location: Location,
        private crudServiceManager: TTDCRUDManagerService,
        private crudFormBuilder: AdfFormBuilderService,
        private parameterManagement: ParameterManagementService,
        private transferThirdService: TransferThirdService,
        private util: UtilService,
        private handleTokenRequestService: HandleTokenRequestService,
        private utilsTransaction: UtilTransactionService,
        private modalService: NgbModal,
    ) {
    }

    ngOnInit(): void {
        this.accountToAdd = this.parameterManagement.getParameter('navigateStateParameters');
        this.initDefinition();
    }

    initDefinition() {
        this.formLayout = this.crudServiceManager.buildCreateAccountLayoutTTC(this.accountToAdd);
        this.form = this.crudFormBuilder.formDefinition(this.formLayout.attributes);
    }


    nextStep() {
        if (!this.form?.valid) {
            this.form?.markAllAsTouched();
            return;
        }

        this.handleTokenRequest();
    }

    backStep() {
        this.location.back();
        this.resetStorage();
    }

    handleTokenRequest() {
        if (this.handleTokenRequestService.isTokenRequired()) {
            this.tokenModal();
            return;
        }

        this.execute().subscribe({
            next: (response) => this.handleTransactionResponse(response),
        })
    }

    tokenModal() {
        const modal = this.modalService.open(ModalTokenComponent, {
            centered: true,
            windowClass: `${environment.profile || 'byte-theme'} sm-600`,
            size: 'lg',
        });

        modal.componentInstance.typeTransaction = ERequestTypeTransaction.AUTHENTICATION;
        modal.componentInstance.executeService = this.execute.bind(this);

        modal.dismissed.subscribe(() => {
            return;
        });

        modal.result
            .then((result) => {
                if (!result) {
                    return;
                }

                this.handleTransactionResponse(result);
            })
            .catch((error) => error);
    }

    execute(token?: string) {
        this.util.showLoader();

        return this.transferThirdService.associateAccount({
            bodyRequest: this.getThirdAccount(),
            isTokenRequired: this.handleTokenRequestService.isTokenRequired(),
            token,
        })
            .pipe(
                map((response) => this.utilsTransaction.handleResponseTransaction<ICrateAccountThirdTransferResponse>(response)),
                catchError((error) => of(this.utilsTransaction.handleErrorTransaction(error)))
            );
    }

    handleTransactionResponse(response: TThirdTransferAddAccount) {
        if (response.status === HttpStatusCode.INVALID_TOKEN) {
            this.util.hideLoader();
            return;
        }

        if (response.status !== HttpStatusCode.SUCCESS_TRANSACTION) {
            this.isAccountCancelled = !this.isAccountCancelled;
            this.util.hideLoader();
            this.util.scrollToTop();
            this.showAlert('error', response?.message as string || 'fatal-error:timeout');
            return;
        }

        this.parameterManagement.sendParameters({
            navigationProtectedParameter: EThirdTransferNavigateParameters.CRUD_CREATE_VOUCHER,
            navigateStateParameters: {
                accountToAdd: this.accountToAdd,
                transactionResponse: response.data,
                currentAccount: this.getThirdAccount(),
                formValues: this.form?.value,
            } as IThirdTransferCreateState,
        });

        this.router.navigate([EThirdCrudUrlNavigationCollection.CREATE_VOUCHER]).finally(() => this.util.hideLoader());
    }

    getThirdAccount() {
        const account = this.accountToAdd;

        return new CreateThirdBuilder()
            .account(account?.account ?? '')
            .currency(this.util.getISOCurrency(account?.currency ?? ''))
            .alias(this.form?.getRawValue().alias ?? '')
            .type(this.util.getProductName(parseInt(account?.productType ?? '0')))
            .email(String(this.form.getRawValue().email).toLowerCase() ?? '')
            .build();
    }

    resetStorage() {
        this.parameterManagement.sendParameters({
            navigationProtectedParameter: null,
            navigateStateParameters: null,
        });
    }

    showAlert(type: string, message: string) {
        this.typeAlert = type;
        this.messageAlert = message;
    }

    hiddenAlert() {
        this.typeAlert = null;
        this.messageAlert = null;
    }
}
