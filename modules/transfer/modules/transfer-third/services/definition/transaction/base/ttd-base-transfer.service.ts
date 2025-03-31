import {IAttributeReading, ILayoutAttribute} from '@adf/components';
import {Injectable} from '@angular/core';
import {IAttributePdf, IBasicAttributeVC, IlayoutAttributeBuilder} from 'src/app/models/build.interface';
import {IPrintData} from 'src/app/modules/transfer/interface/print-data-interface';
import {UtilDefinitionService} from 'src/app/service/common/util-definition.service';

@Injectable({
  providedIn: 'root'
})
export class TtdBaseTransferService {

  constructor(private utilDefinition: UtilDefinitionService) {
  }

  builderLayoutAttributes(attributess: IlayoutAttributeBuilder): ILayoutAttribute {
    return this.utilDefinition.buildDataLayoutAttribute(attributess)
  }

  builderDataReading(attributess: IBasicAttributeVC): IAttributeReading {
    return this.utilDefinition.buildDataReadingBuilder(attributess)
  }

  builderDataPdf(attributes: IAttributePdf): IPrintData {
    return this.utilDefinition.buildDataPdf(attributes)
  }

}
