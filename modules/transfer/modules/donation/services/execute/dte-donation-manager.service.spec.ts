// import { TestBed } from '@angular/core/testing';

// import { DteDonationManagerService } from './dte-donation-manager-payroll.service';
// import { DteDonationFormService } from './dte-donation-form.service';
// import { DteDonationVoucherService } from './dte-donation-voucher.service';
// import { stepMock, voucherMock } from '../../data/donation-mock';

// xdescribe('DteDonationManagerService', () => {
//   let service: DteDonationManagerService;
//   let transferForm: DteDonationFormService;
//   let transferVoucher: DteDonationVoucherService;

//   beforeEach(() => {
//     const transferFormSpy = jasmine.createSpyObj('DteDonationFormService', ['formScreenBuilder', 'changeAccountDebited' ,'changeAccountFundation']);
//     const transferVoucherSpy = jasmine.createSpyObj('DteDonationVoucherService', ['mainBuilderVoucherLayout']);

//     TestBed.configureTestingModule({
//       providers: [
//         DteDonationManagerService,
//         { provide: DteDonationFormService, useValue: transferFormSpy },
//         { provide: DteDonationVoucherService, useValue: transferVoucherSpy },
//       ],
//     });

//     transferForm = TestBed.inject(DteDonationFormService) as jasmine.SpyObj<DteDonationFormService>;
//     transferVoucher = TestBed.inject(DteDonationVoucherService) as jasmine.SpyObj<DteDonationVoucherService>;

//     service = TestBed.inject(DteDonationManagerService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should build step 1', () => {
//     service.formScreenBuilderStep1(stepMock);
//     expect(transferForm.formScreenBuilder).toHaveBeenCalled();
//   })

//   it('should build changeAccountDebitedStep1', () => {
//     service.changeAccountDebitedStep1('123123');
//     expect(transferForm.changeAccountDebited).toHaveBeenCalled();
//   })

//   it('should build changeAccountFundationStep1', () => {
//     service.changeAccountFundationStep1('123123');
//     expect(transferForm.changeAccountFundation).toHaveBeenCalled();
//   })

//   it('should build voucherLayoutsMainBuilderStep3', () => {
//     service.voucherLayoutsMainBuilderStep3(voucherMock, true);
//     expect(transferVoucher.mainBuilderVoucherLayout).toHaveBeenCalled();
//   })
// });
