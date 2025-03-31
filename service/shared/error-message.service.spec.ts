import { TestBed } from '@angular/core/testing';

import { TranslateService } from '@ngx-translate/core';
import { ErrorMessageService } from './error-message.service';

describe('ErrorMessageService', () => {
  let service: ErrorMessageService;

  beforeEach(() => {
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant'])
    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateSpy },
      ]
    });
    service = TestBed.inject(ErrorMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get Translate Key', () => {
    const data = { error: { code: 'SOME_ERROR_CODE' } };
    expect(service.getTranslateKey(data)).toEqual('error.dep.SOME_ERROR_CODE');
  })

  it('should return the error message translation key', () => {
    const data = { error: { message: 'Some error message' } };
    expect(service.getTranslateKey(data)).toEqual('Some error message');
  });

  it('should return error http', () => {
    const data = { http: {} }
    expect(service.getTranslateKey(data)).toEqual('error.http.undefined')
  })

});
