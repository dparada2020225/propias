import { IAlert, AlertAttributeBuilder, AlertBuilder } from '@adf/components';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalDefinitionService {


  buildAlertToUpdateWhithLather(): IAlert {
    const iconAlertAttribute = new AlertAttributeBuilder()
      .label('icon-udp-1-data-warning')
      .build();

    const titleAlertAttribute = new AlertAttributeBuilder()
      .label('alert-title')
      .build();

    const messageAlertAttribute = new AlertAttributeBuilder()
      .label("alert_update_data_banking_validation")
      .build();

    const nextButtonAlertAttribute = new AlertAttributeBuilder()
      .label('update_now')
      .build();

    const cancelButtonAlertAttribute = new AlertAttributeBuilder()
      .label('update_later')
      .build();

    return new AlertBuilder()
      .icon(iconAlertAttribute)
      .title(titleAlertAttribute)
      .message(messageAlertAttribute)
      .nextButtonMessage(nextButtonAlertAttribute)
      .cancelButtonMessage(cancelButtonAlertAttribute)
      .build();
  }

  buildAlertToUpdate(): IAlert {
    const iconAlertAttribute = new AlertAttributeBuilder()
      .label('icon-udp-1-data-warning')
      .build();

    const titleAlertAttribute = new AlertAttributeBuilder()
      .label('alert-title')
      .build();

    const messageAlertAttribute = new AlertAttributeBuilder()
      .label("alert_update_data_expired_document")
      .build();

    const nextButtonAlertAttribute = new AlertAttributeBuilder()
      .label('update_now')
      .build();

    return new AlertBuilder()
      .icon(iconAlertAttribute)
      .title(titleAlertAttribute)
      .message(messageAlertAttribute)
      .nextButtonMessage(nextButtonAlertAttribute)
      .build();
  }

  buildErrorToUpdate(): IAlert {
    const iconAlertAttribute = new AlertAttributeBuilder()
      .label('banca-regional-error')
      .build();

    const titleAlertAttribute = new AlertAttributeBuilder()
      .label('We_sorry')
      .build();

    const messageAlertAttribute = new AlertAttributeBuilder()
      .label("We_cannot_complete")
      .build();

    const nextButtonAlertAttribute = new AlertAttributeBuilder()
      .label('goHome')
      .build();

    return new AlertBuilder()
      .icon(iconAlertAttribute)
      .title(titleAlertAttribute)
      .message(messageAlertAttribute)
      .nextButtonMessage(nextButtonAlertAttribute)
      .build();
  }


}
