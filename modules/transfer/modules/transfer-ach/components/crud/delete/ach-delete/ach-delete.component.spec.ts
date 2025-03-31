import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfButtonComponent, AdfFormatService, AdfReadingComponent } from '@adf/components';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { iAchDeleteStorageLayoutMock } from 'src/assets/mocks/modules/transfer/service/transfer-ach/ach.data.mock';
import { clickElement, mockPromise } from 'src/assets/testing';
import { EACHTransferUrlNavigationCollection } from '../../../../enum/navigation-parameter.enum';
import { IAchAccount } from '../../../../interfaces/ach-account-interface';
import { AtdDeleteConfirmService } from '../../../../services/definition/crud/delete/atd-delete-confirm.service';
import { AchDeleteComponent } from './ach-delete.component';

describe('AchDeleteComponent', () => {
  let component: AchDeleteComponent;
  let fixture: ComponentFixture<AchDeleteComponent>;

  let router: jasmine.SpyObj<Router>;
  let persistStepStateService: jasmine.SpyObj<ParameterManagementService>;
  let deleteTransactionDefinition: jasmine.SpyObj<AtdDeleteConfirmService>;
  let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;
  let adfFormat: jasmine.SpyObj<AdfFormatService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const persistStepStateServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters']);
    const deleteTransactionDefinitionSpy = jasmine.createSpyObj('AtdDeleteConfirmService', ['buildDeleteConfirmation']);
    const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['getHeadBandLayoutConfirm']);
    const adfFormatSpy = jasmine.createSpyObj('AdfFormatService', ['getFormatDateTime']);

    await TestBed.configureTestingModule({
      declarations: [AchDeleteComponent, AdfButtonComponent, AdfReadingComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ParameterManagementService, useValue: persistStepStateServiceSpy },
        { provide: AtdDeleteConfirmService, useValue: deleteTransactionDefinitionSpy },
        { provide: UtilWorkFlowService, useValue: utilWorkFlowSpy },
        { provide: AdfFormatService, useValue: adfFormatSpy },
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

    fixture = TestBed.createComponent(AchDeleteComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    persistStepStateService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    deleteTransactionDefinition = TestBed.inject(AtdDeleteConfirmService) as jasmine.SpyObj<AtdDeleteConfirmService>;
    utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
    adfFormat = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;

    persistStepStateService.getParameter.and.returnValue(iAchDeleteStorageLayoutMock);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create voucer layout, ', () => {
    expect(deleteTransactionDefinition.buildDeleteConfirmation).toHaveBeenCalledWith({
      deletedAccount: iAchDeleteStorageLayoutMock.accountSelected as IAchAccount,
      reference: iAchDeleteStorageLayoutMock?.transactionResponse?.reference as string,
      datetime: iAchDeleteStorageLayoutMock?.transactionResponse?.dateTime as string,
    });
    expect(utilWorkFlow.getHeadBandLayoutConfirm).toHaveBeenCalled();
    expect(component.typeAlert).toEqual('success');
    expect(component.messageAlert).toEqual('account_successfully_removed');
  });

  it('should go to the last step', () => {
    router.navigate.and.returnValue(mockPromise(true));
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([EACHTransferUrlNavigationCollection.HOME]);
    expect(persistStepStateService.sendParameters).toHaveBeenCalledWith({
      achDeleteState: null,
      navigationProtectedParameter: null,
    });
  });
});
