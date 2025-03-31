import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfFormatService } from '@adf/components';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { iAchUpdateStorageLayoutMock } from 'src/assets/mocks/modules/transfer/service/transfer-ach/ach.data.mock';
import { clickElement, mockPromise } from 'src/assets/testing';
import { ECrudAchTypeClient } from '../../../../enum/ach-crud-control-name.enum';
import { EACHTransferUrlNavigationCollection } from '../../../../enum/navigation-parameter.enum';
import { AtdCrudManagerService } from '../../../../services/definition/crud/atd-crud-manager.service';
import { AtdTableManagerService } from '../../../../services/definition/table/atd-table-manager.service';
import { AchUpdateConfirmComponent } from './ach-update-confirm.component';

describe('AchUpdateConfirmComponent', () => {
  let component: AchUpdateConfirmComponent;
  let fixture: ComponentFixture<AchUpdateConfirmComponent>;

  let router: jasmine.SpyObj<Router>;
  let adfFormat: jasmine.SpyObj<AdfFormatService>;
  let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;
  let persistStepStateService: jasmine.SpyObj<ParameterManagementService>;
  let crudManagerDefinition: jasmine.SpyObj<AtdCrudManagerService>;
  let tableManagerDefinition: jasmine.SpyObj<AtdTableManagerService>;
  let util: jasmine.SpyObj<UtilService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const adfFormatSpy = jasmine.createSpyObj('AdfFormatService', ['getFormatDateTime']);
    const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['getHeadBandLayoutConfirm']);
    const persistStepStateServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters']);
    const crudManagerDefinitionSpy = jasmine.createSpyObj('AtdCrudManagerService', [
      'buildUpdateConfirmationLegalClient',
      'buildUpdateConfirmationNaturalClient',
    ]);
    const tableManagerDefinitionSpy = jasmine.createSpyObj('AtdTableManagerService', ['buildModifyHistoryTable']);
    const utilSpy = jasmine.createSpyObj('UtilService', ['scrollToTop']);
    await TestBed.configureTestingModule({
      declarations: [AchUpdateConfirmComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AdfFormatService, useValue: adfFormatSpy },
        { provide: UtilWorkFlowService, useValue: utilWorkFlowSpy },
        { provide: ParameterManagementService, useValue: persistStepStateServiceSpy },
        { provide: AtdCrudManagerService, useValue: crudManagerDefinitionSpy },
        { provide: AtdTableManagerService, useValue: tableManagerDefinitionSpy },
        { provide: UtilService, useValue: utilSpy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AchUpdateConfirmComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    adfFormat = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
    utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
    persistStepStateService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    crudManagerDefinition = TestBed.inject(AtdCrudManagerService) as jasmine.SpyObj<AtdCrudManagerService>;
    tableManagerDefinition = TestBed.inject(AtdTableManagerService) as jasmine.SpyObj<AtdTableManagerService>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;

    persistStepStateService.getParameter.and.returnValue(iAchUpdateStorageLayoutMock);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build showAlert, VoucherNaturalClient, headbandLayout and ModifyHistoryTable', () => {
    expect(component.typeAlert).toEqual('success');
    expect(component.messageAlert).toEqual('ach.update_alert_confirmation');
    expect(crudManagerDefinition.buildUpdateConfirmationNaturalClient).toHaveBeenCalled();
    expect(adfFormat.getFormatDateTime).toHaveBeenCalled();
    expect(utilWorkFlow.getHeadBandLayoutConfirm).toHaveBeenCalled();
    expect(tableManagerDefinition.buildModifyHistoryTable).toHaveBeenCalled();
  });

  it('should go to the last step', () => {
    router.navigate.and.returnValue(mockPromise(true));
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([EACHTransferUrlNavigationCollection.HOME]);
    expect(persistStepStateService.sendParameters).toHaveBeenCalledWith({
      achUpdateForm: null,
      navigationProtectedParameter: null,
    });
  });

  it('should build Voucher Legal Client', () => {
    const data = { ...iAchUpdateStorageLayoutMock };
    data.typeClient = ECrudAchTypeClient.LEGAL;

    component.initDefinition(data);

    expect(crudManagerDefinition.buildUpdateConfirmationLegalClient).toHaveBeenCalled();
  });

  it('should build Voucher with typeClient null', () => {
    const data = { ...iAchUpdateStorageLayoutMock };
    data.typeClient = null as any;

    component.initDefinition(data);

    expect(crudManagerDefinition.buildUpdateConfirmationNaturalClient).toHaveBeenCalled();
  });

  it('should scrollToTop', () => {
    component.scrollToTop();
    expect(util.scrollToTop).toHaveBeenCalled();
  });
});
