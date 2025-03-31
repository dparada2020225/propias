import {TestBed} from '@angular/core/testing';

import {SpplLoadpayrollTransactionService} from './sppl-loadpayroll-transaction.service';
import {PmpeFileValidationsService} from "./pmpe-file-validations.service";
import {PmpTransactionService} from "../transaction/pmp-transaction.service";
import {LoadSheetFileService} from "../../../../../service/common/load-sheet-file.service";

describe('SpplLoadpayrollTransactionService', () => {
  let service: SpplLoadpayrollTransactionService;

  let paymentOfPayrollFileValidations: jasmine.SpyObj<PmpeFileValidationsService>;
  let pmpTransactionService: jasmine.SpyObj<PmpTransactionService>;
  let loadSheetFile: jasmine.SpyObj<LoadSheetFileService>;

  beforeEach(() => {

    const paymentOfPayrollFileValidationsSpy = jasmine.createSpyObj('PmpeFileValidationsService', ['buildStructureFileRequestBISV'])
    const pmpTransactionServiceSpy = jasmine.createSpyObj('PmpTransactionService', ['consultMultipliAccounts'])
    const loadSheetFileSpy = jasmine.createSpyObj('LoadSheetFileService', ['createFileToUpload', 'buildFileNameWithWebPattern'])

    TestBed.configureTestingModule({
      providers: [
        {provide: PmpeFileValidationsService, useValue: paymentOfPayrollFileValidationsSpy},
        {provide: PmpTransactionService, useValue: pmpTransactionServiceSpy},
        {provide: LoadSheetFileService, useValue: loadSheetFileSpy},
      ]
    });
    service = TestBed.inject(SpplLoadpayrollTransactionService);
    paymentOfPayrollFileValidations = TestBed.inject(PmpeFileValidationsService) as jasmine.SpyObj<PmpeFileValidationsService>;
    pmpTransactionService = TestBed.inject(PmpTransactionService) as jasmine.SpyObj<PmpTransactionService>;
    loadSheetFile = TestBed.inject(LoadSheetFileService) as jasmine.SpyObj<LoadSheetFileService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });



});
