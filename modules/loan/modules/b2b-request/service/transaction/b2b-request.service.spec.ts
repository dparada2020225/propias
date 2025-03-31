import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {
  iB2bRequestBodyMock,
  iB2bRequestConfigMock,
  iB2bRequestResponseMock,
  iFixedDeadlinesMock
} from 'src/assets/mocks/modules/loan/loan.data.mock';
import {IB2bRequestBody} from '../../interfaces/b2b-request.interface';
import {B2bRequestService} from './b2b-request.service';
import {UtilTransactionService} from "../../../../../../service/common/util-transaction.service";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";

describe('B2bRequestService', () => {
  let service: B2bRequestService;
  let utilTransaction: jasmine.SpyObj<UtilTransactionService>;
  let httpClient: HttpTestingController;

  beforeEach(() => {
    const utilTransactionSpy = jasmine.createSpyObj('UtilTransactionService', ['addHeaderToken'])

    TestBed.configureTestingModule({
      providers: [
        {provide: UtilTransactionService, useValue: utilTransactionSpy},
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ]
    });
    service = TestBed.inject(B2bRequestService);
    utilTransaction = TestBed.inject(UtilTransactionService) as jasmine.SpyObj<UtilTransactionService>;
    httpClient = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    httpClient.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return I B2b Request Response', () => {
    const requestData: IB2bRequestBody = iB2bRequestBodyMock;
    const token: string = 'Token encriptado'


    service.requestExecute(true, requestData, 'VDV54').subscribe({
      next(value) {
        expect(value).toEqual(iB2bRequestResponseMock)
      },
    })

    const url: string = '/v1/back-to-back/execute';
    const req = httpClient.expectOne(url)
    req.flush(iB2bRequestResponseMock);
    expect(req.request.method).toEqual('POST')
    expect(req.request.body).toEqual(requestData)
  })

  it('should get Config', () => {
    service.getConfig().subscribe({
      next(value) {
        expect(value).toEqual(iB2bRequestConfigMock)
      },
    })

    const url: string = `/v1/back-to-back/configuration`;
    const req = httpClient.expectOne(url)
    req.flush(iB2bRequestConfigMock);
    expect(req.request.method).toEqual('GET')
  })

  it('should get All', () => {
    service.getAll().subscribe({
      next(value) {
        expect(value).toEqual([iFixedDeadlinesMock])
      },
    })

    const url: string = '/v1/back-to-back/fixed-term';
    const req = httpClient.expectOne(url)
    req.flush([iFixedDeadlinesMock]);
    expect(req.request.method).toEqual('GET')
  })

});
