import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';
import { EProfile } from '../enums/profile.enum';

@Pipe({
  name: 'customPhone'
})
export class CustomPhonePipe implements PipeTransform {

  transform(phone: string): string {

    if (environment['profile'] !== EProfile.PANAMA) {
      let subPhone1 = phone.substring(0, 9);
      let subPhone2 = phone.substring(9, 13);

      return subPhone1 + '-' + subPhone2;
    }
    return phone;
  }

}
