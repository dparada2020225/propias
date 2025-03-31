import { AlertAttributeBuilder, AlertBuilder, IAlert } from '@adf/components';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StknBisvQrWarningModalService {

  buildAlertWarningQR(): IAlert {
    const iconAlertAttribute = new AlertAttributeBuilder()
    .label('icon-stkn-bisv2-Icono-8')
    .class('stkn-bisv2')
      .build();

    const titleAlertAttribute = new AlertAttributeBuilder()
      .label('stoken-info-modal')
      .class('stoken-exit-modal-title')
      .build();

    const messageAlertAttribute = new AlertAttributeBuilder()
      .label('stoken-error-scann')
      .build();

    const nextButtonAlertAttribute = new AlertAttributeBuilder()
      .label('stkn-bisv-btn-understood')
      .build();


    return new AlertBuilder()
      .icon(iconAlertAttribute)
      .title(titleAlertAttribute)
      .message(messageAlertAttribute)
      .nextButtonMessage(nextButtonAlertAttribute)
      .build();
  }
}
