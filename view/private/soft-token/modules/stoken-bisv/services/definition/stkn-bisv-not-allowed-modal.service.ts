import { AlertAttributeBuilder, AlertBuilder, IAlert } from '@adf/components';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StknBisvNotAllowedModalService {

  buildAlertInformation(code: string) {
    switch (code) {
      case 'alert-migration':
        return this.buildAlertMigrationSToken();
      case 'alert-change-device':
        return this.buildAlertChangeDeviceSToken();
      default:
        return 'null'
    }
  }

  buildAlertChangeDeviceSToken(): IAlert {
    const iconAlertAttribute = new AlertAttributeBuilder()
    .label('icon-stkn-bisv2-Icono-8')
    .class('stkn-bisv2')
      .build();

    const titleAlertAttribute = new AlertAttributeBuilder()
      .label('stoken-info-modal')
      .class('stoken-exit-modal-title')
      .build();

    const messageAlertAttribute = new AlertAttributeBuilder()
      .label('stoken-error-change-device')
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

  buildAlertMigrationSToken(): IAlert {
    const iconAlertAttribute = new AlertAttributeBuilder()
    .label('icon-stkn-bisv2-Icono-8')
    .class('stkn-bisv2')
      .build();

    const titleAlertAttribute = new AlertAttributeBuilder()
      .label('stoken-info-modal')
      .class('stoken-exit-modal-title')
      .build();

    const messageAlertAttribute = new AlertAttributeBuilder()
      .label('stoken-error-migration')
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

  buildAlertNotAllowedSToken(): IAlert {
    const iconAlertAttribute = new AlertAttributeBuilder()
      .label('icon-stkn-bisv2-Icono-8')
      .class('stkn-bisv2')
      .build();

    const titleAlertAttribute = new AlertAttributeBuilder()
      .label('stoken-info-modal')
      .class('stoken-exit-modal-title')
      .build();

    const messageAlertAttribute = new AlertAttributeBuilder()
      .label('stoken-error-default-modal')
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
}
