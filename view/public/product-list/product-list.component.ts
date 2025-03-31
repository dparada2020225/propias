import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'byte-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductListComponent {
  @Output() closeMainMenu = new EventEmitter<boolean>();

  profile = environment.profile;

  @Input()
  set receiverProductList(value: any) {
    this.productList = value[environment.profile];
  }

  isCollapsed = true;

  arrow!: boolean;
  productList!: Array<any>;

  href(menuTrigger: any) {
    this.isCollapsed = true;
    this.closeMainMenu.emit(true);
    window.location.href = menuTrigger;
  }

  menuOpend() {
    this.arrow = true;
  }

  menuClosed() {
    this.arrow = false;
  }
}
