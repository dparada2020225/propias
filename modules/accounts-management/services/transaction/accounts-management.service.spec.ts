import { TestBed } from '@angular/core/testing';

import { AccountsManagementService } from './accounts-management.service';

describe('AccountsManagementService', () => {
  let service: AccountsManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountsManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
