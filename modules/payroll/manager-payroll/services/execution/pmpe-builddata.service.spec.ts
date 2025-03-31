import {TestBed} from '@angular/core/testing';

import {PmpeBuilddataService} from './pmpe-builddata.service';
import {PmpeFileValidationsService} from "./pmpe-file-validations.service";
import {LoadSheetFileService} from "../../../../../service/common/load-sheet-file.service";
import {ParameterManagementService} from "../../../../../service/navegation-parameters/parameter-management.service";
import {UtilService} from "../../../../../service/common/util.service";
import {AdfFormatService} from "@adf/components";
import {iGetDataPayrollMock} from "../../../../../../assets/mocks/modules/payroll/payroll.mock";

describe('PmpeBuilddataService', () => {
  let service: PmpeBuilddataService;

  let paymentOfPayrollFileValidations: jasmine.SpyObj<PmpeFileValidationsService>;
  let loadSheetFile: jasmine.SpyObj<LoadSheetFileService>;
  let parameterManager: jasmine.SpyObj<ParameterManagementService>;
  let util: jasmine.SpyObj<UtilService>;
  let adfFormatService: jasmine.SpyObj<AdfFormatService>;

  beforeEach(() => {

    const paymentOfPayrollFileValidationsSpy = jasmine.createSpyObj('PmpeFileValidationsService', ['buildStructureFileRequestBISV'])
    const loadSheetFileSpy = jasmine.createSpyObj('LoadSheetFileService', ['createFileToUpload', 'buildFileNameWithWebPatternPayPayroll'])
    const parameterManagerSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter'])
    const utilSpy = jasmine.createSpyObj('UtilService', ['getUserName', 'getDate'])
    const adfFormatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount'])

    TestBed.configureTestingModule({
      providers: [
        {provide: PmpeFileValidationsService, useValue: paymentOfPayrollFileValidationsSpy},
        {provide: LoadSheetFileService, useValue: loadSheetFileSpy},
        {provide: ParameterManagementService, useValue: parameterManagerSpy},
        {provide: UtilService, useValue: utilSpy},
        {provide: AdfFormatService, useValue: adfFormatServiceSpy},
      ]
    });
    service = TestBed.inject(PmpeBuilddataService);
    paymentOfPayrollFileValidations = TestBed.inject(PmpeFileValidationsService) as jasmine.SpyObj<PmpeFileValidationsService>;
    loadSheetFile = TestBed.inject(LoadSheetFileService) as jasmine.SpyObj<LoadSheetFileService>;
    parameterManager = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    adfFormatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the expected data', async () => {
    service['paymentDetail'] = iGetDataPayrollMock;

    const result = await service.buildFile('txt' as any);

    expect(result).toBeDefined()
  });


});
