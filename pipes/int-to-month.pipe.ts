import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'intToMonth'
})
export class IntToMonthPipe implements PipeTransform {

  transform(value: any): any {
    let newStr: any;
    switch (value) {
      case 1:
        newStr = 'january';
        break;
      case 2:
        newStr = 'february';
        break;
      case 3:
        newStr = 'march';
        break;
      case 4:
        newStr = 'april';
        break;
      case 5:
        newStr = 'may';
        break;
      case 6:
        newStr = 'june';
        break;
      case 7:
        newStr = 'july';
        break;
      case 8:
        newStr = 'august';
        break;
      case 9:
        newStr = 'september';
        break;
      case 10:
        newStr = 'october';
        break;
      case 11:
        newStr = 'november';
        break;
      case 12:
        newStr = 'december';
        break;
      default:
        newStr = 'unknow';
    }
    return newStr;
  }

}
