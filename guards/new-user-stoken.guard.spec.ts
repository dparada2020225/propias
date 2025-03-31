import { TestBed } from '@angular/core/testing';

import { NewUserStokenGuard } from './new-user-stoken.guard';

describe('NewUserStokenGuard', () => {
  let guard: NewUserStokenGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NewUserStokenGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
