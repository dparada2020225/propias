import {TestBed} from '@angular/core/testing';

import {TtdBaseCrudService} from './ttd-base-crud.service';
import {UtilDefinitionService} from 'src/app/service/common/util-definition.service';
import {
  iAttributePdfMock,
  iBasicAttributeVCMock,
  ilayoutAttributeBuilderMock
} from "../../../../../../../../../assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock";

describe('TtdBaseCrudService', () => {
  let service: TtdBaseCrudService;
  let utilDefinition: jasmine.SpyObj<UtilDefinitionService>;

  beforeEach(() => {

    const utilDefinitionSpy = jasmine.createSpyObj('UtilDefinitionService', ['buildDataPdf', 'buildDataReadingBuilder', 'buildDataLayoutAttribute'])

    TestBed.configureTestingModule({
      providers: [
        {provide: UtilDefinitionService, useValue: utilDefinitionSpy},
      ]
    });
    service = TestBed.inject(TtdBaseCrudService);
    utilDefinition = TestBed.inject(UtilDefinitionService) as jasmine.SpyObj<UtilDefinitionService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return ILayoutAttribute', () => {
    service.builderLayoutAttribute(ilayoutAttributeBuilderMock)
    expect(utilDefinition.buildDataLayoutAttribute).toHaveBeenCalledWith(ilayoutAttributeBuilderMock)
  })

  it('should return IAttributeReading', () => {
    service.builderReadingBuilder(iBasicAttributeVCMock)
    expect(utilDefinition.buildDataReadingBuilder).toHaveBeenCalledWith(iBasicAttributeVCMock)
  })

  it('should return IPrintData', () => {
    service.builderPdfAttributes(iAttributePdfMock)
    expect(utilDefinition.buildDataPdf).toHaveBeenCalledWith(iAttributePdfMock)
  })

});
