import { AdfFormatService } from '@adf/components';
import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { iPaymentAccountMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { B2bdPaymentTableService } from './b2bd-payment-table.service';

describe('B2bdPaymentTableService', () => {
    let service: B2bdPaymentTableService;
    let adfFormatService: jasmine.SpyObj<AdfFormatService>;

    beforeEach(() => {
        const adfFormatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount', 'getFormatDateTime'])
        TestBed.configureTestingModule({
            declarations: [],
            providers: [{ provide: AdfFormatService, useValue: adfFormatServiceSpy },],
            imports: [
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader,
                    },
                }),
            ],
        });

        service = TestBed.inject(B2bdPaymentTableService);
        adfFormatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build table Layout', () => {
        adfFormatService.getFormatDateTime.and.returnValue({
            standard: 'day'
        } as any)
        const table = service.tableLayout([iPaymentAccountMock], 'USD');
        expect(table.headers.length).toEqual(4)
        expect(table.title).toEqual('dollars')
        expect(table.manageAlertMessage).toEqual({
            typeAlert: 'warning',
            message: 'errorB2b:b2bAccountEmptyList'
        })
        expect(table.options.length).toEqual(1)
        expect(adfFormatService.formatAmount).toHaveBeenCalledTimes(1)
        expect(adfFormatService.getFormatDateTime).toHaveBeenCalledTimes(1)
    })

});
