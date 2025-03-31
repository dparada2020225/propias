import {AdfFormatService} from '@adf/components';
import {TestBed} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import {EPaymentType} from 'src/app/enums/payment-type.enum';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {iProviderDetailMock} from 'src/assets/mocks/modules/signature-tracking/mocksDetailTransaction';
import {
  iAchAccountMock,
  iBuildScheduleParameterMock,
  iParametersToExecuteTransactionMock,
  mockIACHSettings,
} from 'src/assets/mocks/modules/transfer/service/transfer-ach/ach.data.mock';
import {IAchAccount} from '../interfaces/ach-account-interface';
import {IACHSettings} from '../interfaces/settings.interface';
import {AtdUtilService} from './atd-util.service';

describe('AtdUtilService', () => {
  let service: AtdUtilService;

  let util: jasmine.SpyObj<UtilService>;
  let parameterManagementService: jasmine.SpyObj<ParameterManagementService>;
  let adfFormat: jasmine.SpyObj<AdfFormatService>;
  let translate: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    const utilSpy = jasmine.createSpyObj('UtilService', ['getISOCurrency', 'getCurrencySymbolToIso', 'getLabelProduct']);
    const parameterManagementServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter']);
    const adfFormatSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount']);
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);

    TestBed.configureTestingModule({
      providers: [
        AtdUtilService,
        { provide: UtilService, useValue: utilSpy },
        { provide: ParameterManagementService, useValue: parameterManagementServiceSpy },
        { provide: AdfFormatService, useValue: adfFormatSpy },
        { provide: TranslateService, useValue: translateSpy },
      ],
    });
    service = TestBed.inject(AtdUtilService);
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    parameterManagementService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    adfFormat = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  xit('should buildHoursToTransaction', () => {
    translate.instant.and.returnValue('label:hour');
    const res = service.buildHoursToTransaction(iBuildScheduleParameterMock);
    expect(res).toEqual({
      controlName: iBuildScheduleParameterMock.controlName,
      data: [
        {
          name: 'label:select',
          value: '',
        },
        {
          name: '12:08 label:hour',
          value: iBuildScheduleParameterMock.listSchedule[0].hour,
        },
      ],
    });
  });

  it('should getParsedScheduleValue', () => {
    const res = service.getParsedScheduleValue('124512');
    expect(res).toEqual('12:45:12');
  });

  it('should parsedAccounts be funcionality', () => {
    const accounts: IAchAccount[] = [iAchAccountMock];
    const res = service.parsedAccounts(accounts);
    expect(res).toHaveSize(1);
    expect(util.getCurrencySymbolToIso).toHaveBeenCalled();
    expect(util.getLabelProduct).toHaveBeenCalled();
  });


  it('should compare Accounts To Sort', () => {
    const a: IAchAccount = iAchAccountMock;
    const b: IAchAccount = { ...iAchAccountMock };
    b.currency = 'L';

    const resMock = service.compareAccountsToSort(a, b);
    expect(resMock).toEqual(-1);

    const resMock2 = service.compareAccountsToSort(b, a);
    expect(resMock2).toEqual(1);
  });

  it('should get Data To List Of Banks', () => {
    const mockSettings: IACHSettings[] = [];

    const msgMock = service.getDataToListOfBanks(mockSettings, iAchAccountMock);

    expect(msgMock).toBeUndefined();
  });

  xit('should get data To Execute Transaction', () => {
    parameterManagementService.getParameter.and.returnValue({ customerCode: '89' });
    const mockRes = service.dataToExecuteTransaction(iParametersToExecuteTransactionMock);
    expect(mockRes.cif).toEqual('89');
    expect(mockRes.paymentType).toEqual(EPaymentType.ACH_TRANSFER);
    expect(util.getCurrencySymbolToIso).toHaveBeenCalled();
  });

  it('should get Product', () => {
    const res = service.getProduct('LOANS');
    expect(res).toEqual('104');
  });

  it('should get Internal Product For Payment Of Providers', () => {
    const bank = { ...iProviderDetailMock };
    bank.bankId = '1';

    util.getISOCurrency.and.returnValue('USD');
    const res = service.getInternalProductForPaymentOfProviders([mockIACHSettings], bank, 'USD');
    expect(res).toEqual('0');
  });
});
