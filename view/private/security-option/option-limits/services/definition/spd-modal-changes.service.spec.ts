import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SpdModalChangesService } from './spd-modal-changes.service';

describe('SpdModalChangesService', () => {
    let service: SpdModalChangesService;

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

        service = TestBed.inject(SpdModalChangesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Alert Last Changes', () => {
        const res = service.buildAlertLastChanges('message');
        expect(res.icon?.label).toEqual('corporate-image banca-regional-periodo-contrasena')
        expect(res.title?.label).toEqual('title:last_changes_modified')
        expect(res.message?.label).toEqual('message')
        expect(res.nextButtonMessage?.label).toEqual('agree')
    })

    it('should build Alert Success Modified Changes', () => {
        const res = service.buildAlertSuccessModifiedChanges();
        expect(res.icon?.label).toEqual('corporate-image banca-regional-success')
        expect(res.title?.label).toEqual('title:success_modified')
        expect(res.message?.label).toEqual('description:success_modified')
        expect(res.nextButtonMessage?.label).toEqual('agree')
    })

});
