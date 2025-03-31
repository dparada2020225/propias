import { AdfFormatService } from '@adf/components';
import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { b2bdModalInterfaceMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { B2bdModalService } from './b2bd-modal.service';

describe('B2bdModalService', () => {
  let service: B2bdModalService;
  let formatService: jasmine.SpyObj<AdfFormatService>;
  let translate: jasmine.SpyObj<TranslateService>;
  let utils: jasmine.SpyObj<UtilService>;

  beforeEach(() => {

    const formatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount', 'getFormatDateTime'])
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['parsePercent'])

    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: AdfFormatService, useValue: formatServiceSpy },
        { provide: TranslateService, useValue: translateSpy },
        { provide: UtilService, useValue: utilsSpy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });

    service = TestBed.inject(B2bdModalService);
    formatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should builder Modal Layout', () => {
    formatService.getFormatDateTime.and.returnValue({
      date: '12121212'
    } as any)
    const modalLayout = service.builderModalLayout(b2bdModalInterfaceMock)
    expect(modalLayout.titleModal).toEqual('request-b2b')
    expect(modalLayout.attributeList[0].attributes).toHaveSize(11);
    expect(formatService.formatAmount).toHaveBeenCalledTimes(4)
    expect(formatService.getFormatDateTime).toHaveBeenCalledTimes(2);
    expect(translate.instant).toHaveBeenCalledTimes(1);
    expect(utils.parsePercent).toHaveBeenCalledTimes(1);
  })

});
