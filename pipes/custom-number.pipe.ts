import { Pipe, PipeTransform, ɵDEFAULT_LOCALE_ID } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'customNumber',
})
export class CustomNumberPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value === 'string') {
      value = parseFloat(value.replace(/,/g, ''));
    }

    return new DecimalPipe(ɵDEFAULT_LOCALE_ID).transform(value as string, (args[0] as string) || '1.2-2');
  }
}
