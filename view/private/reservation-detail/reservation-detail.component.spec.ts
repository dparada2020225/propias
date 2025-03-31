import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateFakeLoader, TranslateLoader, TranslateModule, TranslatePipe} from '@ngx-translate/core';
import {ReservationDetailPrintService} from 'src/app/service/prints/reservation-detail-print.service';
import {AccountBalanceService} from 'src/app/service/private/account-balance/account-balance.service';
import {ErrorMessageService} from 'src/app/service/shared/error-message.service';
import {clickElement, getText, mockObservable, mockObservableError} from '../../../../assets/testing';
import {ReservationDetailComponent} from './reservation-detail.component';

xdescribe('ReservationDetailComponent', () => {
  let component: ReservationDetailComponent;
  let fixture: ComponentFixture<ReservationDetailComponent>;

  let accountService: jasmine.SpyObj<AccountBalanceService>;
  let pdf: jasmine.SpyObj<ReservationDetailPrintService>;
  let error: jasmine.SpyObj<ErrorMessageService>;

  beforeEach(async () => {

    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close'])
    const accountServiceSpy = jasmine.createSpyObj('AccountBalanceService', ['getDetailReservation'])
    const pdfSpy = jasmine.createSpyObj('ReservationDetailPrintService', ['pdfGenerate'])
    const errorSpy = jasmine.createSpyObj('ErrorMessageService', ['getTranslateKey'])

    await TestBed.configureTestingModule({
      declarations: [ReservationDetailComponent, TranslatePipe],
      providers: [
        {provide: NgbActiveModal, useValue: activeModalSpy},
        {provide: AccountBalanceService, useValue: accountServiceSpy},
        {provide: ReservationDetailPrintService, useValue: pdfSpy},
        {provide: ErrorMessageService, useValue: errorSpy},
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReservationDetailComponent);
    component = fixture.componentInstance;

    accountService = TestBed.inject(AccountBalanceService) as jasmine.SpyObj<AccountBalanceService>;
    pdf = TestBed.inject(ReservationDetailPrintService) as jasmine.SpyObj<ReservationDetailPrintService>;
    error = TestBed.inject(ErrorMessageService) as jasmine.SpyObj<ErrorMessageService>;

    accountService.getDetailReservation.and.returnValue(mockObservable({
      ref: '12345',
      mask: '1234567890',
      name: 'Test Account',
      type: 'Checking',
      currency: 'USD',
      movement: [
        {amount: 100, date: '2021-01-01'},
        {amount: -50, date: '2021-01-02'}
      ],
      total: 50
    }))

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get detail reservation but have error http', () => {
    const msgError = {error: 'not implemented'}
    error.getTranslateKey.and.returnValue('404')
    accountService.getDetailReservation.and.returnValue(mockObservableError(msgError))
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.messageError).toEqual(msgError)
    expect(component.errorMessage).toEqual('404')
  })

  it('should download Pdf', () => {
    clickElement(fixture, 'adf-button.txt-btn-yellow')
    fixture.detectChanges();
    expect(pdf.pdfGenerate).toHaveBeenCalled()
  })

  it('should show <h1>details-reserve</h1>', () => {
    const titleText = getText(fixture, 'title');
    fixture.detectChanges()
    expect(titleText).toEqual('details-reserve')
  })

  it('should set aliasName in html', () => {
    const expectAlias = 'VCONTRERAS2'
    component.aliasName = expectAlias;
    fixture.detectChanges()
    const html = getText(fixture, 'sub-title')
    expect(html).toEqual(` ${expectAlias} Test Account `)
  })

});
