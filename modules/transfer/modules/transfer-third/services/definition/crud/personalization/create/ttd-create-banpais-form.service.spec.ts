import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { TTDCreateFormService } from './ttd-create-banpais-form.service';
import { UtilService } from 'src/app/service/common/util.service';
import { TtdBaseCrudService } from '../../base/ttd-base-crud.service';
import { iGetThirdTransferResponseMock } from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';

describe('TTDCreateFormService', () => {
    let service: TTDCreateFormService;
    let util: jasmine.SpyObj<UtilService>;
    let base: jasmine.SpyObj<TtdBaseCrudService>;

    beforeEach(() => {

        const utilSpy = jasmine.createSpyObj('UtilService', ['getLabelProduct', 'getLabelStatus', 'getLabelCurrency'])
        const baseSpy = jasmine.createSpyObj('TtdBaseCrudService', ['builderLayoutAttribute'])

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

        service = TestBed.inject(TTDCreateFormService);
        util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
        base = TestBed.inject(TtdBaseCrudService) as jasmine.SpyObj<TtdBaseCrudService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Create Account Layout', () => {
        util.getLabelProduct.and.returnValue('INPUT')
        util.getLabelStatus.and.returnValue('ACTIVE')
        util.getLabelCurrency.and.returnValue('USD')
        const res = service.buildCreateAccountLayout(iGetThirdTransferResponseMock)
        expect(base.builderLayoutAttribute).toHaveBeenCalledTimes(7)
        expect(res.title).toEqual('transfers-third-title')
        expect(res.subtitle).toEqual('add_third_party_account')
        expect(res.class).toEqual('third-crate-layout padding-side')
        expect(res.attributes.length).toEqual(7)
    })

});
