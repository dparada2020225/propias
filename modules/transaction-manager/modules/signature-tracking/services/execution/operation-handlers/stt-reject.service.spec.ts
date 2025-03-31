import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {Router} from '@angular/router';

import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {of} from 'rxjs';
import {
  asyncError,
  iMultipleRequestResponseMock,
} from '../../../../../../../../assets/mocks/modules/signature-tracking/mocksDetailTransaction';
import {SignatureTrackingService} from '../../transaction/signature-tracking.service';
import {SttRejectService} from './stt-reject.service';

describe('SttRejectService', () => {
  let service: SttRejectService;
  let router: jasmine.SpyObj<Router>;
  let transactionService: jasmine.SpyObj<SignatureTrackingService>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const transactionServiceSpy = jasmine.createSpyObj('SignatureTrackingService', ['toReturn']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: SignatureTrackingService, useValue: transactionServiceSpy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });
    service = TestBed.inject(SttRejectService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    transactionService = TestBed.inject(SignatureTrackingService) as jasmine.SpyObj<SignatureTrackingService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  xit('should reject Execute function with an error', fakeAsync(() => {
    transactionService.toReturn.and.returnValue(asyncError('error'));
    // service.rejectExecute(iDeletePropertiesMock);
    tick(4000);
    expect(transactionService.toReturn).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/transaction-manager-payroll/signature-tracking']);
  }));

  xit('should reject Execute function', fakeAsync(() => {
    transactionService.toReturn.and.returnValue(of(iMultipleRequestResponseMock));
    router.navigate.and.returnValue(Promise.resolve(true));
    //service.rejectExecute(iDeletePropertiesMock);
    tick(4000);
    expect(transactionService.toReturn).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/transaction-manager-payroll/signature-tracking']);
  }));
});
