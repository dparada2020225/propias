import { TestBed } from '@angular/core/testing';

import { AdfFormatService } from '@adf/components';
import { SmartidNavigationService, StorageService } from '@adf/security';
import { TranslateService } from '@ngx-translate/core';
import { EProfile } from 'src/app/enums/profile.enum';
import { EVersionHandler } from 'src/app/enums/version-handler.enum';
import { IHeadBandLayout, IUserDataModalPdf, IUserDataTransaction } from 'src/app/models/util-work-flow.interface';
import { iAccount } from 'src/assets/mocks/modules/signature-tracking/mocksDetailTransaction';
import { environment } from 'src/environments/environment';
import { UtilWorkFlowService } from './util-work-flow.service';
import { UtilService } from './util.service';

describe('UtilWorkFlowService', () => {
  let service: UtilWorkFlowService;
  let translate: jasmine.SpyObj<TranslateService>;
  let util: jasmine.SpyObj<UtilService>;
  let storage: jasmine.SpyObj<StorageService>;
  let smartIdNavigationService: jasmine.SpyObj<SmartidNavigationService>;

  beforeEach(() => {

    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant'])
    const utilSpy = jasmine.createSpyObj('UtilService', ['hyphenationValidation', 'separatorValidation', 'getProductAcronym', 'getUserName', 'getProfileHeadBand', 'geCurrencSymbol'])
    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem', 'addItem'])
    const smartIdNavigationServiceSpy = jasmine.createSpyObj('SmartidNavigationService', ['markNavigation'])
    const adfFormatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount'])

    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateSpy },
        { provide: UtilService, useValue: utilSpy },
        { provide: StorageService, useValue: storageSpy },
        { provide: SmartidNavigationService, useValue: smartIdNavigationServiceSpy },
        { provide: AdfFormatService, useValue: adfFormatServiceSpy },
      ]
    });
    service = TestBed.inject(UtilWorkFlowService);
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    storage = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    smartIdNavigationService = TestBed.inject(SmartidNavigationService) as jasmine.SpyObj<SmartidNavigationService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get User Data Transaction == SALVADOR', () => {
    util.hyphenationValidation.and.returnValue('/');
    util.separatorValidation.and.returnValue('-');
    util.getProductAcronym.and.returnValue('test');
    environment.profile = EProfile.SALVADOR

    const dto: IUserDataTransaction = {
      account: '588609087',
      alias: 'test',
      name: 'test',
      currency: 'USD',
      product: 1
    }

    expect(service.getUserDataTransaction(dto)).toBeDefined();
  })

  it('should get User Data Transaction == HONDURAS', () => {
    util.separatorValidation.and.returnValue('-');
    environment.profile = EProfile.HONDURAS

    const dto: IUserDataTransaction = {
      account: '588609087',
      alias: 'test',
      name: 'test',
      currency: 'USD',
      product: 1
    }

    expect(service.getUserDataTransaction(dto)).toBeDefined();
  })

  it('should get User Data Modal Pdf', () => {
    util.separatorValidation.and.returnValue('-')
    const dto: IUserDataModalPdf = {
      account: '588609087',
      name: 'pdf'
    }
    expect(service.getUserDataModalPdf(dto)).toEqual(`${dto?.account} - ${dto.name}`)
  })

  const dto: IHeadBandLayout = {
    date: {
      fullFormat: 'yyyy-MM-dd',
      numberFormat: '12-12-12',
      date: '23',
      hour: '12:12:12',
      hourSuffix: '78',
      object: {
        year: 2023,
        month: 12,
        day: 23,
        hour: 12,
        minute: 12,
        second: 12
      },
      standard: '12/12/12'
    },
    reference: 'LIUSDA'
  }

  it('should get HeadBand Layout', () => {
    environment.profile = EProfile.HONDURAS;
    expect(service.getHeadBandLayout(dto)).toHaveSize(4)
  })

  it('should get HeadBand Layout = SALVADOR', () => {
    environment.profile = EProfile.SALVADOR;
    expect(service.getHeadBandLayout(dto)).toHaveSize(3)
  })

  it('should get Head Band Layout Confirm == HONDURAS', () => {
    environment.profile = EProfile.HONDURAS;
    expect(service.getHeadBandLayoutConfirm(dto)).toHaveSize(4)
  })

  it('should get Head Band Layout Confirm == SALVADOR', () => {
    environment.profile = EProfile.SALVADOR;
    expect(service.getHeadBandLayoutConfirm(dto)).toHaveSize(4)
    expect(translate.instant).toHaveBeenCalledTimes(3)
  })

  it('should handle Mark Secure Navigation', () => {
    storage.getItem.and.returnValue(JSON.stringify({
      'configs': {
        'smart-id': {
          'enabled': true
        }
      },
      'trackingEnabled': true
    }))

    service.handleMarkSecureNavigation('test/test?smarcore=true')
    expect(smartIdNavigationService.markNavigation).toHaveBeenCalled();
  })

  it('should build Delete Favorite Alert', () => {
    expect(service.buildDeleteFavoriteAlert().icon?.label).toEqual('banca-regional-warning')
    expect(service.buildDeleteFavoriteAlert().title?.label).toEqual('delete');
    expect(service.buildDeleteFavoriteAlert().message?.label).toEqual('delete_message_modal_favorite');
    expect(service.buildDeleteFavoriteAlert().nextButtonMessage?.label).toEqual('agree');
    expect(service.buildDeleteFavoriteAlert().cancelButtonMessage?.label).toEqual('cancel');
  })

  it('should build Delete Ach Alert', () => {
    expect(service.buildDeleteAchAlert().icon?.label).toEqual('banca-regional-warning')
    expect(service.buildDeleteAchAlert().title?.label).toEqual('delete');
    expect(service.buildDeleteAchAlert().message?.label).toEqual('delete_message_modal');
    expect(service.buildDeleteAchAlert().nextButtonMessage?.label).toEqual('agree');
    expect(service.buildDeleteAchAlert().cancelButtonMessage?.label).toEqual('cancel');
  })

  it('should build Alert To Update', () => {
    expect(service.buildAlertToUpdate().icon?.label).toEqual('banca-regional-warning')
    expect(service.buildAlertToUpdate().title?.label).toEqual('confirmation');
    expect(service.buildAlertToUpdate().message?.label).toEqual('update_message_modal');
    expect(service.buildAlertToUpdate().nextButtonMessage?.label).toEqual('agree');
    expect(service.buildAlertToUpdate().cancelButtonMessage?.label).toEqual('cancel');
  })

  it('should build Account Resume Attribute For Select Accounts', () => {
    expect(service.buildAccountResumeAttributeForSelectAccounts(iAccount)).toHaveSize(2)
  })

  it('should build Images To Modal', () => {
    expect(service.buildImagesToModal()).toHaveSize(2)
    expect(service.buildImagesToModal()[0].url).toEqual(`assets/images/logos/${environment.profile}_logo_${EVersionHandler.ASSETS}.png`)
    expect(service.buildImagesToModal()[1].url).toEqual(`assets/images/logos/${environment.profile}_bp_logo_${EVersionHandler.ASSETS}.png`)
  })

});
