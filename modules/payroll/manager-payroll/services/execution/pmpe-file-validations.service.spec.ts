import {TestBed} from '@angular/core/testing';

import {PmpeFileValidationsService} from './pmpe-file-validations.service';
import {UtilService} from "../../../../../service/common/util.service";
import {UtilWorkFlowService} from "../../../../../service/common/util-work-flow.service";
import {ParsedFileUploadUtilService} from "../../../../../service/general/parsed-file-upload-util.service";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {iSPPFileStartupParametersMock} from "../../../../../../assets/mocks/modules/payroll/payroll.mock";

describe('SppFileValidationsService', () => {
  let service: PmpeFileValidationsService;

  let utils: jasmine.SpyObj<UtilService>;
  let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;
  let parsedFileUploadUtil: jasmine.SpyObj<ParsedFileUploadUtilService>;

  beforeEach(() => {

    const utilsSpy = jasmine.createSpyObj('UtilService', ['fillStrings', 'parseNumberAsFloat'])
    const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['rebuildAmount'])
    const parsedFileUploadUtilSpy = jasmine.createSpyObj('ParsedFileUploadUtilService', ['manageTranslateText', 'manageEmitFailedResponse'])

    TestBed.configureTestingModule({
      providers: [
        { provide: UtilService, useValue: utilsSpy },
        { provide: UtilWorkFlowService, useValue: utilWorkFlowSpy },
        { provide: ParsedFileUploadUtilService, useValue: parsedFileUploadUtilSpy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    service = TestBed.inject(PmpeFileValidationsService);
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
    parsedFileUploadUtil = TestBed.inject(ParsedFileUploadUtilService) as jasmine.SpyObj<ParsedFileUploadUtilService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should validate', () => {
    const res = service.validate(iSPPFileStartupParametersMock);
    expect(res).toBeDefined();
  })

  describe('getTotalAmount', () => {
    it('should return the total amount', () => {
      utils.parseNumberAsFloat.and.returnValue(600)

      const registers = [
        { amount: '100' },
        { amount: '200' },
        { amount: '300' }
      ];
      const result = service['getTotalAmount'](registers as any);
      expect(result).toEqual(600);
    });
  });

  describe('parseFile', () => {
    it('should parse the file correctly', () => {
      const values = [
        ['123456', '100', 'test1'],
        ['789012', '200', 'test2']
      ];
      const result = service['parseFile'](values);
      expect(result).toBeDefined()
    });
  });

  describe('buildCurrentFile', () => {
    it('should build the current file correctly', () => {
      const currentFile = [
        { accountNumber: '123456', amount: '100', accountName: 'test1' },
        { accountNumber: '789012', amount: '200', accountName: 'test2' }
      ];
      const formValues = { credits: 2, totalAmount: 300 };
      const result = service['buildCurrentFile'](currentFile, formValues as any);
      expect(result).toBeDefined()
    });
  });

  describe('buildStructureFileRequestBP', () => {
    it('should build the structure file request correctly', () => {

      utilWorkFlow.rebuildAmount.and.returnValue('100C')

      const parameters = {
        formValues: { totalAmount: 300 },
        fileRegisters: [
          { accountNumber: '123456', amount: '100', accountName: 'test1' },
          { accountNumber: '789012', amount: '200', accountName: 'test2' }
        ]
      };
      const result = service.buildStructureFileRequestBP(parameters as any);
      expect(result).toBeDefined()
    });
  });

  describe('buildStructureFileRequestBISV', () => {
    it('should build the structure file request correctly', () => {
      const parameters = {
        fileRegisters: [
          { accountNumber: '123456', amount: '100', email: 'test1@example.com' },
          { accountNumber: '789012', amount: '200', email: 'test2@example.com' }
        ]
      };
      const result = service.buildStructureFileRequestBISV(parameters);
      expect(result).toBeDefined();
    });
  });

  describe('buildStructureFileRequestBISV', () => {
    it('should build the structure file request correctly', () => {
      const parameters = {
        fileRegisters: [
          { accountNumber: '123456', amount: '100', email: 'test1@example.com' },
          { accountNumber: '789012', amount: '200', email: 'test2@example.com' }
        ]
      };
      const result = service.buildStructureFileRequestBISV(parameters);
      expect(result).toBeDefined()
    });
  });

  describe('validateIsAmountInFile', () => {
    it('should return true if all registers have an amount', () => {
      const registers = [
        { amount: '100' },
        { amount: '200' },
        { amount: '300' }
      ];
      const result = service['validateIsAmountInFile'](registers as any);
      expect(result).toBeTrue();
    });

    it('should return false if a register does not have an amount', () => {
      const registers = [
        { amount: '100' },
        {},
        { amount: '300' }
      ];
      const result = service['validateIsAmountInFile'](registers as any);
      expect(result).toBeFalse();
    });
  });

  describe('validateIsAmountContainSpecialCharacters', () => {
    it('should return true if no amounts contain special characters', () => {
      const currentFile = [
        { amount: '100' },
        { amount: '200' },
        { amount: '300' }
      ];
      const result = service['validateIsAmountContainSpecialCharacters'](currentFile as any);
      expect(result).toBeTrue();
    });

    it('should return false if an amount contains special characters', () => {
      const currentFile = [
        { amount: '100' },
        { amount: '20$0' },
        { amount: '300' }
      ];
      const result = service['validateIsAmountContainSpecialCharacters'](currentFile as any);
      expect(result).toBeFalse();
    });
  });

  describe('validateIsAmountLength', () => {
    it('should return true if no amounts exceed the maximum length', () => {
      const currentFile = [
        { amount: '100' },
        { amount: '200' },
        { amount: '300' }
      ];
      const result = service['validateIsAmountLength'](currentFile as any);
      expect(result).toBeTrue();
    });

    it('amount exceeds the maximum length', () => {
      const currentFile = [
        { amount: '100' },
        { amount: '2000000000000' },
        { amount: '300' }
      ];
      const result = service['validateIsAmountLength'](currentFile as any);
      expect(result).toBeTruthy();
    });
  });

  describe('validateAccountNumberIsNotAZero', () => {
    it('should return true if no account numbers are zero', () => {
      const currentFile = [
        { accountNumber: '123456' },
        { accountNumber: '789012' },
        { accountNumber: '345678' }
      ];
      const result = service['validateAccountNumberIsNotAZero'](currentFile as any);
      expect(result).toBeTrue();
    });

    it('should return false if an account number is zero', () => {
      const currentFile = [
        { accountNumber: '123456' },
        { accountNumber: '0' },
        { accountNumber: '345678' }
      ];
      const result = service['validateAccountNumberIsNotAZero'](currentFile as any);
      expect(result).toBeFalse();
    });

    describe('validateAmountIsNotEqualToSumOfDetailAmount', () => {
      it('should return true if total amount is equal to sum of detail amount', () => {
        const currentFile = [
          { amount: '100' },
          { amount: '200' },
          { amount: '300' }
        ];
        const formValues = { totalAmount: 600 };
        const result = service['validateAmountIsNotEqualToSumOfDetailAmount'](currentFile as any, formValues as any);
        expect(result).toBeTrue();
      });

      it('total amount is not equal to sum of detail amount', () => {
        const currentFile = [
          { amount: '100' },
          { amount: '200' },
          { amount: '300' }
        ];
        const formValues = { totalAmount: 700 };
        const result = service['validateAmountIsNotEqualToSumOfDetailAmount'](currentFile as any, formValues as any);
        expect(result).toBeTruthy()
      });
    });

    describe('validateQuantityOfRegisters', () => {
      it('should return false if credits is not equal to total registers', () => {
        const credits = '4';
        const totalRegisters = 3;
        const result = service['validateQuantityOfRegisters'](credits, totalRegisters);
        expect(result).toBeFalsy()
      });
    });

  });

  describe('buildStructureFileRequestBIPA', () => {
    it('should build the structure file request correctly', () => {
      const parameters = {
        fileRegisters: [
          { accountNumber: '123456', amount: '100' },
          { accountNumber: '789012', amount: '200' }
        ]
      };
      const result = service.buildStructureFileRequestBIPA(parameters);
      expect(result).toBeDefined()
    });
  });

  it('should validateEmptyFile response error', ()=> {
    spyOn(service, 'validateEmptyFile' as any).and.returnValue(false);
    const res = service.validate(iSPPFileStartupParametersMock);
    expect(res).toBeFalsy();
  })

  it('should validateIsCompleteDataInFile response error', ()=> {
    spyOn(service, 'validateEmptyFile' as any).and.returnValue(true);
    spyOn(service, 'validateIsCompleteDataInFile' as any).and.returnValue(false);
    const res = service.validate(iSPPFileStartupParametersMock);
    expect(res).toBeFalsy();
  })

  it('should validate return true', ()=> {
    spyOn(service, 'validateEmptyFile' as any).and.returnValue(true);
    spyOn(service, 'validateIsCompleteDataInFile' as any).and.returnValue(true);
    spyOn(service, 'fileValidations' as any).and.returnValue(true);
    const res = service.validate(iSPPFileStartupParametersMock);
    expect(res).toBeTruthy()
  })

  it('should validateIfRegistersAreUnderTheLimit failed', () => {
    const mockCurrentFile = new Array(service['maxRegistersAllowed'] + 1);
    const result = service['validateIfRegistersAreUnderTheLimit'](mockCurrentFile);
    expect(result).toBe(false);
  })

  it('should return true if data in file is complete', () => {
    const mockValues = [
      ['value1', 'value2', 'value3', 'value4', 'value5'],
      ['value1', 'value2', 'value3', 'value4', 'value5'],
    ];

    const result = service['validateIsCompleteDataInFile'](mockValues);

    expect(result).toBe(true);
  });

  it('should return false if total amount is not equal to sum of detail amount', () => {
    utils.parseNumberAsFloat.and.returnValue(10)
    const mockCurrentFile = [
    ];
    const mockFormValues = {
      totalAmount: '1000'
    };
    utils.parseNumberAsFloat.withArgs(mockFormValues.totalAmount).and.returnValue(1000.00)
    const result = service['validateAmountIsNotEqualToSumOfDetailAmount'](mockCurrentFile, mockFormValues as any);
    expect(result).toBe(false);
  });

  it('should return false if file contains invalid email', () => {
    const mockCurrentFile = [
      {
        accountNumber: '123456',
        email: 'invalidEmail',
      },
    ];

    const result = service['validateIsFileContainEmail'](mockCurrentFile as any);

    expect(result).toBe(false);
  });

});
