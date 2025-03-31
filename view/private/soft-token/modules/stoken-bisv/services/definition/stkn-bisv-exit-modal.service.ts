import { AlertAttributeBuilder, AlertBuilder, IAlert } from '@adf/components';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StknBisvExitModalService {

  buildAlertToLogOut(): IAlert {
    const iconAlertAttribute = new AlertAttributeBuilder()
    .label('icon-stkn-bisv2-Icono-8')
    .class('stkn-bisv2')
      .build();

    const titleAlertAttribute = new AlertAttributeBuilder()
      .label('alert-title')
      .class('stoken-exit-modal-title')
      .build();

    const messageAlertAttribute = new AlertAttributeBuilder()
      .label('stoken-exit-modal-descrip')
      .build();

    const nextButtonAlertAttribute = new AlertAttributeBuilder()
      .label('stoken-bisv-membership-btn')
      .build();

    return new AlertBuilder()
      .icon(iconAlertAttribute)
      .title(titleAlertAttribute)
      .message(messageAlertAttribute)
      .nextButtonMessage(nextButtonAlertAttribute)
      .build();
  }
}
