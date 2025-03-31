import { Component, Input } from '@angular/core';
import { UtilService } from '../../../../service/common/util.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'byte-adf-transfer-footer',
  templateUrl: './adf-transfer-footer.component.html',
  styleUrls: ['./adf-transfer-footer.component.scss']
})
export class AdfTransferFooterComponent  {
  @Input() icon: string = 'sprint2-icon-warning';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() descriptionEl: string = '';

  get profile() {
    return this.utils.getProfile();
  }

  constructor(
    private utils: UtilService,
    private translate: TranslateService,
  ) {
  }

}
