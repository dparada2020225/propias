import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpStatusCode } from 'src/app/enums/http-status-code.enum';
import { EProfile } from 'src/app/enums/profile.enum';
import { IIsSchedule } from 'src/app/models/isSchedule.interface';
import { mockModal } from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import { mockPromise } from 'src/assets/testing';
import { MenuService } from '../shared/menu.service';
import { UtilService } from './util.service';
import { ValidationTriggerTimeService } from './validation-trigger-time.service';

describe('ValidationTriggerTimeService', () => {
  let service: ValidationTriggerTimeService;

  let modalService: jasmine.SpyObj<NgbModal>;
  let router: jasmine.SpyObj<Router>;
  let util: jasmine.SpyObj<UtilService>;

  beforeEach(() => {

    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [''])
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const utilSpy = jasmine.createSpyObj('UtilService', ['alertScheduleServiceLayout'])
    const menuServiceSpy = jasmine.createSpyObj('MenuService', ['validatorSchedule'])

    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: UtilService, useValue: utilSpy },
        { provide: MenuService, useValue: menuServiceSpy },
      ]
    });
    service = TestBed.inject(ValidationTriggerTimeService);
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should is Available Schedule', () => {
    expect(service.isAvailableSchedule).toBeFalsy();
  })

  it('should validate', fakeAsync(() => {
    router.navigate.and.returnValue(mockPromise(true));
    modalService.open.and.returnValue(mockModal as NgbModalRef)
    const profile = EProfile.SALVADOR;
    const schedule: IIsSchedule = {
      schedule: {
        finalDate: '2030',
        initialDate: '2023'
      },
      isSchedule: true
    }

    service.validate(profile, schedule);
    tick()
    expect(router.navigate).toHaveBeenCalledWith(['/home'])
  }))

  it('should validate have error', fakeAsync(() => {
    const mockData = { error: true, status: HttpStatusCode.INVALID_TOKEN, message: 'error token' };
    router.navigate.and.returnValue(mockPromise(true));
    modalService.open.and.returnValue(mockModal as NgbModalRef)
    const profile = EProfile.SALVADOR;

    service.validate(profile, mockData as any);
    tick()
    expect(util.alertScheduleServiceLayout).toHaveBeenCalledWith('error token')
    expect(router.navigate).toHaveBeenCalledWith(['/home'])
  }))

});
