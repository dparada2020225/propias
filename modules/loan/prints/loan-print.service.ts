import { Injectable } from '@angular/core';
import { PdfService } from '../../../service/prints/pdf.service';

@Injectable({
  providedIn: 'root'
})
export class LoanPrintService extends PdfService {
  buildPostFooter(doc: any, data: any): void {
    console.log('buildPostFooter');
  }

  buildTitles(doc: any, data: any) {
    console.log('buildTitles');
  }

  buildBody(doc: any, data: any) {
    console.log('buildBody');
  }

}
