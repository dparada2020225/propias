import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {
  NgbActiveModal,
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDatepickerI18n
} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import moment from 'moment';
import {throwError} from "rxjs";
import {catchError, finalize} from 'rxjs/operators';
import {EInputType, MaskOptionsBuilder} from '@adf/components';
import {ErrorMessageService} from 'src/app/service/shared/error-message.service';
import {TokenizerAccountsService} from 'src/app/service/token/tokenizer-accounts.service';
import {CustomDateParserFormatter} from '../../../../providers/custom-date-parse.formatter';
import {CustomDatepickerI18n} from '../../../../providers/custom-datepicker-i18n.provider';
import {StatementsService} from 'src/app/service/shared/statements.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpErrorResponse} from '@angular/common/http';

/**
 * @author Sebastian Chicoma S.
 *
 * Componente utilizado para el modal de filtros de la pantalla Estado de cuentas (Cheques)
 */
@Component({
  selector: 'byte-check-statement-filter-modal',
  templateUrl: './check-statement-filter-modal.component.html',
  styleUrls: ['./check-statement-filter-modal.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }
  ]
})
export class CheckStatementFilterModalComponent implements OnInit, AfterViewInit {

  @ViewChild('dateByDayPicker')
  dateByDayPicker!: FormControl;

  @Input()
  type!: string;

  @Input()
  account!: string;

  @Input()
  movementType!: string;

  typeNumber:EInputType = EInputType.NUMBER;
  dateByDay: NgbDate | undefined = undefined;
  form: FormGroup;
  messageError!: string ;
  months: Array<any> = [];
  selectedMonth: any;
  submitted = false;
  isLoading = false;
  imaskOption = new MaskOptionsBuilder()
    .mask({
      mask: Number,
      scale: 2,
      max: 999999999.99,
      radix: '.'
    }
    ).build()

  get endDateForm() {
    return this.form.controls['endDate'] as FormControl;
  }

  get startDateForm() {
    return this.form.controls['startDate'] as FormControl;
  }


  get dateByDayPickerForm(): FormControl {
    return this.dateByDayPicker;
  }

  constructor(
    private ngbCalendar: NgbCalendar,
    private ngbActiveModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private statementsService: StatementsService,
    private error: ErrorMessageService,
    private tokenizerEncrypt: TokenizerAccountsService,
    private ngbDateParseFormatter: NgbDateParserFormatter,
    private cd: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
  ) {

    this.form = this.formBuilder.group({
      startDate: new FormControl(null, [Validators.required]),
      endDate: [null, Validators.required],
      minValue: ['', null],
      maxValue: ['', null]
    });

  }

  ngOnInit(): void {
    const today = this.ngbCalendar.getToday();
    this.dateByDay = today;

    const date = moment({ year: this.dateByDay.year, month: this.dateByDay.month - 1, day: this.dateByDay.day });
    const startDate = moment(date).format('DD/MM/YYYY');
    const endDate = moment(date).format('DD/MM/YYYY');
    this.form.patchValue({
      startDate: this.ngbDateParseFormatter.parse(startDate),
      endDate: this.ngbDateParseFormatter.parse(endDate)
    });
    if (this.type === 'month') {
      let count = 6;

      while (count > 0) {
        const dateTmp = this.ngbCalendar.getPrev(today, 'm', --count);

        const monthText = moment({ year: dateTmp.year, month: dateTmp.month - 1, day: dateTmp.day })
          .locale(this.translateService.currentLang || this.translateService.defaultLang)
          .format('MMMM, YYYY');

        this.months.push({
          text: monthText.charAt(0).toUpperCase() + monthText.substring(1),
          value: {
            month: dateTmp.month,
            year: dateTmp.year
          }
        });
      }
    }

  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  selectMonth(month) {
    this.selectedMonth = month;
  }

  private validateByCustomType() {
    if ((this.form.value.minValue == '' && this.form.value.minValue >= 0 && this.form.value.minValue <= 999999999.99)
      || (this.form.value.maxValue == '' && this.form.value.maxValue >= 0 && this.form.value.maxValue <= 999999999.99)) {

      this.messageError = 'message.error.range.invalid'
      return false;
    }

    return true;
  }

  private validateByDayType(): object | boolean {
    let initialDate: string | undefined = undefined;
    let finalDate: string | undefined = undefined;

    if (this.dateByDayPicker.valid) {

      const day = moment({ year: this.dateByDay!.year, month: (this.dateByDay!.month ?? 0) - 1, day: this.dateByDay!.day });
      const now = moment();
      if (day > now) {
        this.messageError = 'message.error.date-day.invalid';
        return false;
      }
      initialDate = moment(day).format('DDMMYYYY');
      finalDate = moment(day).format('DDMMYYYY');
      return { initialDate, finalDate }
    } else {
      return false;
    }
  }

  private validateByMonthType() {
    if (this.selectedMonth) {

      const month = moment({ year: this.selectedMonth.value.year, month: this.selectedMonth.value.month - 1 })

      const initialDate = month.startOf('month').format('DDMMYYYY');
      const finalDate = month.endOf('month').format('DDMMYYYY');

      return { initialDate, finalDate };
    }

    return false;
  }

  private validateByDefaultType() {
    this.messageError = '';

    this.form.controls['startDate'].updateValueAndValidity();
    this.form.controls['endDate'].updateValueAndValidity();

    if (this.form.valid) {

      const startDate = this.form.value.startDate;
      const endDate = this.form.value.endDate;
      let minimumRange = this.form.value.minValue;
      let maximumRange = this.form.value.maxValue;

      let initialDate = moment({ year: startDate.year, month: startDate.month - 1, day: startDate.day }).format('DDMMYYYY');
      let finalDate = moment({ year: endDate.year, month: endDate.month - 1, day: endDate.day }).format('DDMMYYYY');

      if (startDate.month !== endDate.month) {
        this.messageError = 'message.error.date.range';
        return false;
      }

      return { initialDate, finalDate, minimumRange, maximumRange };

    } else {
      if ((this.form.controls['startDate'].errors && this.form.controls['startDate'].errors['ngbDate'])
        || (this.form.controls['endDate'].errors && this.form.controls['endDate'].errors['ngbDate'])) {
        this.messageError = 'message.error.date.detail';

        if ((this.form.controls['startDate'].errors && this.form.controls['startDate'].errors['ngbDate'].requiredAfter)
          || (this.form.controls['endDate'].errors && this.form.controls['endDate'].errors['ngbDate'].requiredBefore)) {
          this.messageError = 'message.error.date.invalid';
        }
      }

      return false;
    }
  }



  search() {
    this.submitted = true;
    let initialDate = undefined;
    let finalDate = undefined;
    let minimumRange = 0;
    let maximumRange = 0;

    let valid = false;

    if ('custom' === this.type) {
      valid = this.validateByCustomType();
    }

    let validObject: any;

    if ('day' === this.type) {
      validObject = this.validateByDayType();
    } else if ('month' === this.type) {
      validObject = this.validateByMonthType();
    } else {
      validObject = this.validateByDefaultType();
      valid = !!this.validateByDefaultType();
    }

    if (validObject) {
      ({ initialDate, finalDate, minimumRange, maximumRange } = validObject);
      valid = true;
    }

    if (Number(minimumRange) > Number(maximumRange)) {
      valid = false;
      this.messageError = 'error:range_exceded';
    }

    if (!valid) {
      return;
    }

    this.handleGetData({
      initialDate,
      finalDate,
      minimumRange,
      maximumRange
    });
  }

  handleGetData(parameters: any) {
    const { initialDate, finalDate, minimumRange, maximumRange } = parameters;

    const params: any = {
      account: this.tokenizerEncrypt.tokenizer(this.account),
      initialDate: initialDate,
      finalDate: finalDate,
      minimumRange: minimumRange,
      maximumRange: maximumRange,
    };

    if (this.movementType !== 'A') {
      params.mnemonic = this.movementType;
    }
    this.isLoading = true;
    this.spinner.show('main-spinner').then(() => {});

    this.statementsService.getData(params)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.handleErrorFromData(error);
          return throwError(() => error);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (result: any) => {
          if (!result.operations) {
            result.operations = [];
          }

          const resultWithFilters: any = {};
          params.minValue = this.form.value.minValue;
          params.maxValue = this.form.value.maxValue;

          resultWithFilters.filters = params;
          resultWithFilters.filters.type = this.type;
          resultWithFilters.data = result;

          if (result.operations.length > 2500) {
            this.messageError = 'message.statements.error.maximum-records';
            return;
          }

          this.ngbActiveModal.close(resultWithFilters);
        }
      })
  }

  handleErrorFromData(error: HttpErrorResponse) {
    this.spinner.hide('main-spinner').then(() => {});

    if (error && !error.hasOwnProperty('code')) {
      this.messageError = this.error.getTranslateKey(error);

      if (!this.messageError || this.messageError === 'error.http.undefined') {
        this.messageError = 'message.statements.error.no-records';
      }
    }

    if (error.hasOwnProperty('code')) {
      this.messageError = error.message;
    }
  }

  close() {
    this.ngbActiveModal.dismiss();
  }
}
