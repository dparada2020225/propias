import { AdfFormBuilderService, AdfFormatService } from '@adf/components';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuOptionLicensesService } from 'src/app/service/common/menu-option-licenses.service';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import {
  iOwnLoansPaginationMock,
  iThirdPartyLoanAssociateMock,
  iThirdTransfersAccountsMock,
} from 'src/assets/mocks/modules/loan/loan.data.mock';
import { mockObservable, mockPromise } from 'src/assets/testing';
import { AttributeOwnLoansTable } from '../../enum/own-third-party-loans-control-name.enum';
import { TableThirdPartyLoansOption } from '../../enum/table-third-party-loans.enum';
import { TpldTableManagerService } from '../../services/definition/table/tpld-table-manager.service';
import { TpleThirdPartyLoansService } from '../../services/execution/third-party-loan-payment/tple-third-party-loans.service';
import { OwnLoansService } from '../../services/transaction/own-loans.service';
import { ThirdPartyLoansService } from '../../services/transaction/third-party-loans.service';
import { GoToBalanceService } from '../../utils/go-to-balance.service';
import { PaymentOwnThirdPartyLoansComponent } from './payment-own-third-party-loans.component';

describe('PaymentOwnThirdPartyLoansComponent', () => {
  let component: PaymentOwnThirdPartyLoansComponent;
  let fixture: ComponentFixture<PaymentOwnThirdPartyLoansComponent>;

  let tableManagerService: jasmine.SpyObj<TpldTableManagerService>;
  let tplFormBuilder: jasmine.SpyObj<AdfFormBuilderService>;
  let router: jasmine.SpyObj<Router>;
  let thirdPartyLoansService: jasmine.SpyObj<ThirdPartyLoansService>;
  let util: jasmine.SpyObj<UtilService>;
  let goToBalanceService: jasmine.SpyObj<GoToBalanceService>;
  let paymentThirdPartyLoans: jasmine.SpyObj<OwnLoansService>;
  let tplExecutionService: jasmine.SpyObj<TpleThirdPartyLoansService>;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup<{
    [AttributeOwnLoansTable.FILTER]: FormControl<string | null>;
  }>;

  beforeEach(async () => {
    const tableManagerServiceSpy = jasmine.createSpyObj('TpldTableManagerService', [
      'buildThirdLoanTable',
      'buildOwnThirdLoanTable',
      'buildFilterForm',
    ]);
    const tplFormBuilderSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition']);
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const thirdPartyLoansServiceSpy = jasmine.createSpyObj('ThirdPartyLoansService', ['getThirdPartyLoansAccount']);
    const parameterManagementServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['']);
    const utilSpy = jasmine.createSpyObj('UtilService', [
      'hideLoader',
      'showPulseLoader',
      'hidePulseLoader',
      'getCurrencySymbolToIso',
      'scrollToTop',
      'getLicensesTransactions',
    ]);
    const sortCurrencySpy = jasmine.createSpyObj('SortCurrencyLoanService', ['']);
    const formatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount']);
    const goToBalanceServiceSpy = jasmine.createSpyObj('GoToBalanceService', ['goToBalance']);
    const paymentThirdPartyLoansSpy = jasmine.createSpyObj('OwnLoansService', ['getOwnsLoans']);
    const tplExecutionServiceSpy = jasmine.createSpyObj('TpleThirdPartyLoansService', [
      'parseThirdPartyLoans',
      'gotToPayment',
      'handleUpdateThirdPartyLoan',
      'openDeleteModal',
      'messageAlert',
    ]);
    const menuOptionsServiceSpy = jasmine.createSpyObj('MenuOptionLicensesService', ['']);

    await TestBed.configureTestingModule({
      declarations: [PaymentOwnThirdPartyLoansComponent],
      providers: [
        { provide: TpldTableManagerService, useValue: tableManagerServiceSpy },
        { provide: AdfFormBuilderService, useValue: tplFormBuilderSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ThirdPartyLoansService, useValue: thirdPartyLoansServiceSpy },
        { provide: ParameterManagementService, useValue: parameterManagementServiceSpy },
        { provide: UtilService, useValue: utilSpy },
        { provide: AdfFormatService, useValue: formatServiceSpy },
        { provide: GoToBalanceService, useValue: goToBalanceServiceSpy },
        { provide: OwnLoansService, useValue: paymentThirdPartyLoansSpy },
        { provide: TpleThirdPartyLoansService, useValue: tplExecutionServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                associatedThirdAccounts: [iThirdPartyLoanAssociateMock],
                associatedOwnLoansAccounts: [iOwnLoansPaginationMock],
                menuOptionsTPL: ['transfer'],
              },
            },
          },
        },
        { provide: MenuOptionLicensesService, useValue: menuOptionsServiceSpy },
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

    fixture = TestBed.createComponent(PaymentOwnThirdPartyLoansComponent);
    component = fixture.componentInstance;

    tableManagerService = TestBed.inject(TpldTableManagerService) as jasmine.SpyObj<TpldTableManagerService>;
    tplFormBuilder = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    thirdPartyLoansService = TestBed.inject(ThirdPartyLoansService) as jasmine.SpyObj<ThirdPartyLoansService>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    goToBalanceService = TestBed.inject(GoToBalanceService) as jasmine.SpyObj<GoToBalanceService>;
    paymentThirdPartyLoans = TestBed.inject(OwnLoansService) as jasmine.SpyObj<OwnLoansService>;
    tplExecutionService = TestBed.inject(TpleThirdPartyLoansService) as jasmine.SpyObj<TpleThirdPartyLoansService>;
    formBuilder = TestBed.inject(FormBuilder);

    tableManagerService.buildThirdLoanTable.and.returnValue({
      items: iThirdTransfersAccountsMock,
    } as any);

    tableManagerService.buildOwnThirdLoanTable.and.returnValue({
      items: iThirdTransfersAccountsMock,
    } as any);

    tableManagerService.buildFilterForm.and.returnValue({
      attributes: [],
    } as any);

    formGroup = formBuilder.group({
      filter: ['', Validators.required],
    });

    tplFormBuilder.formDefinition.and.returnValue(formGroup);
    component.filterForm = formGroup;

    tplExecutionService.parseThirdPartyLoans.and.returnValue([iThirdTransfersAccountsMock] as any);

    util.getLicensesTransactions.and.returnValue(['transfer']);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('get Action Table Owns Loans', () => {
    let data;

    beforeEach(() => {
      router.navigate.and.returnValue(mockPromise(true));
    });

    it('TableThirdPartyLoansOption.PAYMENT', fakeAsync(() => {
      data = { action: TableThirdPartyLoansOption.PAYMENT };
      component.getActionTableOwnsLoans(data);
      tick();
      expect(router.navigate).toHaveBeenCalledWith(['/loan-payment']);
    }));

    it('TableThirdPartyLoansOption.PAYMENT', fakeAsync(() => {
      data = { action: TableThirdPartyLoansOption.ACCOUNT_STATEMENT };
      component.getActionTableOwnsLoans(data);
      tick();
      expect(router.navigate).toHaveBeenCalledWith(['/account-statement']);
    }));

    it('TableThirdPartyLoansOption.PAYMENT', fakeAsync(() => {
      data = { action: TableThirdPartyLoansOption.CONSULT, item: { identifier: '4524' } };
      component.getActionTableOwnsLoans(data);
      tick();
      expect(goToBalanceService.goToBalance).toHaveBeenCalledWith('4524');
    }));
  });

  describe('get Action Table Third Loans', () => {
    let data;

    it('TableThirdPartyLoansOption.DELETE', () => {
      spyOn(component, 'handleDeleteThirdPartyLoan');
      data = { action: TableThirdPartyLoansOption.DELETE };
      component.getActionTableThirdLoans(data);
      expect(component.handleDeleteThirdPartyLoan).toHaveBeenCalled();
    });

    it('TableThirdPartyLoansOption.PAYMENT', () => {
      data = { action: TableThirdPartyLoansOption.PAYMENT, item: {} };
      component.getActionTableThirdLoans(data);
      expect(tplExecutionService.gotToPayment).toHaveBeenCalled();
    });

    it('TableThirdPartyLoansOption.UPDATE', () => {
      data = { action: TableThirdPartyLoansOption.UPDATE, item: {} };
      component.getActionTableThirdLoans(data);
      expect(tplExecutionService.handleUpdateThirdPartyLoan).toHaveBeenCalled();
    });
  });

  it('should show Alert Owns Loans Account', () => {
    const type: string = 'success';
    const message: string = 'Accounts';

    component.showAlertOwnsLoansAccount(type, message);

    expect(component.typeAlertOwnsLoansAccount).toEqual(type);
    expect(component.messageAlertOwnsLoansAccount).toEqual(message);
  });

  it('should get Data Filter', fakeAsync(() => {
    thirdPartyLoansService.getThirdPartyLoansAccount.and.returnValue(mockObservable([iThirdPartyLoanAssociateMock]));
    paymentThirdPartyLoans.getOwnsLoans.and.returnValue(mockObservable([iOwnLoansPaginationMock]));
    component.filterForm.patchValue({
      filter: '4257',
    });
    component.getDataFilter();
    tick(1000);

    expect(thirdPartyLoansService.getThirdPartyLoansAccount).toHaveBeenCalled();
    expect(paymentThirdPartyLoans.getOwnsLoans).toHaveBeenCalled();
    expect(component.showOwnsLoansTable).toBeTruthy();
    expect(component.showThirdLoansTable).toBeTruthy();
    expect(component.emptyAlert).toBeFalsy();
  }));

  it('shoulg show Alert', () => {
    const type: string = 'alert';
    const mesage: string = 'alert';

    component.showAlert(type, mesage);

    expect(component.typeAlert).toEqual(type);
    expect(component.messageAlert).toEqual(mesage);
  });

  it('should hidden Alert', () => {
    component.hiddenAlert();
    expect(component.typeAlert).toBeNull();
    expect(component.messageAlert).toBeNull();
  });

  it('should get Accounts', () => {
    thirdPartyLoansService.getThirdPartyLoansAccount.and.returnValue(mockObservable([iThirdPartyLoanAssociateMock]));
    component.isScrollable = true;
    component.getAccounts();
    expect(thirdPartyLoansService.getThirdPartyLoansAccount).toHaveBeenCalled();
  });

  it('should get Own Loan List', () => {
    paymentThirdPartyLoans.getOwnsLoans.and.returnValue(mockObservable([iOwnLoansPaginationMock]));
    component.isScrollableTableOwns = true;
    component.getOwnsLoans();
    expect(paymentThirdPartyLoans.getOwnsLoans).toHaveBeenCalled();
  });

  it('should scroll To Top', () => {
    component.scrollToTop();
    expect(util.scrollToTop).toHaveBeenCalled();
  });

  it('should remove Alert', () => {
    component.removeAlert();
    expect(component.typeAlert).toBeNull();
    expect(component.messageAlert).toBeNull();
  });
});
