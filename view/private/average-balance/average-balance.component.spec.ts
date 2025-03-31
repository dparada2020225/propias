import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageBalanceComponent } from './average-balance.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountBalanceService } from 'src/app/service/private/account-balance/account-balance.service';
import { ErrorMessageService } from 'src/app/service/shared/error-message.service';
import { AverageBalancePrintService } from 'src/app/service/prints/average-balance-print.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { accountBalanceObjectMock } from 'src/assets/mocks/modules/private/account-balance.mock';
import { AdfButtonComponent } from '@adf/components';
import { HttpErrorResponse } from '@angular/common/http';
import { By } from '@angular/platform-browser';

describe('AverageBalanceComponent', () => {
  let component: AverageBalanceComponent;
  let fixture: ComponentFixture<AverageBalanceComponent>;

  let accountService: jasmine.SpyObj<AccountBalanceService>
  let error: jasmine.SpyObj<ErrorMessageService>
  let pdf: jasmine.SpyObj<AverageBalancePrintService>
  let spinner: jasmine.SpyObj<NgxSpinnerService>

  beforeEach(async () => {

    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close'])
    const accountServiceSpy = jasmine.createSpyObj('AccountBalanceService', ['getAccountBalance'])
    const errorSpy = jasmine.createSpyObj('ErrorMessageService', ['getTranslateKey'])
    const pdfSpy = jasmine.createSpyObj('AverageBalancePrintService', ['pdfGenerate'])
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['hide'])

    await TestBed.configureTestingModule({
      declarations: [AverageBalanceComponent, TranslatePipe, AdfButtonComponent],
      providers: [
        AverageBalanceComponent,
        { provide: NgbActiveModal, useValue: activeModalSpy },
        { provide: AccountBalanceService, useValue: accountServiceSpy },
        { provide: ErrorMessageService, useValue: errorSpy },
        { provide: AverageBalancePrintService, useValue: pdfSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AverageBalanceComponent);
    component = fixture.componentInstance;

    accountService = TestBed.inject(AccountBalanceService) as jasmine.SpyObj<AccountBalanceService>;
    error = TestBed.inject(ErrorMessageService) as jasmine.SpyObj<ErrorMessageService>;
    pdf = TestBed.inject(AverageBalancePrintService) as jasmine.SpyObj<AverageBalancePrintService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;

    accountService.getAccountBalance.and.returnValue(of(accountBalanceObjectMock))

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should accountService getAccountBalance response success', () => {
    fixture.detectChanges();
    expect(spinner.hide).toHaveBeenCalled();
    expect(component.authorization).toEqual('123')
    expect(component.currencySymbol).toEqual('$')
  })

  it('should accountService getAccountBalance response error', () => {
    const errorMsg = new HttpErrorResponse({ status: 404 });
    accountService.getAccountBalance.and.returnValue(throwError(() => errorMsg));
    const errorKey = 'some error key';
    error.getTranslateKey.and.returnValue(errorKey)
    fixture.detectChanges();
    component.ngOnInit()
    expect(component.messageError).toEqual(errorMsg)
    expect(component.errorMessage).toEqual(errorKey)
  })

  it('should on Click downloadPdf', () => {
    const btnDebug = fixture.debugElement.query(By.css('adf-button.txt-btn-yellow'));
    btnDebug.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(pdf.pdfGenerate).toHaveBeenCalled();
  })

});
