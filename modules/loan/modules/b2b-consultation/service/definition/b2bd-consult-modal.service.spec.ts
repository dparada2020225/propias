import { AdfFormatService } from '@adf/components';
import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { iB2BDConsultModalParametersMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { B2bdConsultModalService } from './b2bd-consult-modal.service';

describe('B2bdConsultModalService', () => {
    let service: B2bdConsultModalService;
    let adfFormatService: jasmine.SpyObj<AdfFormatService>;
    let translate: jasmine.SpyObj<TranslateService>;
    let utilService: jasmine.SpyObj<UtilService>;

    beforeEach(() => {

        const adfFormatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount', 'getFormatDateTime'])
        const translateSpy = jasmine.createSpyObj('TranslateService', ['instant'])
        const utilServiceSpy = jasmine.createSpyObj('UtilService', ['getLabelCurrency', 'parsePercent'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: AdfFormatService, useValue: adfFormatServiceSpy },
                { provide: TranslateService, useValue: translateSpy },
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

        service = TestBed.inject(B2bdConsultModalService);
        adfFormatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
        translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
        utilService = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should builder Modal Layout', () => {

        adfFormatService.getFormatDateTime.and.returnValue({
            standard: '121212'
        } as any)

        const res = service.builderModalLayout(iB2BDConsultModalParametersMock);
        expect(res.titleModal).toEqual('consultation-b2b')
        expect(res.attributeList.length).toEqual(3)
        expect(adfFormatService.formatAmount).toHaveBeenCalledTimes(9)
        expect(adfFormatService.getFormatDateTime).toHaveBeenCalledTimes(3)
        expect(translate.instant).toHaveBeenCalledTimes(1)
        expect(utilService.getLabelCurrency).toHaveBeenCalledTimes(1)
        expect(utilService.parsePercent).toHaveBeenCalledTimes(2)
    })

});
