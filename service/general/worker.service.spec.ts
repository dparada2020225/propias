import { TestBed } from '@angular/core/testing';

import { SwUpdate } from '@angular/service-worker';
import { of } from 'rxjs';
import { WorkerService } from './worker.service';

describe('WorkerService', () => {
  let service: WorkerService;
  let updates: SwUpdate;
  let mockUpdates: jasmine.SpyObj<SwUpdate>;


  beforeEach(() => {

    updates = {
      isEnabled: true,
      versionUpdates: of({ type: 'VERSION_READY' }),
      checkForUpdate: jasmine.createSpy(),
      activateUpdate: jasmine.createSpy().and.returnValue(Promise.resolve()),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: SwUpdate, useValue: updates },
      ]
    });
    service = TestBed.inject(WorkerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
