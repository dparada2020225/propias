import {TestBed} from '@angular/core/testing';

import {ILayout} from '@adf/components';
import {StorageService} from '@adf/security';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {EProfile} from 'src/app/enums/profile.enum';
import {EMenuOptionLicenses, IMenuLicensesResponse} from 'src/app/models/menu-option-licenses.interface';
import {mockPromise} from 'src/assets/testing';
import {environment} from 'src/environments/environment';
import {ParameterManagementService} from '../navegation-parameters/parameter-management.service';
import {Base64Service} from './base64.service';
import {LoaderBuilderService} from './loader-builder.service';
import {UtilService} from './util.service';

describe('UtilService', () => {
  let service: UtilService;

  let base64: jasmine.SpyObj<Base64Service>;
  let loaderBuilder: jasmine.SpyObj<LoaderBuilderService>;
  let persistStepStateService: jasmine.SpyObj<ParameterManagementService>;
  let translate: jasmine.SpyObj<TranslateService>;
  let storageService: jasmine.SpyObj<StorageService>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(() => {
    const base64Spy = jasmine.createSpyObj('Base64Service', ['decoded']);
    const loaderBuilderSpy = jasmine.createSpyObj('LoaderBuilderService', ['getLoader', 'getLoaderSimple']);
    const persistStepStateServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters']);
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Base64Service, useValue: base64Spy },
        { provide: LoaderBuilderService, useValue: loaderBuilderSpy },
        { provide: ParameterManagementService, useValue: persistStepStateServiceSpy },
        { provide: TranslateService, useValue: translateSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
      ],
    });
    service = TestBed.inject(UtilService);
    base64 = TestBed.inject(Base64Service) as jasmine.SpyObj<Base64Service>;
    loaderBuilder = TestBed.inject(LoaderBuilderService) as jasmine.SpyObj<LoaderBuilderService>;
    persistStepStateService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the account with the matching account number', () => {
    const accounts = [
      { account: '12345', name: 'Alice' },
      { account: '67890', name: 'Bob' },
    ];
    const result = service.findSourceAccount('12345', accounts);
    expect(result).toEqual({ account: '12345', name: 'Alice' });
  });

  it('should parse Custom Number but have letters', () => {
    const value = '1AS8252';
    expect(service.parseCustomNumber(value)).toEqual(0);
  });

  it('should parse Custom Number but have letters', () => {
    const value = 78952;
    expect(service.parseCustomNumber(value)).toEqual(value);
  });

  it('should remove Left Pad Zeros', () => {
    const dto: string = '001123';
    expect(service.removeLeftPadZeros(dto)).toEqual('1123');
  });

  it('should all spinners', () => {
    spinner.show.and.returnValue(mockPromise(true));
    spinner.hide.and.returnValue(mockPromise(true));

    service.showPulseLoader();
    service.hidePulseLoader();
    service.showLoader();
    service.hideLoader();

    expect(spinner.show).toHaveBeenCalled();
    expect(spinner.hide).toHaveBeenCalled();
    expect(spinner.show).toHaveBeenCalledWith('main-spinner');
    expect(spinner.hide).toHaveBeenCalledWith('main-spinner');
  });

  it('should return true if the url is included in the blacklist', () => {
    const blackList = ['https://www.example.com', 'https://www.test.com'];
    const result = service.valueIsIncludeInBlackList(blackList, 'https://www.example.com/page');
    expect(result).toBeTrue();
  });

  it('should return false if the url is not included in the blacklist', () => {
    const blackList = ['https://www.example.com', 'https://www.test.com'];
    const result = service.valueIsIncludeInBlackList(blackList, 'https://www.notinlist.com/page');
    expect(result).toBeFalse();
  });

  it('should substr', () => {
    const res = service.substr('hola', 2, 4);
    expect(res).toEqual('la');
  });

  it('should return false if the date is not provided', () => {
    const result = service.validateCurrentDate(null as any);
    expect(result).toBeFalse();
  });

  it('should return true if the date is in the past', () => {
    const pastDate = new NgbDate(2010, 1, 1);
    const result = service.validateCurrentDate(pastDate);
    expect(result).toBeTrue();
  });

  it('should return false if the date is in the future', () => {
    const futureDate = new NgbDate(2030, 1, 1);
    const result = service.validateCurrentDate(futureDate);
    expect(result).toBeFalse();
  });

  it('should parse Amount String To Number', () => {
    const req = service.parseAmountStringToNumber('1,423.60');
    expect(req).toEqual(1423.6);
  });

  it('should get Table Option', () => {
    const menuLicenses: string[] = ['Licenses', 'transfer'];
    const options: string[] = ['Licenses', 'transfer'];

    const res = service.getTableOption(menuLicenses, options);
    expect(res).toHaveSize(2);
  });

  it('should get Licenses Transactions', () => {
    const menu: IMenuLicensesResponse = {
      [EMenuOptionLicenses.ADD]: false,
      [EMenuOptionLicenses.MODIFY]: false,
      [EMenuOptionLicenses.DELETE]: true,
      [EMenuOptionLicenses.TRANSFER]: true,
    };

    const res = service.getLicensesTransactions(menu);
    expect(res).toEqual(['delete_option', 'transfer_option']);
  });

  it('should is Transaction Available', () => {
    const menu = ['transfer', 'delete'];
    const option = 'transfer';
    expect(service.isTransactionAvailable(menu, option)).toBeTruthy();
  });

  it('should separator Validation', () => {
    expect(service.separatorValidation('si', 'no')).toEqual('/');
    expect(service.separatorValidation('si', null)).toEqual('');
  });

  it('should parse Percent', () => {
    expect(service.parsePercent('1.2')).toEqual('1.20%');
    expect(service.parsePercent('12')).toEqual('12%');
  });

  it('should get all loaders', () => {
    service.getLoader('success');
    expect(loaderBuilder.getLoader).toHaveBeenCalledWith('success');
    service.getLoaderSimple();
    expect(loaderBuilder.getLoaderSimple).toHaveBeenCalled();
  });

  it('should hyphenation Validation', () => {
    const res = service.hyphenationValidation('1', '2');
    expect(res).toEqual('-');
  });

  it('should get Amount Mask', () => {
    const res = service.getAmountMask('USD');
    expect(res.mask).toEqual('USD num');
    expect(res.blocks.num).toEqual({
      mask: Number,
      thousandsSeparator: ',',
      scale: 2,
      signed: false,
      radix: '.',
      padFractionalZeros: true,
      min: 0.01,
      max: 99999999999.99,
    });
  });

  it('should call window.scrollTo with 0,0 when requestAnimationFrame is not available', () => {
    spyOn(window, 'requestAnimationFrame').and.returnValue(null as any);
    service.scrollToTop();
    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });

  it('should get User Name', () => {
    storageService.getItem.and.returnValue('VCONTRERAS');
    expect(service.getUserName()).toEqual('VCONTRERAS');
  });

  it('should get Profile HeadBand', () => {
    environment.profile = EProfile.HONDURAS;
    expect(service.getProfileHeadBand()).toEqual('Banpais S.A');
  });

  it('should get Label Product', () => {
    translate.instant.and.returnValue('CHECKING');
    expect(service.getLabelProduct(1)).toBeDefined();
  });

  it('should get Product Acronym', () => {
    const label = 'SAVINGS';
    translate.instant.and.returnValue(`acronym_${label}`);
    expect(service.getProductAcronym(2)).toEqual(`acronym_${label}`);
  });

  it('should get Label Type Client', () => {
    const typeClient = 'Client';
    translate.instant.and.returnValue(`label_client_type_${typeClient.toLowerCase()}`);
    expect(service.getLabelTypeClient(typeClient)).toEqual(`label_client_type_${typeClient.toLowerCase()}`);
  });

  it('should get Product Key Name', () => {
    expect(service.getProductKeyName(6)).toEqual('credit_cards');
  });

  it('should get Product Name', () => {
    expect(service.getProductName(5)).toEqual('LOAN_05');
  });

  it('should get Label Currency', () => {
    const code = 'USD';
    translate.instant.and.returnValue(`label_${code}`);
    expect(service.getLabelCurrency(code)).toEqual(`label_${code}`);
  });

  it('should get ISO Currency', () => {
    const currency = '$';
    expect(service.getISOCurrency(currency)).toEqual('USD');
  });

  it('should get Label Status', () => {
    const code = 'USD';
    translate.instant.and.returnValue(`label_statu_${code}`);
    expect(service.getLabelStatus(code)).toEqual(`label_statu_${code}`);
  });

  it('should ge Currenc Symbol', () => {
    const code = 'USD';
    translate.instant.and.returnValue('dolares');
    expect(service.geCurrencSymbol(code)).toEqual(`dolares`);
  });

  it('should get Currency Symbol To Iso', () => {
    const code = 'L';
    translate.instant.and.returnValue(`currency_iso_${code.toLowerCase()}`);
    expect(service.getCurrencySymbolToIso(code)).toEqual(`currency_iso_${code.toLowerCase()}`);
  });

  it('should return the typeToken from the decoded JWT', () => {
    const currentToken = JSON.stringify({ access_token: 'header.payload.signature' });
    const decodedPayload = JSON.stringify({ typeToken: 'testType' });
    storageService.getItem.and.returnValue(currentToken);
    base64.decoded.and.returnValue(decodedPayload);
    expect(service.getTokenType()).toBe('testType');
  });

  it('should return an empty array if listWhereSearch is not an array or is undefined', () => {
    expect(service.searchByMultipleAttributes(undefined as any, 'query', ['property'])).toEqual([]);
    expect(service.searchByMultipleAttributes(null as any, 'query', ['property'])).toEqual([]);
    expect(service.searchByMultipleAttributes('not an array' as any, 'query', ['property'])).toEqual([]);
  });

  it('should return items that match the query in any of the specified properties', () => {
    const listWhereSearch = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 40 },
      { name: 'Charlie', age: 50 },
    ];
    const propertiesToSearch = ['name'];
    expect(service.searchByMultipleAttributes(listWhereSearch, 'bo', propertiesToSearch)).toEqual([{ name: 'Bob', age: 40 }]);
  });

  it('should remove the layoutSelect property from the specified controlName', () => {
    const layout: ILayout = {
      class: 'testClass',
      attributes: [
        { controlName: 'control1', layoutSelect: ['option1', 'option2'] } as any,
        { controlName: 'control2', layoutSelect: ['option3', 'option4'] },
      ],
    };
    service.removeLayoutSelect(layout, 'control1');
    expect(layout.attributes[0].layoutSelect).toEqual([]);
  });

  it('should alert Schedule Service Layout', () => {
    const res = service.alertScheduleServiceLayout('errorTest');
    expect(res.icon?.label).toEqual('banca-regional-warning');
    expect(res.title?.label).toEqual('alert-title');
    expect(res.message?.label).toEqual('errorTest');
    expect(res.nextButtonMessage?.label).toEqual('schedule-alert-accept');
  });

  it('should reset Storage', () => {
    service.resetStorage();
    expect(persistStepStateService.sendParameters).toHaveBeenCalledWith({
      state: null,
      b2bRequestState: null,
      b2bPaymentState: null,
      stepState: null,
      selectedState: null,
      navigateStateParameters: null,
    });
  });

  it('should fill Strings', () => {
    expect(service.fillStrings('hola mundo', 'ho', 4)).toEqual('hola');
    expect(service.fillStrings('hola mundo', 'ho', 11)).toEqual('hola mundoho');
  });

  xit('should get Url Transfer Own SALVADOR', () => {
    environment.profile = EProfile.SALVADOR;
    expect(service.getUrlTransferOwn()).toEqual('/transfer/own');
  });

  xit('should get Url Transfer Own HONDURAS', () => {
    environment.profile = EProfile.HONDURAS;
    expect(service.getUrlTransferOwn()).toEqual('/transfer/own');
  });

  xit('should get Url Transfer Own PANAMA', () => {
    environment.profile = EProfile.PANAMA;
    expect(service.getUrlTransferOwn()).toEqual('/transfers-between-accounts');
  });

  xit('should get Url Transfer Own null', () => {
    environment.profile = null as any;
    expect(service.getUrlTransferOwn()).toEqual('/transfers-between-accounts');
  });

  xit('should get Url Transfer Third SALVADOR', () => {
    environment.profile = EProfile.SALVADOR;
    expect(service.getUrlTransferThird()).toEqual('/third-party-transfers');
  });

  xit('should get Url Transfer Third PANAMA', () => {
    environment.profile = EProfile.PANAMA;
    expect(service.getUrlTransferThird()).toEqual('/third-party-transfers');
  });

  xit('should get Url Transfer Third HONDURAS', () => {
    environment.profile = EProfile.HONDURAS;
    expect(service.getUrlTransferThird()).toEqual('/transfer/third');
  });

  xit('should get Url Transfer Third null', () => {
    environment.profile = null as any;
    expect(service.getUrlTransferThird()).toEqual('/third-party-transfers');
  });

  xit('should get Url Transfer Ach SALVADOR', () => {
    environment.profile = EProfile.SALVADOR;
    expect(service.getUrlTransferAch()).toEqual('/inter-banking-transfer');
  });

  xit('should get Url Transfer Ach PANAMA', () => {
    environment.profile = EProfile.PANAMA;
    expect(service.getUrlTransferAch()).toEqual('/inter-banking-transfer');
  });

  xit('should get Url Transfer Ach HONDURAS', () => {
    environment.profile = EProfile.HONDURAS;
    expect(service.getUrlTransferAch()).toEqual('/transfer/ach');
  });

  xit('should get Url Transfer Ach null', () => {
    environment.profile = null as any;
    expect(service.getUrlTransferAch()).toEqual('/inter-banking-transfer');
  });

  it('should filled Side Strings', () => {
    const res = service.filledSideStrings('hola mundo', 'mun', 5);
    expect(res).toEqual('hola ');
  });

  it('should filled Side Strings <', () => {
    const res = service.filledSideStrings('hola mundo', 'mun', 11);
    expect(res).toEqual('hola mundomun');
  });
});
