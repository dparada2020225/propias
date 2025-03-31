/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TmAchUniPrintService } from './tm-ach-uni-print.service';

describe('Service: TmAchUniPrint', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TmAchUniPrintService]
    });
  });

  it('should ...', inject([TmAchUniPrintService], (service: TmAchUniPrintService) => {
    expect(service).toBeTruthy();
  }));
});
