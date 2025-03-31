import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { iTPLVoucherStartupParametersMock } from '../../../../../../../../../assets/mocks/modules/loan/loan.data.mock';
import { TplUpdateConfirmService } from './tpl-update-confirm.service';

describe('TplUpdateConfirmService', () => {
    let service: TplUpdateConfirmService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [],
            imports: [
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader,
                    },
                }),
            ],
        });

        service = TestBed.inject(TplUpdateConfirmService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should builder Layout Confirmation', () => {
        const res = service.builderLayoutConfirmation(iTPLVoucherStartupParametersMock)
        expect(res.groupList[0].attributes).toHaveSize(3)
        expect(res.title).toEqual('payments_loans')
        expect(res.subtitle).toEqual('updateTPL_subtitule')
    })

});
