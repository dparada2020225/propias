import {Component, EventEmitter, Input, Output} from '@angular/core';
import {OnResize} from '../../../../shared/classes/on-risize';
import {SPPMTableBody, SPPMTableHeader} from '../../interfaces/sppd-manually.interface';
import {environment} from '../../../../../../environments/environment';
import {AdfFormatService} from "@adf/components";

@Component({
  selector: 'byte-pmp-table',
  templateUrl: './sppm-table.component.html',
  styleUrls: ['./sppm-table.component.scss']
})
export class SppmTableComponent extends OnResize{
  @Input() registers: Array<any> = [];
  @Input() isSelectedEnabled: boolean = false;
  @Input() tableHeaders: Array<SPPMTableHeader> = []
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

  onCheckChange(isChecked: boolean, item: any): void {
    this.registers = this.registers.map(register => {
      if (register.accountNumber === item.accountNumber) {
        return {
          ...register,
          isChecked: !register.isChecked
        }
      }
      return register;
    })

    this.registerListSelected = this.registers.filter(register => register.isChecked);
  }

  deleteRegisters() {
    if (this.registerListSelected.length === 0) return;

    this.registers = this.registers.filter(register => !register.isChecked);
    this.registerListSelected = [];
    this.onLoadListItems.emit(this.registers);
  }

}
