import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { TTDUpdateConfirmService } from './ttd-update-banpais-confirm.service';
import { TtdBaseCrudService } from '../../base/ttd-base-crud.service';
import { iTTDUpdateConfirmMockThird } from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';

describe('TTDUpdateConfirmService', () => {
    let service: TTDUpdateConfirmService;
    let base: jasmine.SpyObj<TtdBaseCrudService>;

    beforeEach(() => {
        const baseSpy = jasmine.createSpyObj('TtdBaseCrudService', ['builderReadingBuilder'])
        TestBed.configureTestingModule({
            declarations: [],
            providers: [{ provide: TtdBaseCrudService, useValue: baseSpy },
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

        service = TestBed.inject(TTDUpdateConfirmService);
        base = TestBed.inject(TtdBaseCrudService) as jasmine.SpyObj<TtdBaseCrudService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should builder Update Confirmation', () => {
        const res = service.builderUpdateConfirmation(iTTDUpdateConfirmMockThird)
        expect(base.builderReadingBuilder).toHaveBeenCalledTimes(3)
        expect(res.groupList[0].attributes).toHaveSize(3);
        expect(res.className).toEqual('padding-side')
        expect(res.title).toEqual('transfers-third-title')
        expect(res.subtitle).toEqual('third_party_account_modification')
    })

});
