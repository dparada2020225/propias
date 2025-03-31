import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BrowserInfoService } from './browser-info.service';

describe('BrowserInfoService', () => {
    let service: BrowserInfoService;

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

        service = TestBed.inject(BrowserInfoService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return an object with the detected browser information', () => {
        const browserInfo = service.getBrowserInfo();
        expect(browserInfo).toBeDefined();
        expect(browserInfo.name).toBeDefined();
        expect(browserInfo.version).toBeDefined();
        expect(browserInfo.operatingSystem).toBeDefined();
        expect(browserInfo.mobile).toBeDefined();
    });
});
