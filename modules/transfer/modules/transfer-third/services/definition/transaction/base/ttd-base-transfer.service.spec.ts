import {TestBed} from '@angular/core/testing';

import {TtdBaseTransferService} from './ttd-base-transfer.service';
import {UtilDefinitionService} from 'src/app/service/common/util-definition.service';
import {
  iAttributePdfMock,
  iBasicAttributeVCMock,
  ilayoutAttributeBuilderMock
} from "../../../../../../../../../assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock";

describe('TtdBaseTransferService', () => {
  let service: TtdBaseTransferService;
  let utilDefinition: jasmine.SpyObj<UtilDefinitionService>;

  beforeEach(() => {

    const utilDefinitionSpy = jasmine.createSpyObj('UtilDefinitionService', ['buildDataLayoutAttribute', 'buildDataReadingBuilder', 'buildDataPdf'])

    TestBed.configureTestingModule({
      providers: [
        {provide: UtilDefinitionService, useValue: utilDefinitionSpy},
      ]
    });
    service = TestBed.inject(TtdBaseTransferService);
    utilDefinition = TestBed.inject(UtilDefinitionService) as jasmine.SpyObj<UtilDefinitionService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should builderLayoutAttributes', () => {
    service.builderLayoutAttributes(ilayoutAttributeBuilderMock);
    expect(utilDefinition.buildDataLayoutAttribute).toHaveBeenCalledWith(ilayoutAttributeBuilderMock)
  })

  it('should builderDataReading', () => {
    service.builderDataReading(iBasicAttributeVCMock);
    expect(utilDefinition.buildDataReadingBuilder).toHaveBeenCalledWith(iBasicAttributeVCMock)
  })

  it('should builderDataPdf', () => {
    service.builderDataPdf(iAttributePdfMock);
    expect(utilDefinition.buildDataPdf).toHaveBeenCalledWith(iAttributePdfMock)
  })

});
