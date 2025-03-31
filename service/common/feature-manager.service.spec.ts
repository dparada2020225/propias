import { TestBed } from '@angular/core/testing';

import { EProfile } from '../../enums/profile.enum';
import { FeatureManagerService } from './feature-manager.service';

describe('FeatureManagerService', () => {
  let service: FeatureManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeatureManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should implement Method HONDURAS', () => {
    service.profile = EProfile.HONDURAS;
    expect(service.implementMethod()).toBeFalsy();
  });

  it('should implement Method PANAMA', () => {
    service.profile = EProfile.PANAMA;
    expect(service.implementMethod()).toBeTruthy();
  });

  it('should implement Method SALVADOR', () => {
    service.profile = EProfile.SALVADOR;
    expect(service.implementMethod()).toBeFalsy();
  });

  it('should implement Method NULL', () => {
    service.profile = null as any;
    expect(service.implementMethod()).toBeFalsy();
  });

  it('should get is On Boarding Enabled profile HONDURAS', () => {
    service.profile = EProfile.HONDURAS;

    expect(service.isOnBoardingEnabled).toBeTruthy();
  });

  it('should get is On Boarding Enabled profile SALVADOR', () => {
    service.profile = EProfile.SALVADOR;

    expect(service.isOnBoardingEnabled).toBeFalsy();
  });

  it('should get is On Boarding Enabled profile PANAMA', () => {
    service.profile = EProfile.PANAMA;

    expect(service.isOnBoardingEnabled).toBeFalsy();
  });

  it('should get is On Boarding Enabled profile null', () => {
    service.profile = null as any;

    expect(service.isOnBoardingEnabled).toBeFalsy();
  });
});
