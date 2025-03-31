import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfAlertComponent, AdfButtonComponent } from '@adf/components';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorMessageService } from 'src/app/service/shared/error-message.service';
import { StatementsService } from 'src/app/service/shared/statements.service';
import { TokenizerAccountsService } from 'src/app/service/token/tokenizer-accounts.service';
import { MockTranslatePipe } from 'src/assets/mocks/public/tranlatePipeMock';
import { mockObservable, mockPromise } from 'src/assets/testing';
import { CheckStatementFilterModalComponent } from './check-statement-filter-modal.component';

describe('CheckStatementFilterModalComponent', () => {
  let component: CheckStatementFilterModalComponent;
  let fixture: ComponentFixture<CheckStatementFilterModalComponent>;

  let ngbCalendar: jasmine.SpyObj<NgbCalendar>;
  let ngbActiveModal: jasmine.SpyObj<NgbActiveModal>;
  let translateService: jasmine.SpyObj<TranslateService>;
  let statementsService: jasmine.SpyObj<StatementsService>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(async () => {
    const ngbCalendarSpy = jasmine.createSpyObj('NgbCalendar', ['getToday', 'getPrev']);
    const ngbActiveModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close', 'dismiss']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['currentLang', 'defaultLang']);
    const statementsServiceSpy = jasmine.createSpyObj('StatementsService', ['getData']);
    const errorSpy = jasmine.createSpyObj('ErrorMessageService', ['getTranslateKey']);
    const tokenizerEncryptSpy = jasmine.createSpyObj('TokenizerAccountsService', ['tokenizer']);
    const ngbDateParseFormatterSpy = jasmine.createSpyObj('NgbDateParserFormatter', ['parse']);
    const cdSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    await TestBed.configureTestingModule({
      declarations: [AdfAlertComponent, CheckStatementFilterModalComponent, MockTranslatePipe, AdfButtonComponent],
      providers: [
        { provide: NgbCalendar, useValue: ngbCalendarSpy },
        { provide: NgbActiveModal, useValue: ngbActiveModalSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: StatementsService, useValue: statementsServiceSpy },
        { provide: ErrorMessageService, useValue: errorSpy },
        { provide: TokenizerAccountsService, useValue: tokenizerEncryptSpy },
        { provide: NgbDateParserFormatter, useValue: ngbDateParseFormatterSpy },
        { provide: ChangeDetectorRef, useValue: cdSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        FormsModule,
        ReactiveFormsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckStatementFilterModalComponent);
    component = fixture.componentInstance;

    ngbCalendar = TestBed.inject(NgbCalendar) as jasmine.SpyObj<NgbCalendar>;
    ngbActiveModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
    translateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    statementsService = TestBed.inject(StatementsService) as jasmine.SpyObj<StatementsService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;

    ngbCalendar.getToday.and.returnValue(new NgbDate(2023, 12, 24));
    ngbCalendar.getPrev.and.returnValue(new NgbDate(2023, 12, 24));

    translateService.currentLang = 'es';
    translateService.defaultLang = 'es';

    component.type = 'month';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select Month', () => {
    component.selectMonth(12);
    expect(component.selectedMonth).toEqual(12);
  });

  it('should serch when type = custom', () => {
    component.form.patchValue({
      startDate: { year: 2021, month: 8, day: 1 },
      endDate: { year: 2021, month: 8, day: 31 },
      minValue: 0,
      maxValue: 100,
    });
    fixture.detectChanges();
    component.type = 'custom';
    spinner.show.and.returnValue(mockPromise(true));

    statementsService.getData.and.returnValue(
      mockObservable({
        operations: [],
      })
    );

    component.search();

    expect(ngbActiveModal.close).toHaveBeenCalled();
  });

  it('should serch when type = day', () => {
    const control = new FormControl('valor inicial');

    component.dateByDayPicker = control;

    fixture.detectChanges();

    component.dateByDayPicker.patchValue({ year: 2021, month: 8, day: 1 });

    component.form.patchValue({
      startDate: { year: 2021, month: 8, day: 1 },
      endDate: { year: 2021, month: 8, day: 31 },
      minValue: 0,
      maxValue: 100,
    });
    fixture.detectChanges();
    component.type = 'day';
    spinner.show.and.returnValue(mockPromise(true));

    statementsService.getData.and.returnValue(
      mockObservable({
        operations: [],
      })
    );

    component.search();
  });

  it('should serch when type = month', () => {
    const control = new FormControl('valor inicial');

    component.dateByDayPicker = control;

    fixture.detectChanges();

    component.dateByDayPicker.patchValue({ year: 2021, month: 8, day: 1 });

    component.form.patchValue({
      startDate: { year: 2021, month: 8, day: 1 },
      endDate: { year: 2021, month: 8, day: 31 },
      minValue: 0,
      maxValue: 100,
    });
    fixture.detectChanges();
    component.type = 'month';
    component.selectedMonth = {
      value: {
        year: 2023,
        month: 6,
      },
    };
    spinner.show.and.returnValue(mockPromise(true));

    statementsService.getData.and.returnValue(
      mockObservable({
        operations: [],
      })
    );

    component.search();
    expect(ngbActiveModal.close).toHaveBeenCalled();
  });

  // Tests that messageError is set to the error message when an error object with a code property is passed
  it('test_error_object_with_code', () => {
    spinner.hide.and.returnValue(mockPromise(true));
    const error = { code: 'error code', message: 'error message' };
    component.handleErrorFromData(error as any);
    expect(component.messageError).toEqual(error.message);
  });

  it('should dismiss modal', () => {
    component.close();
    expect(ngbActiveModal.dismiss).toHaveBeenCalled();
  });
});
