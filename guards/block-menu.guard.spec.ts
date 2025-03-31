import { TestBed } from '@angular/core/testing';

import { BlockMenuGuard } from './block-menu.guard';

describe('BlockMenuGuard', () => {
  let guard: BlockMenuGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BlockMenuGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
