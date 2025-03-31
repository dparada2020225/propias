import { Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

const I18N_VALUES = {
    //weekdays: ['date.monday', 'date.tuesday', 'date.wednesday', 'date.thursday', 'date.friday', 'date.saturday', 'date.december'],
    weekdays: ['date.monday', 'date.tuesday', 'date.wednesday', 'date.thursday', 'date.friday', 'date.saturday', 'date.sunday'],
    months: [
        'month.january', 'month.february', 'month.march', 'month.april', 'month.may', 'month.june',
        'month.july', 'month.august', 'month.september', 'month.october', 'month.november', 'month.december'
    ],
};

/**
 * @author Sebastian Chicoma S.
 * 
 *  Clase utilizada por el componente adf-datepicker (ngbdatepicker) para los labels de meses y días
 */
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

    constructor(private translateService: TranslateService) {
        super();
    }

    getWeekdayShortName(weekday: number): string {
        return this.translateService.instant(I18N_VALUES.weekdays[weekday - 1]);
    }
    getMonthShortName(month: number): string {
        return this.translateService.instant(I18N_VALUES.months[month - 1]);
    }
    getMonthFullName(month: number): string {
        return this.getMonthShortName(month);
    }

    getDayAriaLabel(date: NgbDateStruct): string {
        return `${date.day}-${date.month}-${date.year}`;
    }
}
