import {TestBed} from '@angular/core/testing';

import {TtdBaseTableService} from './ttd-base-table.service';
import {UtilDefinitionService} from 'src/app/service/common/util-definition.service';
import {
  ilayoutAttributeBuilderMock,
  iTableAttributeHeaderMock
} from "../../../../../../../../../assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock";

describe('TtdBaseTableService', () => {
  let service: TtdBaseTableService;
  let util: jasmine.SpyObj<UtilDefinitionService>;

  beforeEach(() => {
    const utilSpy = jasmine.createSpyObj('UtilDefinitionService', ['buildDataTableHeader', 'buildDataLayoutAttribute'])
    TestBed.configureTestingModule({
      providers: [
        {provide: UtilDefinitionService, useValue: utilSpy},
      ]
    });
    service = TestBed.inject(TtdBaseTableService);
    util = TestBed.inject(UtilDefinitionService) as jasmine.SpyObj<UtilDefinitionService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should buiderTableHeader', () => {
    service.buiderTableHeader(iTableAttributeHeaderMock);
    expect(util.buildDataTableHeader).toHaveBeenCalledWith(iTableAttributeHeaderMock)
  })

  it('should builderLayoutAttribute', () => {
    service.builderLayoutAttribute(ilayoutAttributeBuilderMock);
    expect(util.buildDataLayoutAttribute).toHaveBeenCalledWith(ilayoutAttributeBuilderMock)
  })


});
