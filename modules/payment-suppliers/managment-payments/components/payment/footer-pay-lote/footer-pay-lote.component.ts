import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';

@Component({
  selector: 'byte-footer-pay-lote',
  templateUrl: './footer-pay-lote.component.html',
  styleUrls: ['./footer-pay-lote.component.scss']
})
export class FooterPayLoteComponent  {
  @Input() icon: string = 'sprint2-icon-warning';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() descriptionEl: string = '';
  @Input() isSmall;

  get profile() {
    return this.utils.getProfile();
  }

  constructor(
    private utils: UtilService,
    private translate: TranslateService,
  ) {
  }

}
