import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import { SPPMTableBody, SPPMTableHeader } from 'src/app/modules/payroll/manager-payroll/interfaces/sppd-manually.interface';
import { environment } from 'src/environments/environment';
import { AdfFormatService } from '@adf/components';
import { OnResize } from 'src/app/modules/shared/classes/on-risize';
import { SPMTableHeader } from '../../../interfaces/sp-manually.interface';

@Component({
  selector: 'byte-psm-table',
  templateUrl: './psm-table.component.html',
  styleUrls: ['./psm-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PsmTableComponent extends OnResize{
  @Input() registers: Array<any> = [];
  @Input() isSelectedEnabled: boolean = false;
  @Input() tableHeaders: Array<SPMTableHeader> = []
  @Output() onLoadListItems: EventEmitter<Array<any>> = new EventEmitter<Array<any>>()
  checkType: any = 'default';
  registerListSelected: Array<SPPMTableBody> = [];

  get tableHeaderList() {
    if (!this.isSelectedEnabled) {
      const [_, ...rest] = this.tableHeaders;
      return rest;
    }

    return this.tableHeaders;
  }


  get gridClassName() {
    return this.isSelectedEnabled ? 'full-grid' : 'default-grid';
  }

  get stylesColorResponsive() {
    return this.isSelectedEnabled ? 'color-blue' : 'color-white'
  }

  constructor(
    private adfFormat: AdfFormatService
  ) {
    super();
  }

  get registersQuantity() {
    return this.registers.length;
  }

  get totalAmount() {
    return `${environment.currency} ${ this.adfFormat.formatAmount(this.rawTotalAmount ?? 0) }`;
  }

  get currency() {
    return environment.currency;
  }

  get rawTotalAmount() {
    return  this.adfFormat.formatAmount(this.registers.reduce((acc, register) => acc + Number(register.amount), 0) ?? 0)  ;
  }

  onCheckChange(isChecked: boolean, item: any, index: number): void {
    this.registers = this.registers.map((register, i) => {
      if (i === index) { 
        return {
          ...register,
          isChecked: !register.isChecked
        };
      }
      return register;
    });
  
    this.registerListSelected = this.registers.filter(register => register.isChecked);
  }
  

  deleteRegisters() {
    if (this.registerListSelected.length === 0) return;

    this.registers = this.registers.filter(register => !register.isChecked);
    this.registerListSelected = [];
    this.onLoadListItems.emit(this.registers);
  }

}
