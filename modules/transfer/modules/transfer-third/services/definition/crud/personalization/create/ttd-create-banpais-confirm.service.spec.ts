import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { TTDCreateConfirmService } from './ttd-create-banpais-confirm.service';
import { UtilService } from 'src/app/service/common/util.service';
import { TtdBaseCrudService } from '../../base/ttd-base-crud.service';
import { iTTDCreateConfirmMockThird } from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';

describe('TTDCreateConfirmService', () => {
  let service: TTDCreateConfirmService;
  let util: jasmine.SpyObj<UtilService>;
  let base: jasmine.SpyObj<TtdBaseCrudService>;
  beforeEach(() => {

    const utilSpy = jasmine.createSpyObj('UtilService', ['getLabelCurrency', 'getLabelProduct', 'getLabelStatus'])
    const baseSpy = jasmine.createSpyObj('TtdBaseCrudService', ['builderReadingBuilder'])

    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: UtilService, useValue: utilSpy },
        { provide: TtdBaseCrudService, useValue: baseSpy },

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

    service = TestBed.inject(TTDCreateConfirmService);
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    base = TestBed.inject(TtdBaseCrudService) as jasmine.SpyObj<TtdBaseCrudService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should builder Created Confirmation', () => {
    util.getLabelCurrency.and.returnValue('USD')
    util.getLabelProduct.and.returnValue('1')
    util.getLabelStatus.and.returnValue('ACTIVE')
    const res = service.builderCreatedConfirmation(iTTDCreateConfirmMockThird)
    expect(base.builderReadingBuilder).toHaveBeenCalledTimes(8);
    expect(res.groupList[0].attributes.length).toEqual(8)
    expect(res.title).toEqual('transfers-third-title')
    expect(res.subtitle).toEqual('add_third_party_accounts')
    expect(res.className).toEqual('padding-side')
  })

});
