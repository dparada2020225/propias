import { ILayoutAttribute, ITableHeader } from '@adf/components';
import { Injectable } from '@angular/core';
import { ITableAttributeHeader, IlayoutAttributeBuilder } from 'src/app/models/build.interface';
import { UtilDefinitionService } from 'src/app/service/common/util-definition.service';

@Injectable({
  providedIn: 'root'
})
export class TtdBaseTableService {

  constructor(private util: UtilDefinitionService) { }

  buiderTableHeader(attributes: ITableAttributeHeader): ITableHeader {
    return this.util.buildDataTableHeader(attributes);
  }

  builderLayoutAttribute(attributes: IlayoutAttributeBuilder):ILayoutAttribute {
    return this.util.buildDataLayoutAttribute(attributes);
  }

}
