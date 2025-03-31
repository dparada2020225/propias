import { TestBed } from '@angular/core/testing';

import { StorageService } from '@adf/security';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SecurityService } from './security.service';

describe('SecurityService', () => {
  let service: SecurityService;
  let storageService: jasmine.SpyObj<StorageService>;
  let httpController: HttpTestingController;

  beforeEach(() => {
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem', 'addItem'])
    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageServiceSpy },
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(SecurityService);
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get User Info but userInformation al ready exist', () => {
    const dataMock = { statusCode: 200, statusMessage: 'Success' }
    storageService.getItem.and.returnValue( JSON.stringify(dataMock));

    service.getUserInfo().subscribe((data) => {
      expect(data).toEqual(dataMock)
    })
  })

  it('should get User Info', () => {
    const dataMock = { statusCode: 200, statusMessage: 'Success' }
    storageService.getItem.and.returnValue(false)

    service.getUserInfo().subscribe((data) => {
      expect(data).toEqual(dataMock)
    })

    const url = '/v1/agreement/agreement/user';
    const req = httpController.expectOne(url);
    req.flush(dataMock)
    expect(req.request.method).toEqual('GET');
  })

  it('should get User Info but have error', (done) => {
    service.getUserInfo().subscribe({
      next: () => { },
      error: (error) => {
        expect(error.status).toBe(500);
        done();
      }
    });

    const url = '/v1/agreement/agreement/user';
    const req = httpController.expectOne(url);
    req.flush({}, { status: 500, statusText: 'Internal Server Error' })
    expect(req.request.method).toEqual('GET');
  })
});
