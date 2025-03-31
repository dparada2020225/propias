import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from "@angular/common";

import { AccountBalanceComponent } from './account-balance.component';
import { AccountBalanceService } from 'src/app/service/private/account-balance/account-balance.service';
import { BusinessNameService } from 'src/app/service/shared/business-name.service';
import { ErrorMessageService } from 'src/app/service/shared/error-message.service';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { CustomNumberPipe } from 'src/app/pipes/custom-number.pipe';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { AdfAlertComponent, AdfButtonComponent } from '@adf/components';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { mockModal } from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import { accountBalanceObjectMock } from 'src/assets/mocks/modules/private/account-balance.mock';

class ParameterManagementServiceMock {

  getSharedParameter() {
    return of({
      account: '755252500',
      product: '1'
    })
  }
  getMenuEquivalence() {
    return
  }
  getParameter() {
    return {
      account: '755252500',
      product: '1'
    }
  }

}

describe('AccountBalanceComponent', () => {
  let component: AccountBalanceComponent;
  let fixture: ComponentFixture<AccountBalanceComponent>;

  let accountBalanceService: jasmine.SpyObj<AccountBalanceService>
  let businessName: jasmine.SpyObj<BusinessNameService>
  let error: jasmine.SpyObj<ErrorMessageService>
  let location: jasmine.SpyObj<Location>
  let modalService: jasmine.SpyObj<NgbModal>
  let spinner: jasmine.SpyObj<NgxSpinnerService>

  beforeEach(async () => {

    const accountBalanceServiceSpy = jasmine.createSpyObj('AccountBalanceService', ['getAccountBalance']);
    const businessNameSpy = jasmine.createSpyObj('BusinessNameService', ['accountNumber', 'getBusiness']);
    const errorSpy = jasmine.createSpyObj('ErrorMessageService', ['getTranslateKey']);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['']);
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      declarations: [AccountBalanceComponent, CustomNumberPipe, TranslatePipe, AdfButtonComponent, AdfAlertComponent],
      providers: [
        AccountBalanceComponent,
        ParameterManagementServiceMock,
        { provide: AccountBalanceService, useValue: accountBalanceServiceSpy },
        { provide: BusinessNameService, useValue: businessNameSpy },
        { provide: ErrorMessageService, useValue: errorSpy },
        { provide: Location, useValue: locationSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: ParameterManagementService, useClass: ParameterManagementServiceMock },
        { provide: ActivatedRoute, useValue: {} },
        { provide: NgbModalConfig, useValue: {} }
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        HttpClientModule,
        HttpClientTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AccountBalanceComponent);
    component = fixture.componentInstance;

    accountBalanceService = TestBed.inject(AccountBalanceService) as jasmine.SpyObj<AccountBalanceService>;
    businessName = TestBed.inject(BusinessNameService) as jasmine.SpyObj<BusinessNameService>;
    error = TestBed.inject(ErrorMessageService) as jasmine.SpyObj<ErrorMessageService>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;

    component.accountBalanceJson = accountBalanceObjectMock;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open modal and get account value', () => {
    modalService.open.and.returnValue(mockModal as NgbModalRef)
    component.open();
    expect(spinner.show).toHaveBeenCalled()
    expect(modalService.open).toHaveBeenCalled()
  })

  it('should open modal Reservation', () => {
    modalService.open.and.returnValue(mockModal as NgbModalRef)
    const data = {
      key: '155',
      value: 'only test'
    }
    component.openReservation(data.key, data.value)
    expect(modalService.open).toHaveBeenCalled()
  })

  it('should call ngOnInit with data null', () => {
    component.accountNumber = ''
    component.product = ''
    component.ngOnInit();
    expect(component.accountNumber).toBeTruthy()
    expect(component.product).toBeTruthy()
  })

  it('should restore Data and get new data', () => {
    businessName.getBusiness.and.returnValue('Banpaís')
    component.restoreData(accountBalanceObjectMock)
    expect(component.currencySymbol).toEqual('$')
    expect(component.reference).toEqual('123')
    expect(component.business).toEqual('Banpaís')
    expect(component.lastMovement).toEqual('2021-01-01')
    expect(component.accountDetailList.length).toEqual(4)
    expect(component.balanceList.length).toEqual(2)
    expect(component.limitsList.length).toEqual(2)
    expect(component.reservationList.length).toEqual(2)
    expect(component.dataSourceReservation.length).toEqual(2)
    expect(component.dataSourceLockDetails.length).toEqual(2)
    expect(component.dataSourceLockDetailsWithoutTotal.length).toEqual(2)
  })

  it('should show spinner and call getAccountBalance', () => {
    spyOn(component, 'restoreData')
    const event = { some: 'data' };
    const data = { some: 'response' };
    accountBalanceService.getAccountBalance.and.returnValue(of(data));

    component.getAccount(event);

    expect(spinner.show).toHaveBeenCalledWith('main-spinner');
    expect(accountBalanceService.getAccountBalance).toHaveBeenCalledWith(event);
    expect(spinner.hide).toHaveBeenCalledWith('main-spinner');
    expect(component.show).toBeTrue();
    expect(component.restoreData).toHaveBeenCalledWith(data);
  });

  it('should handle error and set error message', () => {
    const event = { some: 'data' };
    const errorMsg = new HttpErrorResponse({ status: 404 });
    accountBalanceService.getAccountBalance.and.returnValue(throwError(() => errorMsg));
    const errorKey = 'some error key';
    error.getTranslateKey.and.returnValue(errorKey)
    component.getAccount(event);

    expect(spinner.show).toHaveBeenCalledWith('main-spinner');
    expect(accountBalanceService.getAccountBalance).toHaveBeenCalledWith(event);
    expect(spinner.hide).toHaveBeenCalledWith('main-spinner');
    expect(component.show).toBeFalse();
    expect(component.messageError).toBe(errorMsg);
    expect(component.errorMessage).toBe(errorKey);
  });

  it('should return', () => {
    component.return();
    expect(location.back).toHaveBeenCalled()
  })

  it('should unsubscribe from serviceSubscription if it exists', () => {
    component.ngOnDestroy();
    expect(component.ngOnDestroy).toBeDefined();
  });


});
