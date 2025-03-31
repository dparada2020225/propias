import { AdfFormatService } from '@adf/components';
import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { iB2bRequestResponseMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { B2bdVoucherService } from './b2bd-voucher.service';

describe('B2bdVoucherService', () => {
    let service: B2bdVoucherService;
    let formatService: jasmine.SpyObj<AdfFormatService>;
    let utils: jasmine.SpyObj<UtilService>;

    beforeEach(() => {

        const formatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount', 'getFormatDateTime'])
        const utilsSpy = jasmine.createSpyObj('UtilService', ['parsePercent'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: AdfFormatService, useValue: formatServiceSpy },
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

        service = TestBed.inject(B2bdVoucherService);
        formatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
        utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should builder Layout Voucher', () => {
        formatService.getFormatDateTime.and.returnValue({
            date: '12121212'
        } as any)
        const res = service.builderLayoutVoucher(iB2bRequestResponseMock, 'USD')
        expect(res.title).toEqual('b2b-request-title')
        expect(res.subtitle).toEqual('disbursement-confirmation')
        expect(res.className).toEqual('padding-side')
        expect(res.groupList[0].attributes).toHaveSize(10)
        expect(formatService.formatAmount).toHaveBeenCalledTimes(4)
        expect(formatService.getFormatDateTime).toHaveBeenCalledTimes(2)
        expect(utils.parsePercent).toHaveBeenCalledTimes(1)
    })

});
