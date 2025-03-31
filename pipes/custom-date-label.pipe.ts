import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'customDateLabel'
})
export class CustomDateLabelPipe implements PipeTransform {
  transform(value: string): any {
    let description = value.split(' ');
    let number = description[0];
    if (number === '1'){
      return 'day';
    }
    return 'days';
  }
}
