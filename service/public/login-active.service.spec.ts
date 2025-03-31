import { TestBed } from '@angular/core/testing';

import { LoginActiveService } from './login-active.service';

describe('LoginActiveService', () => {
  let service: LoginActiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginActiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send and receive data', () => {
    let data;
    service.getData().subscribe(value => data = value);
    service.send('test data');
    expect(data).toEqual('test data');
  });

});
