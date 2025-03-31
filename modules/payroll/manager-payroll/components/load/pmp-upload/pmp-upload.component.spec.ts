import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {PmpUploadComponent} from './pmp-upload.component';
import {PmpldVoucherService} from "../../../services/definition/load/upload-file/pmpld-voucher.service";
import {Router} from "@angular/router";
import {UtilService} from "../../../../../../service/common/util.service";
import {ParameterManagementService} from "../../../../../../service/navegation-parameters/parameter-management.service";
import {PmpldFormService} from "../../../services/definition/load/upload-file/pmpld-form.service";
import {AdfFormBuilderService, AdfUploadComponent} from "@adf/components";
import {LoadSheetFileService} from "../../../../../../service/common/load-sheet-file.service";
import {PmpeFileValidationsService} from "../../../services/execution/pmpe-file-validations.service";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA} from "@angular/core";
import {MockTranslatePipe} from "../../../../../../../assets/mocks/public/tranlatePipeMock";
import {PmpLoadHomeState} from "../../../interfaces/pmp-state.interface";
import {
  iSPPFileValidationsResponseMock,
  pmpLoadHomeStateMock
} from "../../../../../../../assets/mocks/modules/payroll/payroll.mock";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SpplmdForm} from "../../../interfaces/pmp-manual-form.interface";
import {clickElement, mockPromise} from "../../../../../../../assets/testing";
import {SPPMRoutes} from "../../../enums/pmp-routes.enum";
import {ISPPFileValidationsResponse} from "../../../interfaces/pmp-upload-file.interface";
import {FileType} from "../../../../../transfer/modules/bulk-transfer/models/type-file.enum";

describe('SpplUploadComponent', () => {
  let component: PmpUploadComponent;
  let fixture: ComponentFixture<PmpUploadComponent>;

  let router: jasmine.SpyObj<Router>;
  let utils: jasmine.SpyObj<UtilService>;
  let voucherDefinition: jasmine.SpyObj<PmpldVoucherService>;
  let parameterManagerService: jasmine.SpyObj<ParameterManagementService>;
  let formLayoutDefinition: jasmine.SpyObj<PmpldFormService>;
  let adfFormBuilder: jasmine.SpyObj<AdfFormBuilderService>;
  let loadSheetFile: jasmine.SpyObj<LoadSheetFileService>;
  let fileValidations: jasmine.SpyObj<PmpeFileValidationsService>;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup;

  beforeEach(async () => {

    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['showLoader', 'hideLoader', 'hidePulseLoader', 'showPulseLoader'])
    const voucherDefinitionSpy = jasmine.createSpyObj('PmpldVoucherService', ['buildVoucherLayout'])
    const parameterManagerServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters', 'getParameter'])
    const formLayoutDefinitionSpy = jasmine.createSpyObj('PmpldFormService', ['buildUploadFormLayout'])
    const adfFormBuilderSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition'])
    const loadSheetFileSpy = jasmine.createSpyObj('LoadSheetFileService', ['csv', 'excel'])
    const fileValidationsSpy = jasmine.createSpyObj('PmpeFileValidationsService', ['validate'])

    await TestBed.configureTestingModule({
      declarations: [ PmpUploadComponent, MockTranslatePipe, AdfUploadComponent ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: UtilService, useValue: utilsSpy },
        { provide: PmpldVoucherService, useValue: voucherDefinitionSpy },
        { provide: ParameterManagementService, useValue: parameterManagerServiceSpy },
        { provide: PmpldFormService, useValue: formLayoutDefinitionSpy },
        { provide: AdfFormBuilderService, useValue: adfFormBuilderSpy },
        { provide: LoadSheetFileService, useValue: loadSheetFileSpy },
        { provide: PmpeFileValidationsService, useValue: fileValidationsSpy },
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

    fixture = TestBed.createComponent(PmpUploadComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    voucherDefinition = TestBed.inject(PmpldVoucherService) as jasmine.SpyObj<PmpldVoucherService>;
    parameterManagerService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    formLayoutDefinition = TestBed.inject(PmpldFormService) as jasmine.SpyObj<PmpldFormService>;
    adfFormBuilder = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    loadSheetFile = TestBed.inject(LoadSheetFileService) as jasmine.SpyObj<LoadSheetFileService>;
    fileValidations = TestBed.inject(PmpeFileValidationsService) as jasmine.SpyObj<PmpeFileValidationsService>;
    formBuilder = TestBed.inject(FormBuilder);

    parameterManagerService.getParameter<PmpLoadHomeState>.and.returnValue(pmpLoadHomeStateMock);
    formLayoutDefinition.buildUploadFormLayout.and.returnValue({
      attributes: []
    } as any);

    formGroup = formBuilder.group({
      [SpplmdForm.ACCOUNT]: ['']
    });

    adfFormBuilder.formDefinition.and.returnValue(formGroup);
    router.navigate.and.returnValue(mockPromise(true));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go back', () => {
    clickElement(fixture, 'back', true);
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([SPPMRoutes.HOME_LOAD])
  })

  it('should go to next step', () => {
    component.isSuccessFileUpload = true;
    fixture.detectChanges();

    clickElement(fixture, 'next', true);
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([SPPMRoutes.CONFIRMATION_LOAD_FILE])
  })

  it('should set fileResponse when getCurrentFile is called', async () => {
    // Arrange
    const fileResponse: ISPPFileValidationsResponse = iSPPFileValidationsResponseMock
    // Act
    await component.getCurrentFile(fileResponse);
    // Assert
    expect(component.fileResponse).toBe(fileResponse);
  });

  it('should clear timeout and reset properties when handleRemovedFiles is called', () => {
    // Arrange
    component.timeOut = setTimeout(() => {}, 1000);
    component.currentFile = {} as any;
    component.fileResponse = {} as any;
    component.isSuccessFileUpload = true;
    spyOn(window, 'clearTimeout');

    // Act
    component.handleRemovedFiles();

    // Assert
    expect(clearTimeout).toHaveBeenCalledWith(component.timeOut);
    expect(component.currentFile).toBeUndefined();
    expect(component.fileResponse).toBeUndefined();
    expect(component.isSuccessFileUpload).toBe(false);
  });

  it('should call loadExcelFile when file type is EXCEL', async () => {
    // Arrange
    const file = new File([''], 'filename', { type: FileType.EXCEL });
    const emitter = new EventEmitter<any>();

    // Act
    await component.onLoadFile(file, emitter);

    // Assert
    expect(fileValidations.validate).toHaveBeenCalled();
  });

  it('should call loadCsvFile when file type is CSV', async () => {
    // Arrange
    const file = new File([''], 'filename', { type: FileType.CSV });
    const emitter = new EventEmitter<any>();

    // Act
    await component.onLoadFile(file, emitter);

    // Assert
    expect(fileValidations.validate).toHaveBeenCalled();
  });

  it('should manageResponseFile when validateFile is called', fakeAsync(() => {
    component.currentFile = null as any;

    // Arrange
    component.timeOut = setTimeout(() => {}, 1000);
    spyOn(window, 'clearTimeout');
    spyOn(component, 'manageResponseFile')

    // Act
    component.validateFile();
    tick(2000);

    expect(component.manageResponseFile).toHaveBeenCalled();
  }));

  it('should show error alert and hide message when currentFile and fileResponse are undefined', () => {
    // Arrange
    component.currentFile = undefined;
    component.fileResponse = undefined;

    // Act
    component.manageResponseFile();

    // Assert
    expect(component.typeMessage).toEqual('error');
    expect(component.message).toEqual('payroll:error_missing_file');
  });

  it('should show error alert, reset properties and hide message when fileResponse.currentFile is undefined and fileStatus is failed', () => {
    // Arrange
    component.currentFile = new File([''], 'filename');
    component.fileResponse = { currentFile: undefined, fileStatus: 'failed', message: 'error_message' } as any;
    spyOn(component, 'showAlert');
    spyOn(component, 'hideMessage');

    // Act
    component.manageResponseFile();

    // Assert
    expect(component.isSuccessFileUpload).toBe(false);
    expect(component.currentFile).toBeUndefined();
    expect(component.fileResponse).toBeUndefined();
    expect(component.hideMessage).toHaveBeenCalled();
  });

  it('should show success alert and set isSuccessFileUpload to true when conditions are met', () => {
    // Arrange
    component.currentFile = new File([''], 'filename');
    component.fileResponse = { currentFile: new File([''], 'filename'), fileStatus: 'success' } as any;
    spyOn(component, 'showAlert');

    // Act
    component.manageResponseFile();

    // Assert
    expect(component.showAlert).toHaveBeenCalledWith('success', 'payroll:success_file_upload_message');
    expect(component.isSuccessFileUpload).toBe(true);
  });

});
