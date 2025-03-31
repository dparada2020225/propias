import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfFormatService } from '@adf/components';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import {
  iAchCrudTransactionResponseMock,
  iCrudACHStorageStateMock,
} from 'src/assets/mocks/modules/transfer/service/transfer-ach/ach.data.mock';
import { clickElement, mockPromise } from 'src/assets/testing';
import { ECrudAchTypeClient } from '../../../../enum/ach-crud-control-name.enum';
import { EACHTransferUrlNavigationCollection } from '../../../../enum/navigation-parameter.enum';
import { IACHBank } from '../../../../interfaces/crud/crud-create.interface';
import { AtdCrudManagerService } from '../../../../services/definition/crud/atd-crud-manager.service';
import { AchCreateConfirmComponent } from './ach-create-confirm.component';

describe('AchCreateConfirmComponent', () => {
  let component: AchCreateConfirmComponent;
  let fixture: ComponentFixture<AchCreateConfirmComponent>;

  let router: jasmine.SpyObj<Router>;
  let adfFormat: jasmine.SpyObj<AdfFormatService>;
  let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;
  let persistStepStateService: jasmine.SpyObj<ParameterManagementService>;
  let crudManagerDefinition: jasmine.SpyObj<AtdCrudManagerService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const adfFormatSpy = jasmine.createSpyObj('AdfFormatService', ['getFormatDateTime']);
    const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['getHeadBandLayoutConfirm']);
    const persistStepStateServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters', 'getParameter']);
    const crudManagerDefinitionSpy = jasmine.createSpyObj('AtdCrudManagerService', [
      'buildConfirmationVoucherForLegalClient',
      'buildConfirmationVoucherForNaturalClient',
    ]);

    await TestBed.configureTestingModule({
      declarations: [AchCreateConfirmComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AdfFormatService, useValue: adfFormatSpy },
        { provide: UtilWorkFlowService, useValue: utilWorkFlowSpy },
        { provide: ParameterManagementService, useValue: persistStepStateServiceSpy },
        { provide: AtdCrudManagerService, useValue: crudManagerDefinitionSpy },
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

    fixture = TestBed.createComponent(AchCreateConfirmComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    adfFormat = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
    utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
    persistStepStateService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    crudManagerDefinition = TestBed.inject(AtdCrudManagerService) as jasmine.SpyObj<AtdCrudManagerService>;

    persistStepStateService.getParameter.and.returnValue(iCrudACHStorageStateMock);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.bankSelected).toEqual(iCrudACHStorageStateMock.bankSelected);
    expect(component.typeAlert).toEqual('success');
    expect(component.messageAlert).toEqual('ach_success_account_created');
  });

  it('should create voucher layout with type client natural', () => {
    component.initDefinition(iCrudACHStorageStateMock);
    fixture.detectChanges();
    expect(crudManagerDefinition.buildConfirmationVoucherForNaturalClient).toHaveBeenCalledWith({
      formValues: iCrudACHStorageStateMock?.formValues,
      reference: iCrudACHStorageStateMock?.transactionResponse?.reference as string,
      datetime: iCrudACHStorageStateMock?.transactionResponse?.dateTime as string,
      bankSelected: component.bankSelected as IACHBank,
    });
  });

  it('should create voucher layout with type client LEGAL', () => {
    const data = { ...iCrudACHStorageStateMock };
    data.typeClient = ECrudAchTypeClient.LEGAL;

    component.initDefinition(data);
    fixture.detectChanges();
    expect(crudManagerDefinition.buildConfirmationVoucherForNaturalClient).toHaveBeenCalledWith({
      formValues: data?.formValues,
      reference: data?.transactionResponse?.reference as string,
      datetime: data?.transactionResponse?.dateTime as string,
      bankSelected: component.bankSelected as IACHBank,
    });
  });

  it('should go to the last step', () => {
    router.navigate.and.returnValue(mockPromise(true));
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([EACHTransferUrlNavigationCollection.HOME]);
    expect(persistStepStateService.sendParameters).toHaveBeenCalledWith({
      achCrudState: null,
      navigationProtectedParameter: null,
    });
  });

  it('should headBandLayoutBuilder', () => {
    component.headBandLayoutBuilder(iAchCrudTransactionResponseMock);

    expect(adfFormat.getFormatDateTime).toHaveBeenCalledWith(iAchCrudTransactionResponseMock.dateTime);
    expect(utilWorkFlow.getHeadBandLayoutConfirm).toHaveBeenCalled();
  });
});
