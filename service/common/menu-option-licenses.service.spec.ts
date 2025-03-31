import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IMenuLicensesResponse, IMenuOptionLicensesParams } from 'src/app/models/menu-option-licenses.interface';
import { MenuOptionLicensesService } from './menu-option-licenses.service';

describe('MenuOptionLicensesService', () => {
  let service: MenuOptionLicensesService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(MenuOptionLicensesService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get Menu Licenses', () => {
    const dto: IMenuOptionLicensesParams = {
      idClient: '1',
      idService: '2',
    };
    const dataMock: IMenuLicensesResponse = {
      '1': true,
    };

    service.getMenuLicenses(dto).subscribe({
      next: (value) => {
        expect(value).toEqual(dataMock as any);
      },
    });

    const url = '/v1/thirdparties/menu-option';
    const req = http.expectOne(url);
    req.flush(dataMock);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(dto);
  });
});
