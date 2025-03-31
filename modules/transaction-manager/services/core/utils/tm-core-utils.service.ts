import { Injectable } from '@angular/core';
import { AdfAlertModalComponent, AlertAttributeBuilder, AlertBuilder, IAlert } from '@adf/components';
import { UtilService } from '../../../../../service/common/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class TmCoreUtilsService {

  constructor(
    private utils: UtilService,
    private modalService: NgbModal,
  ) { }

  private buildAlertNotConfiguredTransaction(): IAlert {
    const iconAlertAttribute = new AlertAttributeBuilder()
      .label('sprint2-icon-warning')
      .build();

    const titleAlertAttribute = new AlertAttributeBuilder()
      .label('st:label_important')
      .build();

    const messageAlertAttribute = new AlertAttributeBuilder()
      .label('st:label_st_not_configured')
      .build();

    const nextButtonAlertAttribute = new AlertAttributeBuilder()
      .label('agree')
      .build();

    return new AlertBuilder()
      .icon(iconAlertAttribute)
      .title(titleAlertAttribute)
      .message(messageAlertAttribute)
      .nextButtonMessage(nextButtonAlertAttribute)
      .build();
  }

  openModalTransactionNotConfigured() {
    const modal = this.modalService.open(AdfAlertModalComponent, {
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'} alert-modal`,
      size: `lg`,
    });

    modal.componentInstance.data = this.buildAlertNotConfiguredTransaction();

    modal.result.catch((error) => error);
  }
}
