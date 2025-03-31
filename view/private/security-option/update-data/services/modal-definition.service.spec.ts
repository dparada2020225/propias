import { TestBed } from '@angular/core/testing';

import { ModalDefinitionService } from './modal-definition.service';

describe('ModalDefinitionService', () => {
  let service: ModalDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalDefinitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
