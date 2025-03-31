import { TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { mockObservable, mockObservableError } from 'src/assets/testing';
import { IIsSchedule } from '../models/isSchedule.interface';
import { MenuService } from '../service/shared/menu.service';
import { ScheduleServiceResolver } from './schedule-service.resolver';

describe('ScheduleServiceResolver', () => {
  let resolver: ScheduleServiceResolver;
  let menuServices: jasmine.SpyObj<MenuService>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(() => {

    const menuServicesSpy = jasmine.createSpyObj('MenuService', ['getSchedule'])
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show'])
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [''])

    TestBed.configureTestingModule({
      providers: [
        { provide: MenuService, useValue: menuServicesSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ]
    });
    resolver = TestBed.inject(ScheduleServiceResolver);
    menuServices = TestBed.inject(MenuService) as jasmine.SpyObj<MenuService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should Schedule Service Resolver response IIsSchedule', () => {
    const data: IIsSchedule = {
      isSchedule: true,
      schedule: {
        initialDate: '2015',
        finalDate: '2030'
      }
    }
    menuServices.getSchedule.and.returnValue(mockObservable(data));
    resolver.resolve({ data: { service: true } } as any).subscribe({
      next: (response) => {
        expect(spinner.show).toHaveBeenCalled();
        expect(response).toEqual(data)
      },
      error: (err) => {
        expect(err).toBeUndefined();
      }
    })
  })

  it('should Schedule Service Resolver but response error', () => {
    const data = {
      status: 500,
      error: 'error'
    }
    menuServices.getSchedule.and.returnValue(mockObservableError(data));
    resolver.resolve({ data: { service: true } } as any).subscribe({
      next: (response) => {
        expect(spinner.show).toHaveBeenCalled();
        expect(response['message']).toEqual('error_getting_trigger_time')
      },
      error: (err) => {
        expect(err).toEqual(data)
      }
    })
  })

});
