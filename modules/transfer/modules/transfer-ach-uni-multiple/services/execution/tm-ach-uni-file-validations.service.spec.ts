/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TmAchUniFileValidationsService } from './tm-ach-uni-file-validations.service';

describe('Service: TmAchUniFileValidations', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TmAchUniFileValidationsService]
    });
  });

  it('should ...', inject([TmAchUniFileValidationsService], (service: TmAchUniFileValidationsService) => {
    expect(service).toBeTruthy();
  }));
});
