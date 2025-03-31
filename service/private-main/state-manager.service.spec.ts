import { TestBed } from '@angular/core/testing';

import { StateManagerService } from './state-manager.service';

describe('StateManagerService', () => {
  let service: StateManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should increment click count when accountant is called', () => {
    service.accountant();
    expect((service as any).click).toBe(1);
  });

  it('should toggle statusInfo when alert is called', () => {
    service.alert();
    expect(service.status()).toBe(false);
    service.alert();
    expect(service.status()).toBe(true);
  });

  it('should increment click count when accountant is called', () => {
    service.accountant();
    expect((service as any).click).toBe(1);
  });

  it('should reset click count and call alert when accountant is called 4 times', () => {
    spyOn(service, 'alert');
    service.click = 4;
    service.accountant();

    expect((service as any).click).toBe(0);
    expect(service.alert).toHaveBeenCalled();
  });

  it('should get Data', () => {
    expect(service.getData()).toBeDefined()
  })

});
