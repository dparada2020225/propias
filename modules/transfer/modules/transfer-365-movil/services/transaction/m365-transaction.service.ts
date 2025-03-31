import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import listBeneficiariesRegisteredJson from '../../data/list-benefeciaries-registered.json';
import { IM365BeneficiaryRegisteredList } from '../../interfaces/transaction.interface';

@Injectable({
  providedIn: 'root'
})
export class M365TransactionService {

  constructor() { }

  getBeneficiaryList() {
    return of<IM365BeneficiaryRegisteredList>(listBeneficiariesRegisteredJson)
      .pipe(delay(1000));
  }
}
