import {TestBed} from '@angular/core/testing';

import {TokenRequestSettingsService} from './token-request-settings.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {ParameterManagementService} from "../../navegation-parameters/parameter-management.service";

describe('TokenRequestSettingsService', () => {
  let service: TokenRequestSettingsService;

  let controller: HttpTestingController;
  let parameterManagerService: jasmine.SpyObj<ParameterManagementService>;

  beforeEach(() => {

    const parameterManagerServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters'])

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ParameterManagementService, useValue: parameterManagerServiceSpy },
      ]
    });
    service = TestBed.inject(TokenRequestSettingsService);
    controller = TestBed.inject(HttpTestingController);
    parameterManagerService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
  });

  afterEach(() => {
    controller.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
