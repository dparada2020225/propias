import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { TTDDeleteConfirmService } from './ttd-delete-banpais-confirm.service';
import { UtilService } from 'src/app/service/common/util.service';
import { TtdBaseCrudService } from '../../base/ttd-base-crud.service';
import { iTTDDeleteConfirmMock } from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';

describe('TTDDeleteConfirmService', () => {
    let service: TTDDeleteConfirmService;
    let util: jasmine.SpyObj<UtilService>;
    let base: jasmine.SpyObj<TtdBaseCrudService>;

    beforeEach(() => {

        const utilSpy = jasmine.createSpyObj('UtilService', ['getLabelCurrency', 'getLabelProduct'])
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

        service = TestBed.inject(TTDDeleteConfirmService);
        util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
        base = TestBed.inject(TtdBaseCrudService) as jasmine.SpyObj<TtdBaseCrudService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should builder Delete Confirmation', () => {
        util.getLabelCurrency.and.returnValue('USD')
        util.getLabelProduct.and.returnValue('1')
        const res = service.builderDeleteConfirmation(iTTDDeleteConfirmMock);
        expect(base.builderReadingBuilder).toHaveBeenCalledTimes(7)
        expect(res.groupList[0].attributes).toHaveSize(7)
        expect(res.title).toEqual('transfers-third-title')
        expect(res.subtitle).toEqual('third_party_account_deletion')
        expect(res.className).toEqual('padding-side')
    })

});
