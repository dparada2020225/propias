import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfSelectComponent } from '@adf/components';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { StatementsService } from 'src/app/service/shared/statements.service';
import { iAccount } from 'src/assets/mocks/modules/signature-tracking/mocksDetailTransaction';
import { mockObservable, mockObservableError } from 'src/assets/testing';
import { AccountSelectorComponent } from './account-selector.component';

describe('AccountSelectorComponent', () => {
  let component: AccountSelectorComponent;
  let fixture: ComponentFixture<AccountSelectorComponent>;

  let statementsService: jasmine.SpyObj<StatementsService>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(async () => {
    const statementsServiceSpy = jasmine.createSpyObj('StatementsService', ['getAccounts']);
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter']);
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    await TestBed.configureTestingModule({
      declarations: [AccountSelectorComponent, AdfSelectComponent],
      providers: [
        { provide: StatementsService, useValue: statementsServiceSpy },
        { provide: ParameterManagementService, useValue: parameterManagementSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
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

    fixture = TestBed.createComponent(AccountSelectorComponent);
    component = fixture.componentInstance;
    statementsService = TestBed.inject(StatementsService) as jasmine.SpyObj<StatementsService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;

    component.service = 'transfer';
    component.entryType = '1';
    component.account = '5613252';
    component.returnOriginal = false;
    const initialValue = 'initialValue';
    const control = new FormControl(initialValue);

    component.control = control;

    component.product = 'transfer';
    component.isLoading = false;

    statementsService.getAccounts.and.returnValue(mockObservable([iAccount]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Tests that when 'returnOriginal' is false, the method emits the event with the value of the input parameter '$event'
  it('test_return_original_false', () => {
    spyOn(component.onChangeAccount, 'emit');
    component.returnOriginal = false;
    component.onChange('test');
    expect(component.onChangeAccount.emit).toHaveBeenCalledWith('test');
  });

  // Tests that when 'control' input is not provided, the method does not throw any errors
  it('test_control_not_provided', () => {
    spyOn(component.onChangeAccount, 'emit');
    component.returnOriginal = false;
    expect(() => {
      component.onChange('test');
    }).not.toThrow();
  });

  // Tests that when 'returnOriginal' is true and 'originalAccounts' array is empty, the method emits the event with undefined value
  it('test_return_original_true_empty', () => {
    spyOn(component.onChangeAccount, 'emit');
    component.returnOriginal = true;
    component.originalAccounts = [];
    component.onChange('not_found');
    expect(component.onChangeAccount.emit).toHaveBeenCalledWith(undefined);
  });

  // Tests that when 'originalAccounts' array is empty, the method emits the event with undefined value
  it('test_original_accounts_empty', () => {
    spyOn(component.onChangeAccount, 'emit');
    component.returnOriginal = true;
    component.originalAccounts = [];
    component.onChange('test');
    expect(component.onChangeAccount.emit).toHaveBeenCalledWith(undefined);
  });

  it('should getAccounts but service respone error', () => {
    statementsService.getAccounts.and.returnValue(mockObservableError({}));
    component.getAccounts();
    expect(spinner.hide).toHaveBeenCalled();
  });

  it('should getAccounts but service respone empty', () => {
    statementsService.getAccounts.and.returnValue(mockObservable(false));
    component.getAccounts();
    expect(component.showAlert).toBeTruthy();
    expect(spinner.hide).toHaveBeenCalled();
  });
});
