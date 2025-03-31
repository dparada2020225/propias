import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatementsUtilsService {

  calcAmountOnOperations(debit: number, credit: number, amounts: any, operation: any) {
    if (debit > credit) {
      amounts['debit'].transactionAmount++;
      amounts['debit'].amount += debit;
      operation.value = debit;
    } else if (debit < credit) {
      amounts['credit'].transactionAmount++;
      amounts['credit'].amount += credit;
      operation.value = credit;
    }
  }
}
