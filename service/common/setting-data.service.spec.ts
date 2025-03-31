import { TestBed } from '@angular/core/testing';

import { StorageService } from '@adf/security';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SettingDataService } from './setting-data.service';

describe('SettingDataService', () => {
  let service: SettingDataService;
  let storage: jasmine.SpyObj<StorageService>;
  let httpClient: HttpTestingController;

  beforeEach(() => {
    const storageSpy = jasmine.createSpyObj('StorageService', ['addItem'])
    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageSpy }
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(SettingDataService);
    storage = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    httpClient = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get Setting', () => {
    const dataMock = { version: '2.1.100' } as any;

    service.getSetting().subscribe({
      next: (value) => {
        expect(value).toEqual(dataMock);
        expect(storage.addItem).toHaveBeenCalled();
      }
    })

    const url = '/v1/settings/';
    const req = httpClient.expectOne(url);
    req.flush(dataMock);
    expect(req.request.method).toEqual('GET');
  })

  it('should get Setting but have error', () => {
    const dataMock = { status: 500, statusText: 'Internal Server Error' } as any;

    service.getSetting().subscribe({
      error: (value) => {
        expect(value.status).toEqual(500);
        expect(storage.addItem).toHaveBeenCalled();
      }
    })

    const url = '/v1/settings/';
    const req = httpClient.expectOne(url);
    req.flush({}, dataMock);
    expect(req.request.method).toEqual('GET');
  })

});
