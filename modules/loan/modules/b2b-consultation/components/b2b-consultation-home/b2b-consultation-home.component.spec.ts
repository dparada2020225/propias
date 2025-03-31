import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfFormBuilderService } from '@adf/components';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { B2bConsultationPrintService } from 'src/app/modules/loan/prints/b2b-consultation-print.service';
import { CustomNumberPipe } from 'src/app/pipes/custom-number.pipe';
import { UtilService } from 'src/app/service/common/util.service';
import { ValidationTriggerTimeService } from 'src/app/service/common/validation-trigger-time.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { iB2bConsultationAccountsMock, iB2bConsultationDetailMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { mockModal } from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import { MockTranslatePipe } from 'src/assets/mocks/public/tranlatePipeMock';
import { clickElement, mockObservable, mockObservableError, mockPromise } from 'src/assets/testing';
import { B2bdConsultManagerService } from '../../service/definition/b2bd-consult-manager.service';
import { B2bConsultationTransactionService } from '../../service/transaction/b2b-consultation-transaction.service';
import { B2bConsultationHomeComponent } from './b2b-consultation-home.component';

describe('B2bConsultationHomeComponent', () => {
  let component: B2bConsultationHomeComponent;
  let fixture: ComponentFixture<B2bConsultationHomeComponent>;

  let managerDefinition: jasmine.SpyObj<B2bdConsultManagerService>;
  let adfFormBuilder: jasmine.SpyObj<AdfFormBuilderService>;
  let transactionService: jasmine.SpyObj<B2bConsultationTransactionService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let router: jasmine.SpyObj<Router>;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup

  beforeEach(async () => {

    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter'])
    const managerDefinitionSpy = jasmine.createSpyObj('B2bdConsultManagerService', ['buildFormLayout', 'buildVoucherLayout', 'buildPdfLayout', 'buildModalLayout'])
    const adfFormBuilderSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition'])
    const transactionServiceSpy = jasmine.createSpyObj('B2bConsultationTransactionService', ['b2bDetail'])
    const pdfServiceSpy = jasmine.createSpyObj('B2bConsultationPrintService', ['pdfGenerate'])
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const validationTriggerTimeSpy = jasmine.createSpyObj('ValidationTriggerTimeService', ['validate', 'isAvailableSchedule', 'openModal'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['showLoader', 'hideLoader'])

    await TestBed.configureTestingModule({
      declarations: [B2bConsultationHomeComponent, MockTranslatePipe, CustomNumberPipe],
      providers: [
        { provide: ParameterManagementService, useValue: parameterManagementSpy },
        { provide: B2bdConsultManagerService, useValue: managerDefinitionSpy },
        { provide: AdfFormBuilderService, useValue: adfFormBuilderSpy },
        { provide: B2bConsultationTransactionService, useValue: transactionServiceSpy },
        { provide: B2bConsultationPrintService, useValue: pdfServiceSpy },
        { provide: TranslateService, useValue: translateSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ValidationTriggerTimeService, useValue: validationTriggerTimeSpy },
        { provide: UtilService, useValue: utilsSpy },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              data: {
                scheduleService: {
                  isSchedule: true,
                  schedule: {
                    initialDate: 2022,
                    finalDate: 2030
                  }
                },
                b2bAccountList: [iB2bConsultationAccountsMock]
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

    fixture = TestBed.createComponent(B2bConsultationHomeComponent);
    component = fixture.componentInstance;

    managerDefinition = TestBed.inject(B2bdConsultManagerService) as jasmine.SpyObj<B2bdConsultManagerService>;
    adfFormBuilder = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    transactionService = TestBed.inject(B2bConsultationTransactionService) as jasmine.SpyObj<B2bConsultationTransactionService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    formBuilder = TestBed.inject(FormBuilder);

    managerDefinition.buildFormLayout.and.returnValue({
      attributes: []
    } as any);

    formGroup = formBuilder.group({
      b2bAccount: ['', [Validators.required]]
    })

    adfFormBuilder.formDefinition.and.returnValue(formGroup)

    transactionService.b2bDetail.and.returnValue(mockObservable(iB2bConsultationDetailMock))

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shoulg go to the next step', () => {
    modalService.open.and.returnValue(mockModal as NgbModalRef)
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    expect(modalService.open).toHaveBeenCalled();
  })

  it('should go to the last Step', () => {
    router.navigate.and.returnValue(mockPromise(true))
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['home'])
  })

  it('should change B2b Account Selected but service failed', () => {
    const account: string = '5413046540'
    transactionService.b2bDetail.and.returnValue(mockObservableError({
      error: { message: 'NOT FOUND' }
    }))
    component.changeB2bAccountSelected(account)
    expect(component.hasDetailAccountError).toBeTruthy();
    expect(component.messageAlert).toEqual('NOT FOUND')
    expect(component.typeAlert).toEqual('error')
  })

  it('should hidden alert', () => {
    component.hiddenAlert();
    expect(component.typeAlert).toEqual('')
    expect(component.messageAlert).toEqual('')
  })

});
