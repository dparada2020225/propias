import { AdfFormatService } from '@adf/components';
import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { iB2bConsultationDetailMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { B2bdConsultVoucherService } from './b2bd-consult-voucher.service';

describe('B2bdConsultVoucherService', () => {
    let service: B2bdConsultVoucherService;
    let adfFormatService: jasmine.SpyObj<AdfFormatService>;

    beforeEach(() => {

        const adfFormatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount', 'getFormatDateTime'])
        const utilServiceSpy = jasmine.createSpyObj('UtilService', ['getLabelCurrency', 'parsePercent'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: AdfFormatService, useValue: adfFormatServiceSpy },
                { provide: UtilService, useValue: utilServiceSpy },
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

        service = TestBed.inject(B2bdConsultVoucherService);
        adfFormatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should builder Voucher Layout', () => {
        adfFormatService.getFormatDateTime.and.returnValue({
            standard: '121212'
        } as any)
        const rs = service.builderVoucherLayout(iB2bConsultationDetailMock, 'USD')
        expect(rs.className).toEqual('padding-side')
        expect(rs.groupList[0].attributes).toHaveSize(16)

    })
});
