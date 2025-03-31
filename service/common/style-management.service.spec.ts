import { TestBed } from '@angular/core/testing';

import { EProfile } from 'src/app/enums/profile.enum';
import { StyleManagementService } from './style-management.service';

describe('StyleManagementService', () => {
  let service: StyleManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StyleManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should verify is corporate Image Application == HONDURAS', () => {
    service.profile = EProfile.HONDURAS;
    expect(service.corporateImageApplication()).toBeFalsy();
  })

  it('should verify is corporate Image Application == SALVADOR', () => {
    service.profile = EProfile.SALVADOR;
    expect(service.corporateImageApplication()).toBeTruthy();
  })

  it('should verify is corporate Image Application == PANAMA', () => {
    service.profile = EProfile.PANAMA;
    expect(service.corporateImageApplication()).toBeTruthy();
  })

});
