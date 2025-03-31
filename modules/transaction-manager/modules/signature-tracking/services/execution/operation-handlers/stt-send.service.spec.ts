import {fakeAsync, TestBed, tick} from '@angular/core/testing';

import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {of} from 'rxjs';
import {
  iMultipleRequestResponseMock
} from '../../../../../../../../assets/mocks/modules/signature-tracking/mocksDetailTransaction';
import {SignatureTrackingService} from '../../transaction/signature-tracking.service';
import {SttSendService} from './stt-send.service';

describe('SttSendService', () => {
  let service: SttSendService;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let transactionService: jasmine.SpyObj<SignatureTrackingService>;
  let router: jasmine.SpyObj<Router>;
  let httpController: HttpTestingController;

  beforeEach(() => {
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['hide']);
    const transactionServiceSpy = jasmine.createSpyObj('SignatureTrackingService', ['send']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: SignatureTrackingService, useValue: transactionServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });

    httpController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    transactionService = TestBed.inject(SignatureTrackingService) as jasmine.SpyObj<SignatureTrackingService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    service = TestBed.inject(SttSendService);

    transactionService.send.and.returnValue(of(iMultipleRequestResponseMock));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  xit('should execute send succesfully', fakeAsync(() => {
    router.navigate.and.returnValue(Promise.resolve(true));
    //service.sendExecute(iDeletePropertiesMock);
    tick(4000);
    expect(transactionService.send).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/transaction-manager-payroll/signature-tracking']);
  }));
});
