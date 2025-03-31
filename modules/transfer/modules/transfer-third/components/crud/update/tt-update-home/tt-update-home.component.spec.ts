import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {TtUpdateHomeComponent} from './tt-update-home.component';
import {AdfButtonComponent, AdfFormBuilderService} from '@adf/components';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {TTDCRUDManagerService} from '../../../../services/definition/crud/manager/ttd-crud-manager.service';
import {TransferThirdService} from '../../../../services/transaction/transfer-third.service';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {AttributeFormCrud} from "../../../../enums/third-transfer-control-name.enum";
import {
  clickElement,
  mockObservable,
  mockObservableError,
  mockPromise
} from "../../../../../../../../../assets/testing";
import {
  mockModal
} from "../../../../../../../../../assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock";
import {
  iThirdTransferTransactionResponseMock
} from "../../../../../../../../../assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock";
import {EProfile} from "../../../../../../../../enums/profile.enum";
import {EThirdTransferUrlNavigationCollection} from "../../../../enums/third-transfer-navigate-parameters.enum";
import {HandleTokenRequestService} from "../../../../../../../../service/common/handle-token-request.service";
import {UtilTransactionService} from "../../../../../../../../service/common/util-transaction.service";

describe('TtUpdateHomeComponent', () => {
  let component: TtUpdateHomeComponent;
  let fixture: ComponentFixture<TtUpdateHomeComponent>;

  let router: jasmine.SpyObj<Router>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let util: jasmine.SpyObj<UtilService>;
  let transferThirdService: jasmine.SpyObj<TransferThirdService>;
  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let crudServiceManager: jasmine.SpyObj<TTDCRUDManagerService>;
  let crudFormBuilder: jasmine.SpyObj<AdfFormBuilderService>;
  let handleTokenRequestService: jasmine.SpyObj<HandleTokenRequestService>;
  let utilsTransaction: jasmine.SpyObj<UtilTransactionService>;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup;

  beforeEach(async () => {

    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const utilSpy = jasmine.createSpyObj('UtilService', ['hideLoader', 'getISOCurrency', 'getProductName', 'showLoader'])
    const transferThirdServiceSpy = jasmine.createSpyObj('TransferThirdService', ['update'])
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters', 'getParameter'])
    const crudServiceManagerSpy = jasmine.createSpyObj('TTDCRUDManagerService', ['buildUpdateAlertTTU', 'buildUpdateAccountLayoutTTU'])
    const crudFormBuilderSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition'])
    const handleTokenRequestServiceSpy = jasmine.createSpyObj('HandleTokenRequestService', ['isTokenRequired'])
    const utilsTransactionSpy = jasmine.createSpyObj('UtilTransactionService', ['handleResponseTransaction', 'handleErrorTransaction'])

    await TestBed.configureTestingModule({
      declarations: [TtUpdateHomeComponent, AdfButtonComponent],
      providers: [
        TtUpdateHomeComponent,
        {provide: Router, useValue: routerSpy},
        {provide: NgbModal, useValue: modalServiceSpy},
        {provide: UtilService, useValue: utilSpy},
        {provide: TransferThirdService, useValue: transferThirdServiceSpy},
        {provide: ParameterManagementService, useValue: parameterManagementSpy},
        {provide: TTDCRUDManagerService, useValue: crudServiceManagerSpy},
        {provide: AdfFormBuilderService, useValue: crudFormBuilderSpy},
        {provide: HandleTokenRequestService, useValue: handleTokenRequestServiceSpy},
        {provide: UtilTransactionService, useValue: utilsTransactionSpy},
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        FormsModule,
        ReactiveFormsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TtUpdateHomeComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    transferThirdService = TestBed.inject(TransferThirdService) as jasmine.SpyObj<TransferThirdService>;
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    crudServiceManager = TestBed.inject(TTDCRUDManagerService) as jasmine.SpyObj<TTDCRUDManagerService>;
    crudFormBuilder = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    handleTokenRequestService = TestBed.inject(HandleTokenRequestService) as jasmine.SpyObj<HandleTokenRequestService>;
    utilsTransaction = TestBed.inject(UtilTransactionService) as jasmine.SpyObj<UtilTransactionService>;
    formBuilder = TestBed.inject(FormBuilder);

    formGroup = formBuilder.group({
      [AttributeFormCrud.ALIAS]: ['', [Validators.required]],
      [AttributeFormCrud.EMAIL]: ['', [Validators.required]],
    });

    crudServiceManager.buildUpdateAccountLayoutTTU.and.returnValue({
      attributes: []
    } as any);

    crudFormBuilder.formDefinition.and.returnValue(formGroup)

    router.navigate.and.returnValue(mockPromise(true));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to the next step but form is not valid', () => {
    clickElement(fixture, 'adf-button.primary')
    fixture.detectChanges();
    expect(component.form.valid).toBeFalsy();
    expect(component.form.markAllAsTouched).toBeTruthy();
  })

  it('should go to the next step with form valid and token no required', fakeAsync(() => {
    modalService.open.and.returnValue(mockModal as NgbModalRef)
    handleTokenRequestService.isTokenRequired.and.returnValue(false);

    transferThirdService.update.and.returnValue(mockObservable({}))
    utilsTransaction.handleResponseTransaction.and.returnValue({
      status: 200,
      message: 'Success',
      data: {
        body: {
          data: iThirdTransferTransactionResponseMock.dateTime,
          reference: iThirdTransferTransactionResponseMock.reference
        }
      }
    })
    component.form.patchValue({
      email: 'test@test.com',
      alias: 'alias'
    })
    fixture.detectChanges();

    clickElement(fixture, 'adf-button.primary')

    fixture.detectChanges();
    tick();

    expect(component.form.valid).toBeTruthy();
    expect(modalService.open).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/transfer/third/update-voucher'])
  }))

  it('should go to the next step with form valid and token is required but serfice response error', fakeAsync(() => {
    modalService.open.and.returnValue(mockModal as NgbModalRef)
    handleTokenRequestService.isTokenRequired.and.returnValue(true);

    component.form.patchValue({
      email: 'test@testerror.com',
      alias: 'aliaserror'
    })

    fixture.detectChanges();

    clickElement(fixture, 'adf-button.primary')

    fixture.detectChanges();
    tick();

    expect(component.form.valid).toBeTruthy();
    expect(modalService.open).toHaveBeenCalled();
    expect(component.typeAlert).toEqual('error')
    expect(component.messageAlert).toEqual('internal_server_error')
  }))

  it('should go to the next step with form valid but http response error', () => {
    modalService.open.and.returnValue(mockModal as NgbModalRef)
    transferThirdService.update.and.returnValue(mockObservableError({error: {message: 'Error http'}}));
    component.form.patchValue({
      email: 'test@test.com',
      alias: 'alias'
    })
    fixture.detectChanges();
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();

    expect(component.form.valid).toBeTruthy();
    expect(modalService.open).toHaveBeenCalled();
    expect(crudServiceManager.buildUpdateAlertTTU).toHaveBeenCalled();
  })

  it('should go back with profile SALVADOR', () => {
    component['profile'] = EProfile.SALVADOR as any;
    fixture.detectChanges();
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([EThirdTransferUrlNavigationCollection.HOMESV])
    expect(router.navigate).not.toHaveBeenCalledWith([EThirdTransferUrlNavigationCollection.HOME])
  })

  it('should go back with profile HONDURAS', () => {
    component['profile'] = EProfile.HONDURAS;
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();

    expect(router.navigate).not.toHaveBeenCalledWith([EThirdTransferUrlNavigationCollection.HOMESV])
    expect(router.navigate).toHaveBeenCalledWith([EThirdTransferUrlNavigationCollection.HOME])
  })

  it('should go back with profile PANAMA', () => {
    component['profile'] = EProfile.PANAMA;
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith([EThirdTransferUrlNavigationCollection.HOME])
  })

  it('should hiddenAlert', () => {
    component.hiddenAlert();
    expect(component.typeAlert).toBeNull()
    expect(component.messageAlert).toBeNull()
  })
});
