import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { CustomDatepickerI18n } from "./custom-datepicker-i18n.provider";


describe('CustomDatepickerI18n', () => {
    let datepickerI18n: CustomDatepickerI18n;
    let translateServiceMock: jasmine.SpyObj<TranslateService>;

    beforeEach(() => {
        translateServiceMock = jasmine.createSpyObj('TranslateService', ['instant']);
        datepickerI18n = new CustomDatepickerI18n(translateServiceMock);
    });

    it('should return translated weekday short name', () => {
        const weekday = 1; // Monday
        const translatedWeekday = 'Translated Monday';
        translateServiceMock.instant.and.returnValue(translatedWeekday);

        const result = datepickerI18n.getWeekdayShortName(weekday);

        expect(result).toBe(translatedWeekday);
        expect(translateServiceMock.instant).toHaveBeenCalledWith('date.monday');
    });

    it('should return translated month short name', () => {
        const month = 1; // January
        const translatedMonth = 'Translated January';
        translateServiceMock.instant.and.returnValue(translatedMonth);

        const result = datepickerI18n.getMonthShortName(month);

        expect(result).toBe(translatedMonth);
        expect(translateServiceMock.instant).toHaveBeenCalledWith('month.january');
    });

    it('should return translated month full name', () => {
        const month = 1; // January
        const translatedMonth = 'Translated January';
        translateServiceMock.instant.and.returnValue(translatedMonth);

        const result = datepickerI18n.getMonthFullName(month);

        expect(result).toBe(translatedMonth);
        expect(translateServiceMock.instant).toHaveBeenCalledWith('month.january');
    });

    it('should return formatted ARIA label for the date', () => {
        const date: NgbDateStruct = { day: 25, month: 6, year: 2023 };
        const expectedAriaLabel = '25-6-2023';

        const result = datepickerI18n.getDayAriaLabel(date);

        expect(result).toBe(expectedAriaLabel);
    });
});