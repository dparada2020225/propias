import {TestBed} from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TteTransferManagerService} from "./tte-transfer-manager.service";
import {TteTransferFormService} from "./tte-transfer-form.service";
import {TteTransferFormBisvService} from "./tte-transfer-form-bisv.service";
import {EProfile} from "../../../../../../enums/profile.enum";
import {
    iTTEInitStep1RequestMock
} from "../../../../../../../assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock";

describe('TteTransferManagerService', () => {
    let service: TteTransferManagerService;

    let transferForm: jasmine.SpyObj<TteTransferFormService>;
    let transferFormBisv: jasmine.SpyObj<TteTransferFormBisvService>;

    beforeEach(() => {

        const transferFormSpy = jasmine.createSpyObj('TteTransferFormService', ['changeAccountAccredit', 'changeAccountDebited', 'formScreenBuilder'])
        const transferFormBisvSpy = jasmine.createSpyObj('TteTransferFormBisvService', ['changeAccountAccredit', 'changeAccountDebited', 'formScreenBuilderBisv'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                {provide: TteTransferFormService, useValue: transferFormSpy},
                {provide: TteTransferFormBisvService, useValue: transferFormBisvSpy},
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

        service = TestBed.inject(TteTransferManagerService);
        transferForm = TestBed.inject(TteTransferFormService) as jasmine.SpyObj<TteTransferFormService>;
        transferFormBisv = TestBed.inject(TteTransferFormBisvService) as jasmine.SpyObj<TteTransferFormBisvService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should formScreenBuilderStep1', () => {
        service['profile'] = EProfile.SALVADOR;
        service.formScreenBuilderStep1(iTTEInitStep1RequestMock)
        expect(transferFormBisv.formScreenBuilderBisv).toHaveBeenCalled();

        service['profile'] = EProfile.HONDURAS || EProfile.PANAMA;
        service.formScreenBuilderStep1(iTTEInitStep1RequestMock)
        expect(transferForm.formScreenBuilder).toHaveBeenCalled();

        service['profile'] = undefined as any;
        service.formScreenBuilderStep1(iTTEInitStep1RequestMock)
        expect(transferForm.formScreenBuilder).toHaveBeenCalled();
    })

    it('should changeAccountDebitedStep1', () => {
        const accountNumber: string = '8957854107'

        service['profile'] = EProfile.SALVADOR;
        service.changeAccountDebitedStep1(accountNumber)
        expect(transferFormBisv.changeAccountDebited).toHaveBeenCalled();

        service['profile'] = EProfile.HONDURAS || EProfile.PANAMA;
        service.changeAccountDebitedStep1(accountNumber)
        expect(transferForm.changeAccountDebited).toHaveBeenCalled();

        service['profile'] = undefined as any;
        service.changeAccountDebitedStep1(accountNumber)
        expect(transferForm.changeAccountDebited).toHaveBeenCalled();
    })

    it('should changeAccountAccreditStep1', () => {
        const accountNumber: string = '8957854107'

        service['profile'] = EProfile.SALVADOR;
        service.changeAccountAccreditStep1(accountNumber)
        expect(transferFormBisv.changeAccountAccredit).toHaveBeenCalled();

        service['profile'] = EProfile.HONDURAS || EProfile.PANAMA;
        service.changeAccountAccreditStep1(accountNumber)
        expect(transferForm.changeAccountAccredit).toHaveBeenCalled();

        service['profile'] = undefined as any;
        service.changeAccountAccreditStep1(accountNumber)
        expect(transferForm.changeAccountAccredit).toHaveBeenCalled();
    })

});
