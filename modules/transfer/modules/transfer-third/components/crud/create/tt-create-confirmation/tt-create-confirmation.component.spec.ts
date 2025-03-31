import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {AdfButtonComponent, AdfFormBuilderService, AdfFormLayoutComponent, AdfInputComponent} from '@adf/components';
import {Location} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {
  iCrateAccountThirdTransferResponseMock,
  iGetThirdTransferResponseMock
} from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';
import {TTDCRUDManagerService} from '../../../../services/definition/crud/manager/ttd-crud-manager.service';
import {TransferThirdService} from '../../../../services/transaction/transfer-third.service';
import {TtCreateConfirmationComponent} from './tt-create-confirmation.component';
import {HandleTokenRequestService} from "../../../../../../../../service/common/handle-token-request.service";
import {UtilTransactionService} from "../../../../../../../../service/common/util-transaction.service";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {clickElement, mockObservable, mockPromise} from "../../../../../../../../../assets/testing";
import {EThirdCrudUrlNavigationCollection} from "../../../../enums/third-transfer-navigate-parameters.enum";
import {
  mockModal
} from "../../../../../../../../../assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock";


describe('TtCreateConfirmationComponent', () => {
    let component: TtCreateConfirmationComponent;
    let fixture: ComponentFixture<TtCreateConfirmationComponent>;

    let router: jasmine.SpyObj<Router>;
    let location: jasmine.SpyObj<Location>;
    let crudServiceManager: jasmine.SpyObj<TTDCRUDManagerService>;
    let crudFormBuilder: jasmine.SpyObj<AdfFormBuilderService>;
    let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
    let transferThirdService: jasmine.SpyObj<TransferThirdService>;
    let util: jasmine.SpyObj<UtilService>;
    let handleTokenRequestService: jasmine.SpyObj<HandleTokenRequestService>;
    let utilsTransaction: jasmine.SpyObj<UtilTransactionService>;
    let modalService: jasmine.SpyObj<NgbModal>;
    let formBuilder: FormBuilder;
    let formGroup: FormGroup;

    beforeEach(async () => {

        const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
        const locationSpy = jasmine.createSpyObj('Location', ['back'])
        const crudServiceManagerSpy = jasmine.createSpyObj('TTDCRUDManagerService', ['buildCreateAccountLayoutTTC'])
        const crudFormBuilderSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition'])
        const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters'])
        const transferThirdServiceSpy = jasmine.createSpyObj('TransferThirdService', ['associateAccount'])
        const utilSpy = jasmine.createSpyObj('UtilService', ['showLoader', 'scrollToTop', 'getProductName', 'getISOCurrency', 'hideLoader', 'getLabelCurrency'])
        const handleTokenRequestServiceSpy = jasmine.createSpyObj('HandleTokenRequestService', ['isTokenRequired'])
        const utilsTransactionSpy = jasmine.createSpyObj('UtilTransactionService', ['handleErrorTransaction', 'handleResponseTransaction'])
        const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])

        await TestBed.configureTestingModule({
            declarations: [TtCreateConfirmationComponent, AdfButtonComponent, AdfFormLayoutComponent, AdfInputComponent, AdfFormLayoutComponent],
            providers: [
                TtCreateConfirmationComponent,
                {provide: Router, useValue: routerSpy},
                {provide: Location, useValue: locationSpy},
                {provide: TTDCRUDManagerService, useValue: crudServiceManagerSpy},
                {provide: AdfFormBuilderService, useValue: crudFormBuilderSpy},
                {provide: ParameterManagementService, useValue: parameterManagementSpy},
                {provide: TransferThirdService, useValue: transferThirdServiceSpy},
                {provide: UtilService, useValue: utilSpy},
                {provide: HandleTokenRequestService, useValue: handleTokenRequestServiceSpy},
                {provide: UtilTransactionService, useValue: utilsTransactionSpy},
                {provide: NgbModal, useValue: modalServiceSpy},
            ],
            imports: [
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader,
                    },
                }),
                ReactiveFormsModule,
                FormsModule
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TtCreateConfirmationComponent);
        component = fixture.componentInstance;

        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
        crudServiceManager = TestBed.inject(TTDCRUDManagerService) as jasmine.SpyObj<TTDCRUDManagerService>;
        crudFormBuilder = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
        parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
        transferThirdService = TestBed.inject(TransferThirdService) as jasmine.SpyObj<TransferThirdService>;
        util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
        handleTokenRequestService = TestBed.inject(HandleTokenRequestService) as jasmine.SpyObj<HandleTokenRequestService>;
        utilsTransaction = TestBed.inject(UtilTransactionService) as jasmine.SpyObj<UtilTransactionService>;
        modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
        formBuilder = TestBed.inject(FormBuilder);


        util.getLabelCurrency.and.returnValue('USD')
        parameterManagement.getParameter.and.returnValue(iGetThirdTransferResponseMock)
        crudServiceManager.buildCreateAccountLayoutTTC.and.returnValue({
            attributes: [],
            class: 'form-control',
            subtitle: 'Create Account',
            title: 'Transfer'
        })

        formGroup = formBuilder.group({
            alias: ['', [Validators.required]],
            email: ['', [Validators.required]],
        });

        crudFormBuilder.formDefinition.and.returnValue(formGroup);
        router.navigate.and.returnValue(mockPromise(true))
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(parameterManagement.getParameter).toHaveBeenCalled();
        expect(crudServiceManager.buildCreateAccountLayoutTTC).toHaveBeenCalled();
        expect(crudFormBuilder.formDefinition).toHaveBeenCalled();
    });

    it('should click second button go to back', () => {
        const button = fixture.debugElement.query(By.css('adf-button.secondary'));
        button.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(location.back).toHaveBeenCalled();
        expect(parameterManagement.sendParameters).toHaveBeenCalledWith({
            navigationProtectedParameter: null,
            navigateStateParameters: null,
        })
    })

    it('should hidden alert', () => {
        component.hiddenAlert();
        expect(component.typeAlert).toBeNull()
        expect(component.messageAlert).toBeNull()
    })


    it('should go to the next step but form is not valid', () => {
        clickElement(fixture, 'adf-button.primary');
        fixture.detectChanges();

        expect(component.form.valid).toBeFalsy()
    })

    it('should go to the next step with token not requiered', fakeAsync(() => {

        component.form.patchValue({
            alias: 'test',
            email: 'test@test.com'
        })
        handleTokenRequestService.isTokenRequired.and.returnValue(false);
        transferThirdService.associateAccount.and.returnValue(mockObservable(iCrateAccountThirdTransferResponseMock))
        utilsTransaction.handleResponseTransaction.and.returnValue({
            message: 'success',
            status: 200,
            data: {...iCrateAccountThirdTransferResponseMock}
        })
        fixture.detectChanges();

        clickElement(fixture, 'adf-button.primary');
        fixture.detectChanges();
        tick();

        expect(router.navigate).toHaveBeenCalledWith([EThirdCrudUrlNavigationCollection.CREATE_VOUCHER])
    }))

    xit('should go to the next step with token requiered', fakeAsync(() => {

        component.form.patchValue({
            alias: 'test',
            email: 'test@test.com'
        })
        handleTokenRequestService.isTokenRequired.and.returnValue(true);
        modalService.open.and.returnValue(mockModal as NgbModalRef)
        fixture.detectChanges();

        clickElement(fixture, 'adf-button.primary');
        fixture.detectChanges();
        tick();

        expect(component.isAccountCancelled).toBeTruthy();
    }))

});
