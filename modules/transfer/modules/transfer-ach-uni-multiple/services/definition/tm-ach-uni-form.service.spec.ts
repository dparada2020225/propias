/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TmAchUniFormService } from './tm-ach-uni-form.service';

describe('Service: TmAchUniForm', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TmAchUniFormService]
    });
  });

  it('should ...', inject([TmAchUniFormService], (service: TmAchUniFormService) => {
    expect(service).toBeTruthy();
  }));
});
