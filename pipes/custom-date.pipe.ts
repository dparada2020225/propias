import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {
  transform(value: string): any {
    let description = value.split(' ');    
    return parseInt(description[0]);
  }
}
