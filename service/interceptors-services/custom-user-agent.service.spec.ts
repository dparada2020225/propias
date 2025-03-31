import {TestBed} from '@angular/core/testing';

import {StorageService} from '@adf/security';
import {BrowserInfoService} from '../general/browser-info.service';
import {CustomUserAgentService} from './custom-user-agent.service';

describe('CustomUserAgentService', () => {
  let service: CustomUserAgentService;

  let browserInfoService: jasmine.SpyObj<BrowserInfoService>;
  let storage: jasmine.SpyObj<StorageService>;

  beforeEach(() => {

    const browserInfoServiceSpy = jasmine.createSpyObj('BrowserInfoService', ['getBrowserInfo'])
    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem', 'addItem'])

    TestBed.configureTestingModule({
      providers: [
        { provide: BrowserInfoService, useValue: browserInfoServiceSpy },
        { provide: StorageService, useValue: storageSpy },
      ]
    });
    service = TestBed.inject(CustomUserAgentService);
    browserInfoService = TestBed.inject(BrowserInfoService) as jasmine.SpyObj<BrowserInfoService>;
    storage = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get User Agent', () => {
    storage.getItem.and.returnValue('true')
    browserInfoService.getBrowserInfo.and.returnValue({
      name: 'test',
      version: '0',
      operatingSystem: 'windows',
      mobile: false
    })
    const res = service.getUserAgent();
    expect(res).toBeDefined();
  })

});
