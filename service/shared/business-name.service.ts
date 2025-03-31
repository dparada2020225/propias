import {Injectable} from '@angular/core';

/**
 * @author Eder Santos
 * @date 03/04/2012
 *
 * Retrieve the business name based on the profile
 */
@Injectable({
  providedIn: 'root'
})
export class BusinessNameService {

  accountNumber!: string;

  /**
   * Get the business name
   * profile a Profile
   * @return A string with the business name
   */
  getBusiness(profile: string): string {
    let business = '';
    switch (profile) {
      case 'banpais':
        business = 'Banpaís';
        break;
      case 'bisv':
        business = 'Bi en Línea';
        break;
      case 'bipa':
        business = 'Bi en Línea';
        break;
      default:
        business = 'Unknown';
        break;
    }
    return business;
  }

  getBusinessType(profile: string): string {
    let businessType = '';
    switch (profile) {
      case 'banpais':
        businessType = 'BANPAIS S.A';
        break;
      case 'bisv':
        businessType = 'BI El Salvador S.A';
        break;
      case 'bipa':
        businessType = 'BI Bank S.A';
        break;
      default:
        businessType = 'Unknown';
        break;
    }
    return businessType;
  }

// Recupera el Número de Cuenta sin Tokenizar
  getAccountNumber(): string{
    return this.accountNumber;
  }
}
