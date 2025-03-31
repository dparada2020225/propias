/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EachUniTransferFormService } from './e-ach-uni-transfer-form.service';

describe('Service: AchUniTransferForm', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EachUniTransferFormService]
    });
  });

  it('should ...', inject([EachUniTransferFormService], (service: EachUniTransferFormService) => {
    expect(service).toBeTruthy();
  }));
});
