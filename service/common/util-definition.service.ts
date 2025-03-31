import {
  AttributeReadingBuilder,
  IAttributeReading,
  ILayoutAttribute,
  LayoutAttributeBuilder,
  TableHeaderBuilder
} from '@adf/components';
import {Injectable} from '@angular/core';
import {
  IAttributePdf,
  IBasicAttributeVC,
  IlayoutAttributeBuilder,
  ITableAttributeHeader
} from 'src/app/models/build.interface';
import {PrintDataBuilder} from 'src/app/modules/transfer/interface/print-data-interface';

@Injectable({
  providedIn: 'root',
})
export class UtilDefinitionService {
  buildDataPdf(data: IAttributePdf) {
    const attribute = new PrintDataBuilder()
      .label(data.label!)
      .title(data.title!)
      .value(data.value!)
      .secondColumn(data.secondColumn!)
      .build();
    return attribute;
  }

  buildDataReadingBuilder(data: IBasicAttributeVC): IAttributeReading {
    const attributes = new AttributeReadingBuilder().label(data.label).values(data.values!).class(data.class!).build();
    return attributes;
  }

  buildDataLayoutAttribute(data: IlayoutAttributeBuilder): ILayoutAttribute {
    return new LayoutAttributeBuilder()
      .label(data.label)
      .class(data.class)
      .layoutType(data.layoutType)
      .controlName(data.controlName)
      .placeholder(data.placeholder!)
      .formValidations(data.formValidations!)
      .imaskOptions(data.imaskOptions)
      .layoutSelect(data.layoutSelect!)
      .tooltip(data.tooltip)
      .minDate(data.minDate!)
      .maxDate(data.maxDate!)
      .build();
  }

  buildDataTableHeader(data: ITableAttributeHeader) {
    const attributes = new TableHeaderBuilder()
      .label(data.label)
      .class(data.class)
      .key(data.key)
      .isActive(data.isActive!)
      .selected(data.selected!)
      .build();

    return attributes;
  }
}
