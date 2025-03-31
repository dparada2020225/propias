import { AdfFormatService } from '@adf/components';
import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { UtilService } from 'src/app/service/common/util.service';
import { iConfirmationDataMock, iHeadBandLayoutMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { EConfirmationAction } from '../../../enum/payment-form.enum';
import { TpldConfirmService } from './tpld-confirm.service';

describe('TpldConfirmService', () => {
    let service: TpldConfirmService;

    beforeEach(() => {
        const formatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['getFormatDateTime', 'formatAmount'])
        const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['getUserDataTransaction'])
        const utilSpy = jasmine.createSpyObj('UtilService', ['getCurrencySymbolToIso', 'getProfileHeadBand'])
        const translateSpy = jasmine.createSpyObj('TranslateService', ['instant'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: AdfFormatService, useValue: formatServiceSpy },
                { provide: UtilWorkFlowService, useValue: utilWorkFlowSpy },
                { provide: UtilService, useValue: utilSpy },
                { provide: TranslateService, useValue: translateSpy },
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

        service = TestBed.inject(TpldConfirmService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should builder Layout Confirmation = DELETE', () => {
        const res = service.builderLayoutConfirmation(iConfirmationDataMock)
        expect(res.groupList[0].attributes).toHaveSize(7)
    })

    it('should builder Layout Confirmation = CREATE', () => {
        const datamock = { ...iConfirmationDataMock }
        datamock.action = EConfirmationAction.CREATE;
        const res = service.builderLayoutConfirmation(datamock)
        expect(res.groupList[0].attributes).toHaveSize(8)
    })

    it('should builder Layout Confirmation = PAYMENT', () => {
        const datamock = { ...iConfirmationDataMock }
        datamock.action = EConfirmationAction.PAYMENT;
        const res = service.builderLayoutConfirmation(datamock)
        expect(res.groupList[0].attributes).toHaveSize(7)
    })

    it('should builder Layout Confirmation = ERROR_PAYMENT', () => {
        const datamock = { ...iConfirmationDataMock }
        datamock.action = EConfirmationAction.ERROR_PAYMENT;
        const res = service.builderLayoutConfirmation(datamock)
        expect(res.groupList[0].attributes).toHaveSize(5)
    })

    it('should get Head Band Layout', () => {
        const res = service.getHeadBandLayout(iHeadBandLayoutMock);
        expect(res).toHaveSize(4)
    })

});
