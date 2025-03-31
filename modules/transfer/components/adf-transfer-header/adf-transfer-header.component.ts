import { Component, Input } from '@angular/core';

@Component({
  selector: 'byte-adf-transfer-header',
  templateUrl: './adf-transfer-header.component.html',
  styleUrls: ['./adf-transfer-header.component.scss']
})
export class AdfTransferHeaderComponent {
  @Input() title: string = '';
  @Input() logoUrl: string = '';
  @Input() subtitle: string = '';
  @Input() width: string = '';
  @Input() height: string = '';

  get headerWithoutLogoClassName() {
    return !this.logoUrl ? 'no-logo' : ''
  }

  constructor() { }

  getWidthStyle() {
    return this.width && this.height ? {'width': this.width, 'height': this.height} : {};
  }
}
