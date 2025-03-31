import {AdfButtonComponent, AdfComponentsModule, AdfFormBuilderService} from '@adf/components';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {SmartCoreService} from 'src/app/service/common/smart-core.service';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {TTDCRUDManagerService} from '../../../../services/definition/crud/manager/ttd-crud-manager.service';
import {TransferThirdService} from '../../../../services/transaction/transfer-third.service';
import {TtCreateHomeComponent} from './tt-create-home.component';
import {EThirdTransferUrlNavigationCollection} from "../../../../enums/third-transfer-navigate-parameters.enum";
import {EProfile} from "../../../../../../../../enums/profile.enum";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AttributeFormCrud} from "../../../../enums/third-transfer-control-name.enum";
import {
  clickElement,
  mockObservable,
  mockObservableError,
  mockPromise
} from "../../../../../../../../../assets/testing";
import {
  iGetThirdTransferResponseMock
} from "../../../../../../../../../assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock";

describe('TtCreateHomeComponent', () => {
  let component: TtCreateHomeComponent;
  let fixture: ComponentFixture<TtCreateHomeComponent>;

  let router: jasmine.SpyObj<Router>;
  let crudServiceManager: jasmine.SpyObj<TTDCRUDManagerService>;
  let crudFormBuilder: jasmine.SpyObj<AdfFormBuilderService>;
  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let transferThirdService: jasmine.SpyObj<TransferThirdService>;
  let smartCore: jasmine.SpyObj<SmartCoreService>;
  let util: jasmine.SpyObj<UtilService>;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup;

  beforeEach(async () => {

    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const crudServiceManagerSpy = jasmine.createSpyObj('TTDCRUDManagerService', ['buildConsultingLayoutTTC'])
    const crudFormBuilderSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition'])
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters'])
    const transferThirdServiceSpy = jasmine.createSpyObj('TransferThirdService', ['getThird'])
    const smartCoreSpy = jasmine.createSpyObj('SmartCoreService', ['personalizationOperation'])
    const utilSpy = jasmine.createSpyObj('UtilService', ['showLoader', 'hideLoader', 'getISOCurrency', 'getProductName'])

    await TestBed.configureTestingModule({
      declarations: [TtCreateHomeComponent, AdfButtonComponent],
      providers: [
        TtCreateHomeComponent,
        {provide: Router, useValue: routerSpy},
        {provide: TTDCRUDManagerService, useValue: crudServiceManagerSpy},
        {provide: AdfFormBuilderService, useValue: crudFormBuilderSpy},
        {provide: ParameterManagementService, useValue: parameterManagementSpy},
        {provide: TransferThirdService, useValue: transferThirdServiceSpy},
        {provide: SmartCoreService, useValue: smartCoreSpy},
        {provide: UtilService, useValue: utilSpy},
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        AdfComponentsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TtCreateHomeComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    crudServiceManager = TestBed.inject(TTDCRUDManagerService) as jasmine.SpyObj<TTDCRUDManagerService>;
    crudFormBuilder = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    transferThirdService = TestBed.inject(TransferThirdService) as jasmine.SpyObj<TransferThirdService>;
    smartCore = TestBed.inject(SmartCoreService) as jasmine.SpyObj<SmartCoreService>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    formBuilder = TestBed.inject(FormBuilder);

    formGroup = formBuilder.group({
      [AttributeFormCrud.TYPE_ACCOUNT]: ['', [Validators.required]],
      [AttributeFormCrud.NUMBER_ACCOUNT]: ['', [Validators.required]],
    });

    crudServiceManager.buildConsultingLayoutTTC.and.returnValue({
      attributes: [],
      class: 'class-test',
      subtitle: 'Test Service',
      title: 'Transfer'
    })

    crudFormBuilder.formDefinition.and.returnValue(formGroup)

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(crudFormBuilder.formDefinition).toHaveBeenCalled();
  });


  it('Should go to the back step', () => {
    router.navigate.and.returnValue(Promise.resolve(true));
    component['profile'] = EProfile.SALVADOR;
    const btn = fixture.debugElement.query(By.css('adf-button.secondary'))
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith([EThirdTransferUrlNavigationCollection.HOMESV])
    expect(parameterManagement.sendParameters).toHaveBeenCalledWith({
      navigationProtectedParameter: null,
    })
  })

  it('should go to the next step but form is not valid', () => {
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();

    expect(component.consultingForm.markAllAsTouched).toBeTruthy()
    expect(component.consultingForm.valid).toBeFalsy()
  })

  it('should go to the next step', () => {
    router.navigate.and.returnValue(mockPromise(true))
    transferThirdService.getThird.and.returnValue(mockObservable(iGetThirdTransferResponseMock))

    component.consultingForm.patchValue({
      [AttributeFormCrud.TYPE_ACCOUNT]: 'CUENTA DE AHORRO DOLARES',
      [AttributeFormCrud.NUMBER_ACCOUNT]: '896558185',
    })

    fixture.detectChanges();

    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();

    expect(component.consultingForm.valid).toBeTruthy();
    expect(smartCore.personalizationOperation).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/transfer/third/create-confirm'])
  })

  it('should go to the next step but service response error', () => {
    transferThirdService.getThird.and.returnValue(mockObservableError({error: {message: 'TimeoutError'}}))

    component.consultingForm.patchValue({
      [AttributeFormCrud.TYPE_ACCOUNT]: 'CUENTA DE AHORRO DOLARES',
      [AttributeFormCrud.NUMBER_ACCOUNT]: '896558185',
    })

    fixture.detectChanges();

    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();

    expect(component.consultingForm.valid).toBeTruthy();
    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual('TimeoutError')
  })

  it('should alert', () => {
    const type: string = 'success';
    const message: string = 'test message';

    component.showAlert(type, message);

    expect(component.typeAlert).toEqual(type)
    expect(component.messageAlert).toEqual(message)
  })

  it('should hidden alert', () => {
    component.hiddenAlert()
    expect(component.typeAlert).toBeNull();
    expect(component.messageAlert).toBeNull();
  })

});
