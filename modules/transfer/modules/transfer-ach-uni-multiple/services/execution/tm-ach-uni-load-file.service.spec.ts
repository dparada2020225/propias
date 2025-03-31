/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TmAchUniLoadFileService } from './tm-ach-uni-load-file.service';

describe('Service: TmAchUniLoadFile', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TmAchUniLoadFileService]
    });
  });

  it('should ...', inject([TmAchUniLoadFileService], (service: TmAchUniLoadFileService) => {
    expect(service).toBeTruthy();
  }));
});
