import {TestBed} from '@angular/core/testing';
import { StBisvService } from './st-bisv.service';

describe('StBisvService', () => {
  let service: StBisvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StBisvService);

    TestBed.configureTestingModule({
      providers: []
    });

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
