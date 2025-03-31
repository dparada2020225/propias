import { AdfFormatService } from '@adf/components';
import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { iB2bConsultationDetailMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { B2bdConsultDefinitionService } from './b2bd-consult-definition.service';

describe('B2bdConsultDefinitionService', () => {
    let service: B2bdConsultDefinitionService;
    let adfFormatService: jasmine.SpyObj<AdfFormatService>;
    let utilService: jasmine.SpyObj<UtilService>;

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

        service = TestBed.inject(B2bdConsultDefinitionService);
        adfFormatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
        utilService = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should capitalize', () => {
        const req = service.capitalize('capitalize')
        expect(req).toEqual('Capitalize')
    })

    it('should capitalize but value not exist', () => {
        const req = service.capitalize(null as any)
        expect(req).toEqual('undefined')
    })

    it('should build PDf File', () => {
        adfFormatService.getFormatDateTime.and.returnValue({
            standard: '121212'
        } as any)
        const req = service.buildPDfFile(iB2bConsultationDetailMock, 'USD');
        expect(adfFormatService.formatAmount).toHaveBeenCalledTimes(9)
        expect(adfFormatService.getFormatDateTime).toHaveBeenCalledTimes(3)
        expect(utilService.getLabelCurrency).toHaveBeenCalledTimes(1)
        expect(utilService.parsePercent).toHaveBeenCalledTimes(2)
        expect(req).toHaveSize(25)
    })

});
