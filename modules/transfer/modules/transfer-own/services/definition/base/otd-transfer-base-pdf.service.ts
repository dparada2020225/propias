import { Injectable } from '@angular/core';
import { IAttributePdf } from 'src/app/models/build.interface';
import { IPrintData } from 'src/app/modules/transfer/interface/print-data-interface';
import { UtilDefinitionService } from 'src/app/service/common/util-definition.service';

@Injectable({
  providedIn: 'root'
})
export class OtdTransferBasePdfService {

  constructor(private utilDefinition: UtilDefinitionService) { }

  builderAttributes(attribute: IAttributePdf): IPrintData {
    return this.utilDefinition.buildDataPdf(attribute);
  }
}
