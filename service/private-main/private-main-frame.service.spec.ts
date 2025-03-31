import { TestBed } from '@angular/core/testing';

import { PrivateMainFrameService } from './private-main-frame.service';

describe('PrivateMainFrameService', () => {
  let service: PrivateMainFrameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrivateMainFrameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the value sent to the source as an observable', () => {
    service.send('test');
    service.getSharedData().subscribe(value => {
      expect(value).toBe('test');
    });
  });

});
