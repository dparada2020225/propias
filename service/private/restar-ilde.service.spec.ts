import { TestBed } from '@angular/core/testing';

import { RestarIldeService } from './restar-ilde.service';

describe('RestarIldeService', () => {
  let service: RestarIldeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestarIldeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit value when restar is called', (done) => {
    service.activeRestar().subscribe(value => {
      expect(value).toBe('test value');
      done();
    });
    service.restar('test value');
  });

});
