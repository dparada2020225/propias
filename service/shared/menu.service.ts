import { AdfFormatService, IObjectFormat } from '@adf/components';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { IIsSchedule } from '../../models/isSchedule.interface';

/**
 * @author Fabian Serrano
 * @date 26/03/21
 *
 */
@Injectable({
  providedIn: 'root'
})
export class MenuService {

  public errorLoggingEvent: EventEmitter<any> = new EventEmitter();
  public menuLoadEvent: EventEmitter<any> = new EventEmitter();

  private clipInfo = new Subject<boolean>();
  private clipInfo$ = this.clipInfo.asObservable();

  constructor(
    private httpClient: HttpClient,
    private adfFormatService: AdfFormatService
  ) { }

  notifyErrorToLogin(message: string) {
    this.errorLoggingEvent.emit(message);
  }

  notifyMenuLoaded(menu) {
    this.menuLoadEvent.emit(menu);
  }

  getMenu(): Observable<any> {
    return this.httpClient.get('/v1/agreement/agreement/menu', { observe: 'response' });
  }

  getSchedule(serviceName: string): Observable<IIsSchedule> {
    return this.httpClient.get<IIsSchedule>(`/v1/agreement/agreement/schedule/${serviceName}`);
  }

  closeMenuHandler(): Observable<boolean> {
    return this.clipInfo$;
  }

  closeMenu(value: boolean) {
    this.clipInfo.next(value);
  }


  parsedDate(date: IObjectFormat) {
    const day = ('0' + date.day).slice(-2)
    const month = ('0' + date.month).slice(-2)
    const hour = ('0' + date.hour).slice(-2);
    const minutes = ('0' + date.minute).slice(-2);
    const seconds = ('0' + date.second).slice(-2);

    return `${date.year}-${month}-${day} ${hour}:${minutes}:${seconds}`
  }

  getCurrentDateTimeByCountry(offset: number) {
    const now = new Date()

    const localeTime = now.getTime();
    const localeOffset = now.getTimezoneOffset() * 60000;
    const utc = localeTime + localeOffset;
    const country = utc + (3600000 * offset)

    const countryTimeNow = new Date(country)

    return {
      date: countryTimeNow.toLocaleDateString(),
      time: countryTimeNow.toLocaleTimeString(),
      formatted: moment(countryTimeNow).format('YYYY-MM-DD HH:mm:ss')
    };
  }

  validatorSchedule(schedule: IIsSchedule, utc: number = -5): boolean {

    if (!schedule?.schedule.hasOwnProperty('initialDate') || !schedule?.schedule.hasOwnProperty('finalDate')) { return true; }

    const nowDate = this.getCurrentDateTimeByCountry(utc).formatted;

    const validateInitialDate = this.adfFormatService.getFormatDateTime(schedule.schedule.initialDate).object;
    const validateFinalDate = this.adfFormatService.getFormatDateTime(schedule.schedule.finalDate).object;

    const initialDate = this.parsedDate(validateInitialDate);
    const finalDate = this.parsedDate(validateFinalDate);

    if (moment(nowDate).isBefore(initialDate)) return false;

    if (moment(nowDate).isAfter(finalDate)) return false;

    return true;
  }

}
