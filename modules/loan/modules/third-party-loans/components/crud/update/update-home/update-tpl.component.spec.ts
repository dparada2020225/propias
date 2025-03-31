import { AdfButtonComponent, AdfFormBuilderService } from '@adf/components';
import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { iConsultDetailTPLMock, iLoansResponseMock, iThirdPartyLoanAssociateMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { mockModal } from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import { clickElement, mockObservable, mockObservableError, mockPromise } from 'src/assets/testing';
import { EPaymentLoansFlowView } from '../../../../enum/navigate-protection-parameter.enum';
import { AttributeFormThirdPartyLoansCrud } from '../../../../enum/third-party-loans-control-name.enum';
import { TplCrudManagerService } from '../../../../services/definition/crud/tpl-crud-manager.service';
import { TplUpdateService } from '../../../../services/definition/crud/update/tpl-update.service';
import { ThirdPartyLoansService } from '../../../../services/transaction/third-party-loans.service';
import { UpdateTplComponent } from './update-tpl.component';

describe('UpdateTplComponent', () => {
  let component: UpdateTplComponent;
  let fixture: ComponentFixture<UpdateTplComponent>;

  let createThirdPartyLoansManager: jasmine.SpyObj<TplCrudManagerService>;
  let tplFormBuilder: jasmine.SpyObj<AdfFormBuilderService>;
  let parametersService: jasmine.SpyObj<ParameterManagementService>;
  let crudTPLService: jasmine.SpyObj<ThirdPartyLoansService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;
  let router: Router;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup<{
    [AttributeFormThirdPartyLoansCrud.ALIAS]: FormControl<string | null>,
    [AttributeFormThirdPartyLoansCrud.EMAIL]: FormControl<string | null>,
  }>

  beforeEach(async () => {
    const createThirdPartyLoansManagerSpy = jasmine.createSpyObj('TplCrudManagerService', ['builderUpdateLoansForm'])
    const tplFormBuilderSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition'])
    const parametersServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters'])
    const crudTPLServiceSpy = jasmine.createSpyObj('ThirdPartyLoansService', ['consultDetail', 'updateAssociateNumberLoan'])
    const locationSpy = jasmine.createSpyObj('Location', [''])
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const updateServiceSpy = jasmine.createSpyObj('TplUpdateService', [''])
    const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['buildAlertToUpdate'])
    await TestBed.configureTestingModule({
      declarations: [UpdateTplComponent, AdfButtonComponent],
      providers: [
        { provide: TplCrudManagerService, useValue: createThirdPartyLoansManagerSpy },
        { provide: AdfFormBuilderService, useValue: tplFormBuilderSpy },
        { provide: ParameterManagementService, useValue: parametersServiceSpy },
        { provide: ThirdPartyLoansService, useValue: crudTPLServiceSpy },
        { provide: Location, useValue: locationSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: TplUpdateService, useValue: updateServiceSpy },
        { provide: UtilWorkFlowService, useValue: utilWorkFlowSpy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        ReactiveFormsModule,
        FormsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UpdateTplComponent);
    component = fixture.componentInstance;
    createThirdPartyLoansManager = TestBed.inject(TplCrudManagerService) as jasmine.SpyObj<TplCrudManagerService>;
    tplFormBuilder = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    parametersService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    crudTPLService = TestBed.inject(ThirdPartyLoansService) as jasmine.SpyObj<ThirdPartyLoansService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
    router = TestBed.inject(Router);
    formBuilder = TestBed.inject(FormBuilder);

    spyOn(router.events, 'subscribe').and.callFake((observer: any) => {
      observer.next({ navigationTrigger: 'popstate' } as any);
      return new Subscription();
    });

    parametersService.getParameter.and.returnValue(iThirdPartyLoanAssociateMock)

    crudTPLService.consultDetail.and.returnValue(mockObservable(iConsultDetailTPLMock))

    createThirdPartyLoansManager.builderUpdateLoansForm.and.returnValue({
      attributes: []
    } as any)

    formGroup = formBuilder.group({
      email: ['', Validators.required],
      alias: ['', Validators.required],
    })

    tplFormBuilder.formDefinition.and.returnValue(formGroup);
    component.updateForm = formGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update and go to the next step', fakeAsync(() => {
    modalService.open.and.returnValue(mockModal as NgbModalRef)
    crudTPLService.updateAssociateNumberLoan.and.returnValue(mockObservable(iLoansResponseMock));
    spyOn(router, 'navigate').and.returnValue(mockPromise(true))

    clickElement(fixture, 'adf-button.primary')
    fixture.detectChanges();
    tick();

    expect(utilWorkFlow.buildAlertToUpdate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/loan/third-party-loans/update-confirmation'])
  }))

  it('should go to back when view = EPaymentLoansFlowView.ALL_LOANS', fakeAsync(() => {
    spyOn(router, 'navigate').and.returnValue(mockPromise(true))
    parametersService.getParameter.and.returnValue({
      view: EPaymentLoansFlowView.ALL_LOANS
    });

    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();
    tick(4000)

    expect(router.navigate).toHaveBeenCalledWith(['/loan/third-party-loans/all'])
    expect(parametersService.sendParameters).toHaveBeenCalledWith({
      navigateStateParameters: null,
      navigationProtectedParameter: null,
    })
  }))

  it('should go to back when view is not EPaymentLoansFlowView.ALL_LOANS', fakeAsync(() => {
    spyOn(router, 'navigate').and.returnValue(mockPromise(true))
    parametersService.getParameter.and.returnValue({
      view: EPaymentLoansFlowView.THIRD_PARTY_LOANS
    });

    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();
    tick(4000)

    expect(router.navigate).toHaveBeenCalledWith(['/loan/third-party-loans'])
    expect(parametersService.sendParameters).toHaveBeenCalledWith({
      navigateStateParameters: null,
      navigationProtectedParameter: null,
    })
  }))

  it('should hidden Alert', () => {
    component.hiddenAlert();
    expect(component.typeAlert).toBeNull();
    expect(component.messageAlert).toBeNull();
  })

  it('should get Detail Loan have error', () => {
    crudTPLService.consultDetail.and.returnValue(mockObservableError({}))
    component.getDetailLoan();
    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual('error:update_third_party_loan')
  })

  it('should update but form not valid', () => {
    component.updateForm.reset();
    clickElement(fixture, 'adf-button.primary')
    fixture.detectChanges();
    expect(component.updateForm.valid).toBeFalsy();
    expect(component.updateForm.markAllAsTouched).toBeTruthy();
  })

});
