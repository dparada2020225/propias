import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfFormBuilderService, AdfFormatService, AdfInputComponent } from '@adf/components';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { mockModal } from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import { MockTranslatePipe } from 'src/assets/mocks/public/tranlatePipeMock';
import { clickElement, mockObservable, mockObservableError, mockPromise } from 'src/assets/testing';
import { SpdFormLimitsService } from '../../services/definition/spd-form-limits.service';
import { SpdModalChangesService } from '../../services/definition/spd-modal-changes.service';
import { SpLimitsTransactionService } from '../../services/transaction/sp-limits-transaction.service';
import { SecurityLimitsComponent } from './security-limits.component';
describe('SecurityLimitsComponent', () => {
  let component: SecurityLimitsComponent;
  let fixture: ComponentFixture<SecurityLimitsComponent>;

  let modalService: jasmine.SpyObj<NgbModal>;
  let adfFormBuilder: jasmine.SpyObj<AdfFormBuilderService>;
  let formDefinition: jasmine.SpyObj<SpdFormLimitsService>;
  let router: jasmine.SpyObj<Router>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let adfFormat: jasmine.SpyObj<AdfFormatService>;
  let spLimits: jasmine.SpyObj<SpLimitsTransactionService>;
  let parameterManager: jasmine.SpyObj<ParameterManagementService>;

  beforeEach(async () => {

    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const modalChangesDefinitionSpy = jasmine.createSpyObj('SpdModalChangesService', ['buildAlertSuccessModifiedChanges'])
    const adfFormBuilderSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition'])
    const formDefinitionSpy = jasmine.createSpyObj('SpdFormLimitsService', ['builderFormDefinition'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant'])
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['hide', 'show'])
    const adfFormatSpy = jasmine.createSpyObj('AdfFormatService', ['getFormatDateTime'])
    const spLimitsSpy = jasmine.createSpyObj('SpLimitsTransactionService', ['setLimits'])
    const parameterManagerSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters'])

    await TestBed.configureTestingModule({
      declarations: [SecurityLimitsComponent, MockTranslatePipe, AdfInputComponent],
      providers: [
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: SpdModalChangesService, useValue: modalChangesDefinitionSpy },
        { provide: AdfFormBuilderService, useValue: adfFormBuilderSpy },
        { provide: SpdFormLimitsService, useValue: formDefinitionSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TranslateService, useValue: translateSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: AdfFormatService, useValue: adfFormatSpy },
        { provide: SpLimitsTransactionService, useValue: spLimitsSpy },
        { provide: ParameterManagementService, useValue: parameterManagerSpy },
        {
          provide: ActivatedRoute, useValue: {

            snapshot: {
              data: {
                currentLimits: [
                  {
                    dateLastUpdate: '20171212121212',
                    timeLastUpdate: '12:12:12'
                  }
                ]
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
        FormsModule,
        ReactiveFormsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SecurityLimitsComponent);
    component = fixture.componentInstance;

    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    adfFormBuilder = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    formDefinition = TestBed.inject(SpdFormLimitsService) as jasmine.SpyObj<SpdFormLimitsService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    adfFormat = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
    spLimits = TestBed.inject(SpLimitsTransactionService) as jasmine.SpyObj<SpLimitsTransactionService>;
    parameterManager = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    adfFormat.getFormatDateTime.and.returnValue({
      standard: '2023/12/20',
      hour: '12:12:12'
    } as any)
    modalService.open.and.returnValue(mockModal as NgbModalRef)
    formDefinition.builderFormDefinition.and.returnValue({
      attributes: []
    } as any)

    const formGroup = new FormGroup({
      amount_per_transaction: new FormControl('', Validators.required),
      amount_max_daily: new FormControl(),
      amount_max_monthly: new FormControl()
    });

    adfFormBuilder.formDefinition.and.returnValue(formGroup)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go back', () => {
    router.navigate.and.returnValue(mockPromise(true))
    clickElement(fixture, 'adf-button.secondary')
    fixture.detectChanges();
    expect(spinner.show).toHaveBeenCalled();
    expect(parameterManager.sendParameters).toHaveBeenCalledWith({
      parameterStateNavigation: null
    })
    expect(router.navigate).toHaveBeenCalledWith(['security-profile'])
    expect(spinner.hide).toHaveBeenCalled()
  })

  it('should set configuration limits but form is not valid', () => {
    component.form.reset()
    fixture.detectChanges();
    clickElement(fixture, 'adf-button.primary')
    fixture.detectChanges();
    expect(component.form.valid).toBeFalsy()
    expect(component.form.markAllAsTouched).toBeTruthy()
  })

  it('should set configuration limits', () => {
    spLimits.setLimits.and.returnValue(mockObservable({ response: true }))
    component.form.patchValue({
      amount_per_transaction: 4,
      amount_max_daily: 5,
      amount_max_monthly: 6,
    })
    fixture.detectChanges();
    clickElement(fixture, 'adf-button.primary')
    fixture.detectChanges();
    expect(modalService.open).toHaveBeenCalled();
    expect(spLimits.setLimits).toHaveBeenCalled();
  })

  it('should set configuration limits with error http', () => {
    spLimits.setLimits.and.returnValue(mockObservableError({ error: { code: 500, message: 'error http' } }))
    component.form.patchValue({
      amount_per_transaction: 4,
      amount_max_daily: 5,
      amount_max_monthly: 6,
    })
    fixture.detectChanges();
    clickElement(fixture, 'adf-button.primary')
    fixture.detectChanges();
    expect(spLimits.setLimits).toHaveBeenCalled();
    expect(component.typeAlert).toEqual('error')
    expect(component.messageAlert).toEqual('error http')
  })

});
