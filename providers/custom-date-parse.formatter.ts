import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';

/**
 * @author Sebastian Chicoma S.
 * 
 *  Formatter personalizado para el componente adf-datepicker (ngbdatepicker) 
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

    readonly DELIMITER = '/';

    parse(value: string): NgbDateStruct {
        let ngbDate: any = null;
        if (value) {
            let date = moment(value, 'DD/MM/YYYY');

            if (date.isValid()) {
                ngbDate = {
                    day: date.date(),
                    month: date.month() + 1,
                    year: date.year()
                }
            }

        }

        return ngbDate;
    }

    format(date: NgbDateStruct): string {
        let formatDate = '';

        if (date) {
            const day = this.pad(date.day.toString());
            const month = this.pad(date.month.toString());

            formatDate = `${day}${this.DELIMITER}${month}${this.DELIMITER}${date.year}`;
        }

        return formatDate;
    }

    private pad(number) {
        while (number.length < 2) { number = "0" + number; }
        return number;
    }

}
