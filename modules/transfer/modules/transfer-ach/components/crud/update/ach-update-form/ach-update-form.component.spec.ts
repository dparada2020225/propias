import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Location } from '@angular/common';

import { AdfFormBuilderService } from '@adf/components';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { iAchFormStorageLayoutMock } from 'src/assets/mocks/modules/transfer/service/transfer-ach/ach.data.mock';
import { clickElement, mockPromise } from 'src/assets/testing';
import { AttributeFormCrudAch, ECrudAchTypeClient } from '../../../../enum/ach-crud-control-name.enum';
import { EACHCrudUrlNavigationCollection } from '../../../../enum/navigation-parameter.enum';
import { EACHStatusAccount } from '../../../../enum/transfer-ach.enum';
import { AtdCrudManagerService } from '../../../../services/definition/crud/atd-crud-manager.service';
import { AtdTableManagerService } from '../../../../services/definition/table/atd-table-manager.service';
import { AchUpdateFormComponent } from './ach-update-form.component';

describe('AchUpdateFormComponent', () => {
  let component: AchUpdateFormComponent;
  let fixture: ComponentFixture<AchUpdateFormComponent>;
  let location: jasmine.SpyObj<Location>;
  let router: jasmine.SpyObj<Router>;
  let crudManagerDefinition: jasmine.SpyObj<AtdCrudManagerService>;
  let persistStepStateService: jasmine.SpyObj<ParameterManagementService>;
  let adfFormBuilder: jasmine.SpyObj<AdfFormBuilderService>;
  let tableManagerDefinition: jasmine.SpyObj<AtdTableManagerService>;
  let utils: jasmine.SpyObj<UtilService>;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup;

  beforeEach(async () => {
    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const crudManagerDefinitionSpy = jasmine.createSpyObj('AtdCrudManagerService', [
      'buildFormUpdateForLegalClient',
      'buildFormUpdateForNaturalClient',
    ]);
    const persistStepStateServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters', 'getParameter']);
    const adfFormBuilderSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition']);
    const tableManagerDefinitionSpy = jasmine.createSpyObj('AtdTableManagerService', ['buildModifyHistoryTable']);
    const utilsSpy = jasmine.createSpyObj('UtilService', ['showLoader', 'hideLoader']);

    await TestBed.configureTestingModule({
      declarations: [AchUpdateFormComponent],
      providers: [
        { provide: Location, useValue: locationSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AtdCrudManagerService, useValue: crudManagerDefinitionSpy },
        { provide: ParameterManagementService, useValue: persistStepStateServiceSpy },
        { provide: AdfFormBuilderService, useValue: adfFormBuilderSpy },
        { provide: AtdTableManagerService, useValue: tableManagerDefinitionSpy },
        { provide: UtilService, useValue: utilsSpy },
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

    fixture = TestBed.createComponent(AchUpdateFormComponent);
    component = fixture.componentInstance;

    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    crudManagerDefinition = TestBed.inject(AtdCrudManagerService) as jasmine.SpyObj<AtdCrudManagerService>;
    persistStepStateService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    adfFormBuilder = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    tableManagerDefinition = TestBed.inject(AtdTableManagerService) as jasmine.SpyObj<AtdTableManagerService>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    formBuilder = TestBed.inject(FormBuilder);

    formGroup = formBuilder.group({
      alias: ['', [Validators.required]],
      email: ['', [Validators.required]],
      name: ['', [Validators.required]],
      status: '',
      [AttributeFormCrudAch.IDENTIFY_BENEFICIARY]: '',
    });

    persistStepStateService.getParameter.and.returnValue(iAchFormStorageLayoutMock);
    crudManagerDefinition.buildFormUpdateForNaturalClient.and.returnValue({
      attributes: [],
    } as any);
    crudManagerDefinition.buildFormUpdateForLegalClient.and.returnValue({
      attributes: [],
    } as any);

    adfFormBuilder.formDefinition.and.returnValue(formGroup);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build form with client NATURAL', () => {
    const data = { ...iAchFormStorageLayoutMock };
    data.accountSelected!.clientType = ECrudAchTypeClient.NATURAL;
    persistStepStateService.getParameter.and.returnValue(data);
    component.initDefinition();
    expect(crudManagerDefinition.buildFormUpdateForNaturalClient).toHaveBeenCalled();
  });

  it('should build form with client LEGAL', () => {
    const data1 = { ...iAchFormStorageLayoutMock };
    data1.accountSelected!.clientType = ECrudAchTypeClient.LEGAL;
    persistStepStateService.getParameter.and.returnValue(data1);
    component.initDefinition();
    expect(crudManagerDefinition.buildFormUpdateForLegalClient).toHaveBeenCalled();
  });

  it('should setCurrentAccountValues', () => {
    const data = { ...iAchFormStorageLayoutMock };
    data.formValues = undefined as any;
    data.typeClient = ECrudAchTypeClient.NATURAL;

    persistStepStateService.getParameter.and.returnValue(data);

    component.setCurrentAccountValues();

    expect(component.form.get('alias')?.value).toEqual(component.accountSelected.alias);
    expect(component.form.get('email')?.value).toEqual(component.accountSelected.email);
    expect(component.form.get('name')?.value).toEqual(component.accountSelected.name);
    expect(component.form.get('status')?.value).toEqual(EACHStatusAccount[component.accountSelected?.status] || '');
  });

  it('should go to the next step but form is not valid', () => {
    component.form.reset();

    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();

    expect(component.form.markAllAsTouched).toBeTruthy();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should go to the next step', () => {
    router.navigate.and.returnValue(mockPromise(true));
    component.form.patchValue({
      alias: 'alias',
      email: 'email@test.com',
      name: 'name',
      status: '200',
    });

    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();

    expect(utils.showLoader).toHaveBeenCalled();
    expect(persistStepStateService.sendParameters).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith([EACHCrudUrlNavigationCollection.UPDATE_VOUCHER]);
  });

  it('should go to the last step', () => {
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();

    expect(location.back).toHaveBeenCalled();
    expect(persistStepStateService.sendParameters).toHaveBeenCalledWith({
      achUpdateForm: null,
      navigationProtectedParameter: null,
    });
  });
});
