import { Injectable } from '@angular/core';
import { AlertAttributeBuilder, AlertBuilder, IAlert } from '@adf/components';

@Injectable({
  providedIn: 'root'
})
export class SpdModalChangesService {
  buildAlertLastChanges(message: string): IAlert {
    const iconAlertAttribute = new AlertAttributeBuilder()
      .label('corporate-image banca-regional-periodo-contrasena')
      .build();

    const titleAlertAttribute = new AlertAttributeBuilder()
      .label('title:last_changes_modified')
      .build();

    const messageAlertAttribute = new AlertAttributeBuilder()
      .label(message)
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

  buildAlertSuccessModifiedChanges(): IAlert {
    const iconAlertAttribute = new AlertAttributeBuilder()
      .label('corporate-image banca-regional-success')
      .build();

    const titleAlertAttribute = new AlertAttributeBuilder()
      .label('title:success_modified')
      .build();

    const messageAlertAttribute = new AlertAttributeBuilder()
      .label('description:success_modified')
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
