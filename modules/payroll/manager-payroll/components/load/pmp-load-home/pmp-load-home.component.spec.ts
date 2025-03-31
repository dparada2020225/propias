import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PmpLoadHomeComponent} from './pmp-load-home.component';
import {PmpldFormService} from "../../../services/definition/load/upload-file/pmpld-form.service";
import {AdfFormBuilderService} from "@adf/components";
import {PmpldTableService} from "../../../services/definition/load/upload-file/pmpld-table.service";
import {Router} from "@angular/router";
import {UtilService} from "../../../../../../service/common/util.service";
import {ParameterManagementService} from "../../../../../../service/navegation-parameters/parameter-management.service";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {MockTranslatePipe} from "../../../../../../../assets/mocks/public/tranlatePipeMock";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {SimplePaymentPayrollLoadFormAttributes} from "../../../enums/form-attributes.enum";
import {AdfRadioButtonComponent} from "../../adf-radio-button/adf-radio-button.component";
import {clickElement, mockPromise} from "../../../../../../../assets/testing";
import {SPPMRoutes} from "../../../enums/pmp-routes.enum";
import {PMP_TYPE_UPLOAD} from "../../../enums/pmp-file-structure.enum";

describe('SpplHomeComponent', () => {
  let component: PmpLoadHomeComponent;
  let fixture: ComponentFixture<PmpLoadHomeComponent>;

  let formDefinition: jasmine.SpyObj<PmpldFormService>;
  let adfFormBuilderService: jasmine.SpyObj<AdfFormBuilderService>;
  let tableDefinitionService: jasmine.SpyObj<PmpldTableService>;
  let router: jasmine.SpyObj<Router>;
  let utils: jasmine.SpyObj<UtilService>;
  let parameterManagerService: jasmine.SpyObj<ParameterManagementService>;

  let formBuilder: FormBuilder;
  let formGroup: FormGroup;

  beforeEach(async () => {

    const formDefinitionSpy = jasmine.createSpyObj('PmpldFormService', ['buildFormLayout'])
    const adfFormBuilderServiceSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition'])
    const tableDefinitionServiceSpy = jasmine.createSpyObj('PmpldTableService', ['buildExcelFieldTable', 'buildCsvFieldTable'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['scrollToTop', 'showLoader', 'hideLoader'])
    const parameterManagerServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters'])

    await TestBed.configureTestingModule({
      declarations: [ PmpLoadHomeComponent, MockTranslatePipe, AdfRadioButtonComponent ],
      providers: [
        { provide: PmpldFormService, useValue: formDefinitionSpy },
        { provide: AdfFormBuilderService, useValue: adfFormBuilderServiceSpy },
        { provide: PmpldTableService, useValue: tableDefinitionServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: UtilService, useValue: utilsSpy },
        { provide: ParameterManagementService, useValue: parameterManagerServiceSpy },
      ],
      imports : [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        FormsModule,
        ReactiveFormsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmpLoadHomeComponent);
    component = fixture.componentInstance;

    formDefinition = TestBed.inject(PmpldFormService) as jasmine.SpyObj<PmpldFormService>;
    adfFormBuilderService = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    tableDefinitionService = TestBed.inject(PmpldTableService) as jasmine.SpyObj<PmpldTableService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    parameterManagerService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    formBuilder = TestBed.inject(FormBuilder);


    formDefinition.buildFormLayout.and.returnValue({
      attributes: {}
    } as any)

    formGroup = formBuilder.group({
      [SimplePaymentPayrollLoadFormAttributes.TYPE_LOAD]: [''],
      [SimplePaymentPayrollLoadFormAttributes.TYPE_FILE]: ['', Validators.required],
    });
    adfFormBuilderService.formDefinition.and.returnValue(formGroup)

    parameterManagerService.getParameter.withArgs('navigateStateParameters').and.returnValue({formState: null})

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go back', () => {
    router.navigate.and.returnValue(mockPromise(true));
    clickElement(fixture, 'secondary', true);
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith([SPPMRoutes.HOME])
  })

  it('should go to the next step but form is not valid', () => {
    component.form.reset();
    fixture.detectChanges();
    clickElement(fixture, 'next', true);
    fixture.detectChanges();
    expect(utils.scrollToTop).toHaveBeenCalled();
    expect(component.form.valid).toBeFalsy()
  })

  it('should go to next step with view = PMP_TYPE_UPLOAD.FILE', () => {
    router.navigate.and.returnValue(mockPromise(true));
    component.typeUploadSelected = PMP_TYPE_UPLOAD.FILE;
    component.form.patchValue({
      [SimplePaymentPayrollLoadFormAttributes.TYPE_FILE]: 'txt'
    })
    fixture.detectChanges()

    clickElement(fixture, 'next', true);
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([SPPMRoutes.HOME_LOAD_FILE])
  })

  it('should go to next step with view = PMP_TYPE_UPLOAD.MANUAL', () => {
    router.navigate.and.returnValue(mockPromise(true));
    component.typeUploadSelected = PMP_TYPE_UPLOAD.MANUAL;
    component.form.patchValue({
      [SimplePaymentPayrollLoadFormAttributes.TYPE_FILE]: 'txt'
    })
    fixture.detectChanges()

    clickElement(fixture, 'next', true);
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([SPPMRoutes.HOME_LOAD_MANUAL]);
  })

});
