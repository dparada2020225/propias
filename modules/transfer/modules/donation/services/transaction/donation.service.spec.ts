// import { TestBed } from '@angular/core/testing';

// import { DonationService } from './donation.service';
// import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
// import { BankingAuthenticationService } from '@adf/security';
// import { IDonationAccount } from '../../interfaces/donation-account.interface';
// import {  dataMock, fundationAccountsMocks, responsePostMock } from '../../data/donation-mock';
// import { associatedAccountsMock } from '../../../transfer-ach/data/ICrudACHStorageState-mock';


// xdescribe('DonationService', () => {
//   let service: DonationService;
//   let httpController: HttpTestingController;
//   let bankingService: jasmine.SpyObj<BankingAuthenticationService>;

//   beforeEach(() => {
//     const bankingAuthServiceSpy = jasmine.createSpyObj('BankingAuthenticationService', ['encrypt']);


//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [
//         DonationService,
//         {
//           provide: BankingAuthenticationService,
//           useValue: bankingAuthServiceSpy,
//         },
//       ],
//     });

//     service = TestBed.inject(DonationService);
//     httpController = TestBed.inject(HttpTestingController);
//     bankingService = TestBed.inject(BankingAuthenticationService) as jasmine.SpyObj<BankingAuthenticationService>;
//   });

//   afterEach(() => {
//     httpController.verify();
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('Should get donation account', (doneFn) => {
//     const mockData: IDonationAccount[] = fundationAccountsMocks;

//     service.getDonation().subscribe((data) => {
//       expect(data).toEqual(fundationAccountsMocks);
//       expect(data.length).toEqual(fundationAccountsMocks.length)
//       doneFn();
//     })

//         //http config
//         const url = '/v1/donation/account';
//         const req = httpController.expectOne(url);
//         expect(req.request.method).toEqual('GET');
//         req.flush(mockData);
//   })

//   it('Should post donationTransfer', (doneFn) => {
//     const isTokenRequiered = true;
//     const data = dataMock;
//     const tokenValue = 'dsassee';
//     const responseMock = 'ok';
//     service.donationTransfer(data, isTokenRequiered, tokenValue).subscribe((data) => {
//       expect(data).toEqual(responsePostMock);
//       doneFn();
//     })
//     //http config
//     const url = '/v1/donation/transference/execute';
//     const req = httpController.expectOne(url);
//     expect(req.request.method).toEqual('POST');
//     req.flush(responsePostMock);
//   })

// });
