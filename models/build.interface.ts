import { IDataLayoutSelect, IFormValidations, IMinDate, ISelectedOption, LayoutType } from '@adf/components';

export interface IBasicAttribute {
  label: string;
  placeholder?: string;
  class?: string;
}

export interface IBasicAttributeVC {
  label: string;
  placeholder?: string;
  class?: string;
  values?: string[];
}

export interface IAttributePdf {
  label?: string;
  title?: boolean;
  value?: string;
  secondColumn?: boolean;
}

export type IlayoutAttributeBuilder = {
  label: string;
  class: string;
  layoutType: LayoutType;
  controlName: string;
  placeholder?: string;
  limit?: number;
  formValidations?: IFormValidations;
  imaskOptions?: any;
  layoutSelect?: IDataLayoutSelect[];
  tooltip?: any;
  minDate?: IMinDate;
  maxDate?: IMinDate;
};

export type ITableAttributeHeader = {
  label: string;
  class: string;
  key: string;
  isActive?: boolean;
  selected?: ISelectedOption;
};
