import { IAttributeReading, ILayoutAttribute } from '@adf/components';
import { Injectable } from '@angular/core';
import { IBasicAttributeVC, IlayoutAttributeBuilder } from 'src/app/models/build.interface';
import { IPrintData } from 'src/app/modules/transfer/interface/print-data-interface';
import { UtilDefinitionService } from 'src/app/service/common/util-definition.service';
import { IAttributePdf } from '../../../../../../../../models/build.interface';

@Injectable({
  providedIn: 'root'
})
export class TtdBaseCrudService {

  constructor(private utilDefinition: UtilDefinitionService) { }

  builderLayoutAttribute(attributes: IlayoutAttributeBuilder): ILayoutAttribute {
    return this.utilDefinition.buildDataLayoutAttribute(attributes)
  }

  builderReadingBuilder(attributes: IBasicAttributeVC): IAttributeReading {
    return this.utilDefinition.buildDataReadingBuilder(attributes)
  }

  builderPdfAttributes(attributes: IAttributePdf): IPrintData {
    return this.utilDefinition.buildDataPdf(attributes);
  }

}
