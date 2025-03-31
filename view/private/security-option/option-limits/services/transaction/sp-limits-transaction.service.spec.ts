import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ICurrentLimitsResponse, ISpCurrentLimitsRequestBody, ISpSetLimitsRequestBody } from '../../interfaces/sp-limits.interface';
import { SpLimitsTransactionService } from './sp-limits-transaction.service';

describe('SpLimitsTransactionService', () => {
  let service: SpLimitsTransactionService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SpLimitsTransactionService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get Current Limits', () => {
    const dto: ISpCurrentLimitsRequestBody = {
      clientCode: '78956204'
    }
    const dataMock: ICurrentLimitsResponse[] = [
      {
        dailyLimit: 'daily',
        monthlyLimit: 'monthly',
        dateLastUpdate: 'yearly',
        timeLastUpdate: 'yearly',
        transactionLimit: 'transaction'
      }
    ]

    service.getCurrentLimits(dto).subscribe((data) => {
      expect(data).toEqual(dataMock)
    })

    const url = '/v1/sec-profile/new-security-profile/transactional-limits/consult';
    const req = httpController.expectOne(url)
    req.flush(dataMock)
    expect(req.request.body).toEqual(dto)
    expect(req.request.method).toEqual('POST')
  })

  it('should set Limits', () => {
    const dto: ISpSetLimitsRequestBody = {
      transactionLimit: 'transaction',
      dailyLimit: 'daily',
      monthlyLimit: 'monthly'
    }

    const dataMock = { transccion: 'succeeded' }

    service.setLimits(dto).subscribe((data) => {
      expect(data).toEqual(dataMock)
    })

    const url = '/v1/sec-profile/new-security-profile/transactional-limits/add-limits'
    const req = httpController.expectOne(url)
    req.flush(dataMock)
    expect(req.request.body).toEqual(dto)
    expect(req.request.method).toEqual('POST')
  })

});
