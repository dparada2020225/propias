import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { TtdTableAssociatesService } from './ttd-table-banpais-associates.service';
import { UtilService } from '../../../../../../../../service/common/util.service';
import { TtdBaseTableService } from '../base/ttd-base-table.service';

describe('TtdTableAssociatesService', () => {
    let service: TtdTableAssociatesService;
    let util: jasmine.SpyObj<UtilService>;
    let base: jasmine.SpyObj<TtdBaseTableService>;

    beforeEach(() => {

        const utilSpy = jasmine.createSpyObj('UtilService', ['getTableOption'])
        const baseSpy = jasmine.createSpyObj('TtdBaseTableService', ['buiderTableHeader'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: UtilService, useValue: utilSpy },
                { provide: TtdBaseTableService, useValue: baseSpy }
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

        service = TestBed.inject(TtdTableAssociatesService);
        util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
        base = TestBed.inject(TtdBaseTableService) as jasmine.SpyObj<TtdBaseTableService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Third Table Layout', () => {
        const data = ['create', 'delete', 'update', 'transfer']
        util.getTableOption.and.returnValue(data)

        const res = service.buildThirdTableLayout(data)

        expect(base.buiderTableHeader).toHaveBeenCalledTimes(4)
        expect(res.options).toHaveSize(5)
        expect(res.headers).toHaveSize(4)
        expect(res.title).toEqual('third_parties')
    })

});
