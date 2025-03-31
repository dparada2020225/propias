import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMenuOptionLicensesParams, IMenuOptionsLicenses } from '../../models/menu-option-licenses.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuOptionLicensesService {

  constructor(
    private http: HttpClient,
  ) { }

  getMenuLicenses(body: IMenuOptionLicensesParams) {
    return this.http.post<IMenuOptionsLicenses>('/v1/thirdparties/menu-option', body) ;
  }
}
