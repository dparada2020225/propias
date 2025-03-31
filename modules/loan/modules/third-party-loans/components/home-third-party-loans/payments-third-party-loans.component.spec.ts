import { AdfFormBuilderService } from '@adf/components';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { iThirdPartyLoanAssociateMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { clickElement, mockObservable, mockObservableError, mockPromise } from 'src/assets/testing';
import { ENavigateProtectionParameter } from '../../enum/navigate-protection-parameter.enum';
import { AttributeOwnLoansTable } from '../../enum/own-third-party-loans-control-name.enum';
import { TableThirdPartyLoansOption } from '../../enum/table-third-party-loans.enum';
import { TpldTableManagerService } from '../../services/definition/table/tpld-table-manager.service';
import { TpleThirdPartyLoansService } from '../../services/execution/third-party-loan-payment/tple-third-party-loans.service';
import { PaymentsThirdPartyLoansComponent } from './payments-third-party-loans.component';

describe('PaymentsThirdPartyLoansComponent', () => {
  let component: PaymentsThirdPartyLoansComponent;
  let fixture: ComponentFixture<PaymentsThirdPartyLoansComponent>;

  let tableManagerService: jasmine.SpyObj<TpldTableManagerService>;
  let tplFormBuilder: jasmine.SpyObj<AdfFormBuilderService>;
  let router: jasmine.SpyObj<Router>;
  let parameterManagementService: jasmine.SpyObj<ParameterManagementService>;
  let util: jasmine.SpyObj<UtilService>;
  let tplExecutionService: jasmine.SpyObj<TpleThirdPartyLoansService>;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup<{
    [AttributeOwnLoansTable.FILTER]: FormControl<string | null>;
  }>;

  beforeEach(async () => {
    const tableManagerServiceSpy = jasmine.createSpyObj('TpldTableManagerService', ['buildThirdLoanTable', 'buildFilterForm']);
    const tplFormBuilderSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const parameterManagementServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters']);
    const utilSpy = jasmine.createSpyObj('UtilService', [
      'hideLoader',
      'showPulseLoader',
      'hidePulseLoader',
      'scrollToTop',
      'showLoader',
      'getLicensesTransactions',
    ]);
    const tplExecutionServiceSpy = jasmine.createSpyObj('TpleThirdPartyLoansService', [
      'parseThirdPartyLoans',
      'handleUpdateThirdPartyLoan',
      'gotToPayment',
      'openDeleteModal',
      'getThirdPartyLoans',
    ]);
    await TestBed.configureTestingModule({
      declarations: [PaymentsThirdPartyLoansComponent],
      providers: [
        { provide: TpldTableManagerService, useValue: tableManagerServiceSpy },
        { provide: AdfFormBuilderService, useValue: tplFormBuilderSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ParameterManagementService, useValue: parameterManagementServiceSpy },
        { provide: UtilService, useValue: utilSpy },
        { provide: TpleThirdPartyLoansService, useValue: tplExecutionServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                associatedThirdAccounts: [iThirdPartyLoanAssociateMock],
                menuOptions: ['transfer', 'create_option'],
              },
            },
          },
        },
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

    fixture = TestBed.createComponent(PaymentsThirdPartyLoansComponent);
    component = fixture.componentInstance;
    tableManagerService = TestBed.inject(TpldTableManagerService) as jasmine.SpyObj<TpldTableManagerService>;
    tplFormBuilder = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    parameterManagementService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    tplExecutionService = TestBed.inject(TpleThirdPartyLoansService) as jasmine.SpyObj<TpleThirdPartyLoansService>;
    formBuilder = TestBed.inject(FormBuilder);

    tableManagerService.buildThirdLoanTable.and.returnValue({
      items: [],
    } as any);

    tableManagerService.buildFilterForm.and.returnValue({
      attributes: [],
    } as any);

    formGroup = formBuilder.group({
      filter: ['', Validators.required],
    });

    tplFormBuilder.formDefinition.and.returnValue(formGroup);
    component.filterForm = formGroup;

    tplExecutionService.parseThirdPartyLoans.and.returnValue([iThirdPartyLoanAssociateMock] as any);

    util.getLicensesTransactions.and.returnValue(['transfer', 'create_option']);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shoulg go to the next page', fakeAsync(() => {
    router.navigate.and.returnValue(mockPromise(true));
    clickElement(fixture, 'adf-button');
    fixture.detectChanges();
    tick();
    expect(parameterManagementService.sendParameters).toHaveBeenCalledWith({
      navigationProtectedParameter: ENavigateProtectionParameter.CONSULT,
    });
    expect(router.navigate).toHaveBeenCalledWith(['/loan/third-party-loans/consult']);
  }));

  describe('get Action Table', () => {
    let data;

    it('TableThirdPartyLoansOption.DELETE', () => {
      data = { action: TableThirdPartyLoansOption.DELETE };
      spyOn(component, 'handleDeleteLoan');
      component.getActionTable(data);
      expect(component.handleDeleteLoan).toHaveBeenCalled();
    });

    it('TableThirdPartyLoansOption.UPDATE', () => {
      data = { action: TableThirdPartyLoansOption.UPDATE, item: {} };
      component.getActionTable(data);
      expect(tplExecutionService.handleUpdateThirdPartyLoan).toHaveBeenCalled();
    });

    it('TableThirdPartyLoansOption.PAYMENT', () => {
      data = { action: TableThirdPartyLoansOption.PAYMENT, item: {} };
      component.getActionTable(data);
      expect(tplExecutionService.gotToPayment).toHaveBeenCalled();
    });

    it('should get Third Party Loans By Infinity Scroll', () => {
      component.filterForm.patchValue({
        filter: '574',
      });
      component.isScrollable = true;
      tplExecutionService.getThirdPartyLoans.and.returnValue(mockObservable([iThirdPartyLoanAssociateMock]));
      component.getThirdPartyLoansByInfinityScroll();
      expect(tplExecutionService.getThirdPartyLoans).toHaveBeenCalled();
    });
  });

  it('should get Data Filter', fakeAsync(() => {
    component.filterForm.patchValue({
      filter: '574',
    });
    tplExecutionService.getThirdPartyLoans.and.returnValue(mockObservable([iThirdPartyLoanAssociateMock]));
    component.getDataFilter();
    tick(1000);
    expect(component.showTitleTable).toBeTruthy();
    expect(component.showThirdLoansTable).toBeTruthy();
    expect(component.showMessageAlert).toBeFalsy();
  }));

  it('should get Data Filter but have error http', fakeAsync(() => {
    component.filterForm.patchValue({
      filter: '574',
    });
    spyOn(component, 'removeAlert');
    tplExecutionService.getThirdPartyLoans.and.returnValue(mockObservableError({}));
    component.getDataFilter();
    tick(1000);
    expect(component.isLoading).toBeFalsy();
    expect(component.thirdAccounts).toEqual([]);
    expect(util.scrollToTop).toHaveBeenCalled();
  }));

  it('should remove alert', fakeAsync(() => {
    component.removeAlert();
    tick(10000);
    expect(component.typeAlert).toBeNull();
    expect(component.messageAlert).toBeNull();
  }));
});
