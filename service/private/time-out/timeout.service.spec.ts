import { TestBed } from '@angular/core/testing';

import { InfoServiceAlert, TimeoutService } from './timeout.service';

describe('TimeoutService', () => {
  let service: TimeoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit value when send is called', (done) => {
    const testValue: InfoServiceAlert = {
      service: 'transfer',
      type: 'timeout',
    };
    service.getSharedData().subscribe(value => {
      expect(value).toEqual(testValue);
      done();
    });
    service.send(testValue);
  });

});
