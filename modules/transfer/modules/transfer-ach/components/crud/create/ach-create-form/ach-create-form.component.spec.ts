import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AdfFormBuilderService } from '@adf/components';
import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { iCrudACHStorageStateMock, mockIACHSettings } from 'src/assets/mocks/modules/transfer/service/transfer-ach/ach.data.mock';
import { MockTranslatePipe } from 'src/assets/mocks/public/tranlatePipeMock';
import { clickElement, mockPromise } from 'src/assets/testing';
import { AttributeFormCrudAch, ECrudAchTypeClient } from '../../../../enum/ach-crud-control-name.enum';
import { EACHCrudUrlNavigationCollection } from '../../../../enum/navigation-parameter.enum';
import { AtdCrudManagerService } from '../../../../services/definition/crud/atd-crud-manager.service';
import { AchCreateFormComponent } from './ach-create-form.component';

describe('AchCreateFormComponent', () => {
  let component: AchCreateFormComponent;
  let fixture: ComponentFixture<AchCreateFormComponent>;

  let crudManagerDefinition: jasmine.SpyObj<AtdCrudManagerService>;
  let adfFormDefinition: jasmine.SpyObj<AdfFormBuilderService>;
  let location: jasmine.SpyObj<Location>;
  let persistStepStateService: jasmine.SpyObj<ParameterManagementService>;
  let router: jasmine.SpyObj<Router>;
  let util: jasmine.SpyObj<UtilService>;
  let translate: jasmine.SpyObj<TranslateService>;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup;

  beforeEach(async () => {
    const crudManagerDefinitionSpy = jasmine.createSpyObj('AtdCrudManagerService', [
      'buildCreateFormForLegalClient',
      'buildCreateFormForNaturalClient',
    ]);
    const adfFormDefinitionSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition']);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    const persistStepStateServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const utilSpy = jasmine.createSpyObj('UtilService', ['getLabelProduct', 'showLoader', 'hideLoader', 'getLabelCurrency']);
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);

    await TestBed.configureTestingModule({
      declarations: [AchCreateFormComponent, MockTranslatePipe],
      providers: [
        { provide: AtdCrudManagerService, useValue: crudManagerDefinitionSpy },
        { provide: AdfFormBuilderService, useValue: adfFormDefinitionSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ParameterManagementService, useValue: persistStepStateServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                settings: [mockIACHSettings],
              },
            },
          },
        },
        { provide: UtilService, useValue: utilSpy },
        { provide: TranslateService, useValue: translateSpy },
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
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AchCreateFormComponent);
    component = fixture.componentInstance;

    crudManagerDefinition = TestBed.inject(AtdCrudManagerService) as jasmine.SpyObj<AtdCrudManagerService>;
    adfFormDefinition = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    persistStepStateService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    formBuilder = TestBed.inject(FormBuilder);

    formGroup = formBuilder.group({
      alias: ['', [Validators.required]],
      bankName: '',
      numberAccount: '',
      email: ['', [Validators.required]],
      name: ['', [Validators.required]],
      [AttributeFormCrudAch.TYPE_CLIENT]: '',
      [AttributeFormCrudAch.IDENTIFY_BENEFICIARY]: '',
      [AttributeFormCrudAch.TYPE_ACCOUNT]: '',
      [AttributeFormCrudAch.CURRENCY]: '',
    });

    crudManagerDefinition.buildCreateFormForNaturalClient.and.returnValue({
      attributes: [],
    } as any);

    adfFormDefinition.formDefinition.and.returnValue(formGroup);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should savedCurrentState', fakeAsync(() => {
    persistStepStateService.getParameter.and.returnValue(iCrudACHStorageStateMock);

    component.savedCurrentState();
    tick(500);

    expect(component.form.get(AttributeFormCrudAch.IDENTIFY_BENEFICIARY)?.value).toEqual(
      iCrudACHStorageStateMock.formValues.identifyBeneficiary
    );
  }));

  it('should go to the next step and form is not valid', () => {
    component.form.reset();
    fixture.detectChanges();

    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();

    expect(component.form.markAllAsTouched).toBeTruthy();
  });

  it('should go to the next steP', () => {
    router.navigate.and.returnValue(mockPromise(true));
    component.form.patchValue({
      alias: 'alias',
      email: 'test@email.com',
      name: 'carlos',
    });
    fixture.detectChanges();

    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();

    expect(persistStepStateService.sendParameters).toHaveBeenCalledTimes(2);
    expect(router.navigate).toHaveBeenCalledWith([EACHCrudUrlNavigationCollection.CREATE_VOUCHER]);
  });

  it('should go to the last step', () => {
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();

    expect(location.back).toHaveBeenCalled();
    expect(persistStepStateService.sendParameters).toHaveBeenCalledWith({
      navigationProtectedParameter: null,
      achCrudState: null,
    });
  });

  it('should build initFormDefinition for legal client', () => {
    crudManagerDefinition.buildCreateFormForLegalClient.and.returnValue({
      attributes: [],
    } as any);

    component.currentTypeClient = ECrudAchTypeClient.LEGAL;
    component.initFormDefinition();

    expect(crudManagerDefinition.buildCreateFormForLegalClient).toHaveBeenCalled();
  });

  it('should sho error alert', () => {
    const message: string = 'message error';
    const type: string = 'error';

    component.showAlert(type, message);

    expect(component.typeAlert).toEqual(type);
    expect(component.messageAlert).toEqual(message);
  });
});
