// import { TestBed } from '@angular/core/testing';
// import { TranslateService } from '@ngx-translate/core';

// import { DteDonationFormService } from './dte-donation-form.service';
// import creditAccount from '../../../../../../../assets/mocks/modules/transfer/service/donation/credit-accounts.json';
// import donationAccount from '../../../../../../../assets/mocks/modules/transfer/service/donation/donation-accounts.json';
// import { IDTEInitStep1 } from '../../interfaces/donation-execution.interface';
// import { IDonationAccount } from '../../interfaces/donation-account.interface';
// import { FlowErrorBuilder } from 'projects/online-banking/src/app/models/error.interface';
// import { UtilService } from '../../../../../../services/common/util.service';
// import { AdfFormBuilderService } from '@adf/components';
// import { DtdTransferManagerService } from '../definition/dtd-transfer-manager-payroll.service';
// import { stepMock, debitAccountsMocks } from '../../data/donation-mock';
// import {ILayout} from '@adf/components';
// import { IDTDFormRequest } from '../../interfaces/donation-definition.interface';

// describe('DteDonationFormService', () => {
//   let service: DteDonationFormService;
//   let util: jasmine.SpyObj<UtilService>;
//   let definitionServiceManager: jasmine.SpyObj<DtdTransferManagerService>;
//   let formBuilderService: jasmine.SpyObj<AdfFormBuilderService>;
//   let translateService: jasmine.SpyObj<TranslateService>;

//   beforeEach(() => {
//     const utilSpy = jasmine.createSpyObj('UtilService', ['removeLayoutSelect', 'getAmountMask']);
//     const definitionServiceManagerSpy = jasmine.createSpyObj('DtdTransferManagerService', ['builderDonationLayoutStep1', 'buildDebitedAccountSelectAttributesStep1', 'buildFundationAccountSelectAttributesStep1']);
//     const formBuilderServiceSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition']);
//     const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant']);

//     TestBed.configureTestingModule({
//       providers: [DteDonationFormService,
//         { provide: UtilService, useValue: utilSpy },
//         { provide: DtdTransferManagerService, useValue: definitionServiceManagerSpy },
//         { provide: AdfFormBuilderService, useValue: formBuilderServiceSpy },
//         { provide: TranslateService, useValue: translateServiceSpy },

//       ]
//     });
//     service = TestBed.inject(DteDonationFormService);
//     translateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;

//      util= TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
//      definitionServiceManager = TestBed.inject(DtdTransferManagerService) as jasmine.SpyObj<DtdTransferManagerService>;
//      formBuilderService = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
//      translateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;

//   });

//   it('should be created DteDonationFormService', () => {
//     expect(service).toBeTruthy();
//   });

//   it('Should be defined changeAccountDebited', () => {
//     service.changeAccountDebited('212312312')
//     expect(service.changeAccountDebited).toBeDefined()
//   })

//   it('Should be defined handleChangeDebitOptions', () => {
//     service.handleChangeDebitOptions(debitAccountsMocks[0])
//     expect(service.handleChangeDebitOptions).toBeDefined()
//   })

//   it('Should be defined changeAccountFundation', () => {
//     service.changeAccountFundation('212312312')
//     expect(service.changeAccountFundation).toBeDefined()
//   })

//   it('Should be defined formScreenBuilder', () => {
//     const donationLayout: ILayout = {
//       title: "string",
//       subtitle: "string",
//       class: "string",
//       attributes: []
//   }

//     definitionServiceManager.builderDonationLayoutStep1.and.returnValue(donationLayout)
//     console.log('service.donationLayout ',service.donationLayout);

//     service.formScreenBuilder(stepMock)
//     expect(service.formScreenBuilder).toBeDefined()

//   })
// });
