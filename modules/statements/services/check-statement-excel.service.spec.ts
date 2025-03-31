import {TestBed} from '@angular/core/testing';

import {TranslateService} from '@ngx-translate/core';
import {CheckStatementExcelService} from './check-statement-excel.service';

describe('CheckStatementExcelService', () => {
  let service: CheckStatementExcelService;
  let translate: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    TestBed.configureTestingModule({
      providers: [{provide: TranslateService, useValue: translateSpy}],
    });
    service = TestBed.inject(CheckStatementExcelService);
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
