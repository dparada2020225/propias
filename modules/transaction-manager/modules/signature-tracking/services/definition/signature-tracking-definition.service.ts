import { Injectable } from '@angular/core';
import { ITab, TabBuilder } from '../../interfaces/tabs.interface';
import {
  LayoutBuilder,
  LayoutType,
  LayoutAttributeBuilder,
  ILayoutAttribute,
  FormValidationsBuilder,
  ITableHeader,
  TableHeaderBuilder,
  TableStructuredBuilder,
} from '@adf/components';
import { SignatureTrackingTableKeys } from '../../enum/signature-tracking.enum';


@Injectable({
  providedIn: 'root'
})
export class SignatureTrackingDefinitionService {
  buildSearchLayout() {
    const attributes: ILayoutAttribute[] = [];

    const filterBoxValidations = new FormValidationsBuilder()
      .required(false)
      .build();

    const filterBoxAttribute = new LayoutAttributeBuilder()
      .label('fast-search')
      .placeholder('search_your_transactions')
      .class('grid-item-x-10')
      .controlName(SignatureTrackingTableKeys.FILTER_SEARCH)
      .imaskOptions({
        mask: /^.{0,60}x*$/
      })
      .layoutType(LayoutType.INPUT)
      .formValidations(filterBoxValidations)
      .build();
    attributes.push(filterBoxAttribute);

    return new LayoutBuilder()
      .class('no-border filter-form')
      .attributes(attributes)
      .build();
  }
  buildTabDefinition() {
    const tabList: ITab[] = [];

    const tabEnteredAccounts = new TabBuilder()
      .id('entered')
      .label('entered')
      .icon('sprint2-icon-ingresadas')
      .build();
    tabList.push(tabEnteredAccounts);


    const tabToAuthorizedAccounts = new TabBuilder()
      .id('toAuthorize')
      .label('to_authorize')
      .icon('sprint2-icon-por-autorizar')
      .build();
    tabList.push(tabToAuthorizedAccounts);

    const tabAuthorizedAccounts = new TabBuilder()
      .id('authorized')
      .label('authorized')
      .icon('sprint2-icon-autorizadas')
      .build();
    tabList.push(tabAuthorizedAccounts);

    return tabList;

  }

  buildSignatoryUsersTable(users: any[]) {
    const tableHeaders: ITableHeader[] = [];

    const dateCreatedHeader = new TableHeaderBuilder()
      .label('menu_user')
      .class('head-date')
      .key(SignatureTrackingTableKeys.USER_CREATED)
      .build();
    tableHeaders.push(dateCreatedHeader);


    const transactionHeader = new TableHeaderBuilder()
      .label('currency_name_header')
      .class('head-transaction')
      .key(SignatureTrackingTableKeys.USER_NAME)
      .build();
    tableHeaders.push(transactionHeader);


    return new TableStructuredBuilder()
      .head(tableHeaders)
      .body(users)
      .manageAlertMessage({
        typeAlert: 'warning',
        message: 'empty_signatory_table'
      })
      .build();
  }



}
