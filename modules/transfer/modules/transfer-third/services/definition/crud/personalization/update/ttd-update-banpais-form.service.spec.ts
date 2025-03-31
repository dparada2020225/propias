import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { TTDUpdateFormService } from './ttd-update-banpais-form.service';
import { iThirdTransfersAccountsMock } from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';
import { UtilService } from 'src/app/service/common/util.service';
import { TtdBaseCrudService } from '../../base/ttd-base-crud.service';

describe('TTDUpdateFormService', () => {
    let service: TTDUpdateFormService;
    let util: jasmine.SpyObj<UtilService>;
    let base: jasmine.SpyObj<TtdBaseCrudService>;

    beforeEach(() => {

        const utilSpy = jasmine.createSpyObj('UtilService', ['getLabelStatus', 'getLabelCurrency'])
        const baseSpy = jasmine.createSpyObj('TtdBaseCrudService', ['builderLayoutAttribute'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: UtilService, useValue: utilSpy },
                { provide: TtdBaseCrudService, useValue: baseSpy }
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

        service = TestBed.inject(TTDUpdateFormService);
        util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
        base = TestBed.inject(TtdBaseCrudService) as jasmine.SpyObj<TtdBaseCrudService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Update Account Layout', () => {
        util.getLabelCurrency.and.returnValue('usd')
        util.getLabelStatus.and.returnValue('ACTIVE')
        const res = service.buildUpdateAccountLayout(iThirdTransfersAccountsMock)
        expect(util.getLabelStatus).toHaveBeenCalled()
        expect(util.getLabelCurrency).toHaveBeenCalled()
        expect(base.builderLayoutAttribute).toHaveBeenCalledTimes(7)
        expect(res.attributes).toHaveSize(7)
        expect(res.title).toEqual('transfers-third-title')
        expect(res.subtitle).toEqual('title.edit_third_party_account')
        expect(res.class).toEqual('third-edit-layout padding-side')
    })

});
