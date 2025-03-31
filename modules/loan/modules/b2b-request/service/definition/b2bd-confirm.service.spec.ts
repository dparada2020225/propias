import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { B2bdConfirmService } from './b2bd-confirm.service';

describe('B2bdConfirmService', () => {
    let service: B2bdConfirmService;

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

        service = TestBed.inject(B2bdConfirmService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
