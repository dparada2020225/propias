import { TestBed } from '@angular/core/testing';

import { AdfFormatService, IObjectFormat } from '@adf/components';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IIsSchedule } from 'src/app/models/isSchedule.interface';
import { MenuService } from './menu.service';

describe('MenuService', () => {
  let service: MenuService;

  let adfFormatService: jasmine.SpyObj<AdfFormatService>;
  let httpController: HttpTestingController;


  beforeEach(() => {

    const adfFormatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['getFormatDateTime'])

    TestBed.configureTestingModule({
      providers: [
        { provide: AdfFormatService, useValue: adfFormatServiceSpy },
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(MenuService);
    httpController = TestBed.inject(HttpTestingController);
    adfFormatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit notify Error To Login', () => {
    const msg = 'hola'
    spyOn(service.errorLoggingEvent, 'emit')
    service.notifyErrorToLogin(msg);
    expect(service.errorLoggingEvent.emit).toHaveBeenCalledWith(msg);
  })

  it('should emit notify Menu Loaded', () => {
    const msg = 'hola'
    spyOn(service.menuLoadEvent, 'emit')
    service.notifyMenuLoaded(msg);
    expect(service.menuLoadEvent.emit).toHaveBeenCalledWith(msg);
  })

  it('should get menu', () => {
    const dataMock = 'hola'

    service.getMenu().subscribe((data) => {
      expect(data.body).toEqual(dataMock)
    })

    const url = '/v1/agreement/agreement/menu'
    const req = httpController.expectOne(url)
    req.flush(dataMock)
    expect(req.request.method).toEqual('GET')
  })

  it('shoould get Schedule', () => {

    const dto: string = 'transfer'
    const dataMock: IIsSchedule = {
      isSchedule: true,
      schedule: {
        finalDate: '2023',
        initialDate: '2022'
      }
    }

    service.getSchedule(dto).subscribe((data) => {
      expect(data).toEqual(dataMock)
    })

    const url = `/v1/agreement/agreement/schedule/${dto}`
    const req = httpController.expectOne(url)
    req.flush(dataMock)
    expect(req.request.method).toEqual('GET')
  })

  it('should close Menu Handler', () => {
    expect(service.closeMenuHandler()).toBeDefined()
  })

  it('should return a formatted date string', () => {
    const date: IObjectFormat = {
      year: 2022,
      month: 1,
      day: 1,
      hour: 1,
      minute: 1,
      second: 1
    };
    expect(service.parsedDate(date)).toEqual('2022-01-01 01:01:01');
  });

  it('should return the current date and time for a given country', () => {
    const offset = 2; // UTC+2
    const result = service.getCurrentDateTimeByCountry(offset);
    expect(result.date).toBeDefined();
    expect(result.time).toBeDefined();
    expect(result.formatted).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
  });

  describe('validatorSchedule', () => {
    it('should return true if the schedule object does not have initialDate or finalDate properties', () => {
      const schedule = { schedule: {} };
      expect(service.validatorSchedule(schedule as any)).toBe(true);
    });

    it('should return false if the current date is after the final date', () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const schedule = { schedule: { initialDate: yesterday, finalDate: yesterday } };
      spyOn(service, 'getCurrentDateTimeByCountry').and.returnValue({ formatted: now.toISOString() } as any);
      adfFormatService.getFormatDateTime.and.returnValue({ object: { year: yesterday.getFullYear(), month: yesterday.getMonth() + 1, day: yesterday.getDate(), hour: yesterday.getHours(), minute: yesterday.getMinutes(), second: yesterday.getSeconds() } } as any);
      expect(service.validatorSchedule(schedule as any)).toBe(false);
    });
  });


});
