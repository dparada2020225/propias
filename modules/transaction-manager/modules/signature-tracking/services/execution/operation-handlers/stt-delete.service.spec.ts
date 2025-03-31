import {fakeAsync, TestBed, tick} from '@angular/core/testing';

import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {of} from 'rxjs';
import {
  asyncError,
  iMultipleRequestResponseMock,
} from '../../../../../../../../assets/mocks/modules/signature-tracking/mocksDetailTransaction';
import {SignatureTrackingService} from '../../transaction/signature-tracking.service';
import {SttDeleteService} from './stt-delete.service';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";

describe('SttDeleteService', () => {
  let service: SttDeleteService;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let transactionService: jasmine.SpyObj<SignatureTrackingService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['hide']);
    const transactionServiceSpy = jasmine.createSpyObj('SignatureTrackingService', ['delete']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        SttDeleteService,
        SignatureTrackingService,
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: SignatureTrackingService, useValue: transactionServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });

    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    transactionService = TestBed.inject(SignatureTrackingService) as jasmine.SpyObj<SignatureTrackingService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    service = TestBed.inject(SttDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  xit('should be delete Execute', fakeAsync(() => {
    transactionService.delete.and.returnValue(of(iMultipleRequestResponseMock));
    router.navigate.and.returnValue(Promise.resolve(true));
    //service.deleteExecute(iDeletePropertiesMock);
    tick(4000);
    expect(transactionService.delete).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/transaction-manager-payroll/signature-tracking']);
    expect(spinner.hide).toHaveBeenCalledWith('main-spinner');
  }));

  xit('should be delete Execute with an error', fakeAsync(() => {
    transactionService.delete.and.returnValue(asyncError('error'));
    //service.deleteExecute(iDeletePropertiesMock);
    tick(4000);
    expect(transactionService.delete).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/transaction-manager-payroll/signature-tracking']);
    expect(spinner.hide).toHaveBeenCalledWith('main-spinner');
  }));
});
