import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AdfButtonComponent, AdfFormBuilderService, AdfFormatService } from '@adf/components';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { IIsSchedule } from 'src/app/models/isSchedule.interface';
import { UtilService } from 'src/app/service/common/util.service';
import { ValidationTriggerTimeService } from 'src/app/service/common/validation-trigger-time.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { iB2bRequestBodyMock, iB2bRequestConfigMock, iB2bRequestResponseMock, iFixedDeadlinesMock, iThirdTransactionSuccessResponseMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { iAccount } from 'src/assets/mocks/modules/signature-tracking/mocksDetailTransaction';
import { mockModal } from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import { MockTranslatePipe } from 'src/assets/mocks/public/tranlatePipeMock';
import { clickElement, mockObservable, mockPromise } from 'src/assets/testing';
import { AttributeB2BRequest } from '../../enum/b2b-request-control-name.enum';
import { B2bRequestNavigateProtectedParameter } from '../../enum/b2b-request-navigate-protected-parameter.enum';
import { EB2bRequestView } from '../../enum/b2b-request-view.enum';
import { IB2bRequestStateDefault } from '../../interfaces/b2b-request-state.interface';
import { B2bdManagerService } from '../../service/definition/b2bd-manager.service';
import { B2bRequestService } from '../../service/transaction/b2b-request.service';
import { B2bRequestHomeComponent } from './b2b-request-home.component';

describe('B2bRequestHomeComponent', () => {
  let component: B2bRequestHomeComponent;
  let fixture: ComponentFixture<B2bRequestHomeComponent>;

  let b2bManagerDefinition: jasmine.SpyObj<B2bdManagerService>;
  let router: jasmine.SpyObj<Router>;
  let formBuilder: jasmine.SpyObj<AdfFormBuilderService>;
  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let b2bRequestService: jasmine.SpyObj<B2bRequestService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let utils: jasmine.SpyObj<UtilService>;
  let formBuilderForm: FormBuilder;
  let formGroup: FormGroup<{
    [AttributeB2BRequest.WAY_PAY]: FormControl<string | null>,
    [AttributeB2BRequest.ACCOUNT_NUMBER]: FormControl<string | null>,
    [AttributeB2BRequest.FIXED_TERM]: FormControl<string | null>,
  }>

  beforeEach(async () => {

    const b2bManagerDefinitionSpy = jasmine.createSpyObj('B2bdManagerService', ['buildFormLayout', 'buildExecuteRequest'])
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const formBuilderSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition'])
    const adfFormatSpy = jasmine.createSpyObj('AdfFormatService', [''])
    const validationTriggerTimeSpy = jasmine.createSpyObj('ValidationTriggerTimeService', ['validate', 'isAvailableSchedule', 'openModal'])
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters', 'getParameter'])
    const b2bRequestServiceSpy = jasmine.createSpyObj('B2bRequestService', ['requestExecute'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['hideLoader', 'showLoader', 'showPulseLoader', 'hidePulseLoader', 'getTokenType', 'scrollToTop'])
    const data: IIsSchedule = {
      isSchedule: true,
      schedule: {
        initialDate: '2015',
        finalDate: '2030'
      }
    }


    await TestBed.configureTestingModule({
      declarations: [B2bRequestHomeComponent, AdfButtonComponent, MockTranslatePipe],
      providers: [
        { provide: B2bdManagerService, useValue: b2bManagerDefinitionSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AdfFormBuilderService, useValue: formBuilderSpy },
        { provide: AdfFormatService, useValue: adfFormatSpy },
        { provide: ValidationTriggerTimeService, useValue: validationTriggerTimeSpy },
        { provide: ParameterManagementService, useValue: parameterManagementSpy },
        { provide: B2bRequestService, useValue: b2bRequestServiceSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: UtilService, useValue: utilsSpy },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              data: {
                view: EB2bRequestView.DEFAULT,
                scheduleService: data,
                configuration: iB2bRequestConfigMock,
                fixedDeadlines: [iFixedDeadlinesMock],
                sourceAccounts: [iAccount],
                targetAccounts: [iAccount]
              }
            }
          }
        }
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

    fixture = TestBed.createComponent(B2bRequestHomeComponent);
    component = fixture.componentInstance;
    b2bManagerDefinition = TestBed.inject(B2bdManagerService) as jasmine.SpyObj<B2bdManagerService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    formBuilder = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    b2bRequestService = TestBed.inject(B2bRequestService) as jasmine.SpyObj<B2bRequestService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    formBuilderForm = TestBed.inject(FormBuilder);

    b2bManagerDefinition.buildExecuteRequest.and.returnValue(iB2bRequestBodyMock)

    formGroup = formBuilderForm.group({
      [AttributeB2BRequest.WAY_PAY]: ['', Validators.required],
      [AttributeB2BRequest.ACCOUNT_NUMBER]: ['', Validators.required],
      [AttributeB2BRequest.FIXED_TERM]: ['', Validators.required],
    })
    b2bManagerDefinition.buildFormLayout.and.returnValue({
      attributes: []
    } as any)
    formBuilder.formDefinition.and.returnValue(formGroup);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to the next step but form is not valid', () => {
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    expect(component.form.valid).toBeFalsy()
    expect(component.form.markAllAsTouched).toBeTruthy()
  })

  it('should go to the next step with token required = false', () => {
    router.navigate.and.returnValue(mockPromise(true));
    parameterManagement.getParameter.and.returnValue(false)
    spyOn(component, 'handleExecuteTransaction').and.returnValue(mockObservable(iThirdTransactionSuccessResponseMock))
    component.form.patchValue({
      accountCharged: '585155546',
      fixedTerm: 'fixedTerm'
    })
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    expect(parameterManagement.sendParameters).toHaveBeenCalledWith({
      navigationProtectedParameter: B2bRequestNavigateProtectedParameter.VOUCHER,
      navigateStateParameters: {
        formValues: component.form?.value,
        sourceAccountSelected: component.sourceAccountSelected,
        transactionResponse: iThirdTransactionSuccessResponseMock.data,
      } as IB2bRequestStateDefault,
    })
    expect(router.navigate).toHaveBeenCalledOnceWith(['/loan/request/voucher'])
  })

  it('should go to the next step with token required = TRUE', fakeAsync(() => {
    modalService.open.and.returnValue(mockModal as NgbModalRef)
    parameterManagement.getParameter.and.returnValue(true)
    component.form.patchValue({
      accountCharged: '585155546',
      fixedTerm: 'fixedTerm'
    })

    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    tick(4000)

    expect(utils.scrollToTop).toHaveBeenCalled();
    expect(component.typeAlert).toEqual('error')
  }))

  it('should return to the last Step', () => {
    router.navigate.and.returnValue(mockPromise(true))
    clickElement(fixture, 'adf-button.secondary')
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['home'])
  })

  it('should handle Execute Transaction', () => {
    parameterManagement.getParameter.and.returnValue(true)
    b2bRequestService.requestExecute.and.returnValue(mockObservable(iB2bRequestResponseMock))

    component.handleExecuteTransaction('ejkñdgs');

    expect(b2bManagerDefinition.buildExecuteRequest).toHaveBeenCalled();
    expect(b2bRequestService.requestExecute).toHaveBeenCalled();

  })

  it('should hidden Alert', () => {
    component.hiddenAlert();
    expect(component.typeAlert).toBeNull();
    expect(component.messageAlert).toBeNull();
  })

});
