import { IAttributeReading } from '@adf/components';
import { Injectable } from '@angular/core';
import { IBasicAttributeVC } from 'src/app/models/build.interface';
import { UtilDefinitionService } from 'src/app/service/common/util-definition.service';

@Injectable({
  providedIn: 'root',
})
export class OtdTransferBaseVoucherModalService {
  constructor(private utilDefinition: UtilDefinitionService) {}

  builderAttributes(attribute: IBasicAttributeVC): IAttributeReading {
    return this.utilDefinition.buildDataReadingBuilder(attribute);
  }
}
