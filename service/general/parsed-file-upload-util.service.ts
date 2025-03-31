import { EventEmitter, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ParsedFileUploadUtilService {
  constructor(
    private translate: TranslateService,
  ) { }

  manageTranslateText(text: string, interpolateObj: any) {
    return this.translate.instant(text, interpolateObj);
  }

  manageEmitFailedResponse(message: string, eventEmitter: EventEmitter<any>, file?: File | null) {
    eventEmitter.emit({
      message,
      messageStatus: 'warning',
      fileStatus: 'failed',
      currentFile: null,
      file: file,
    });
  }

  removeAccent(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
}
