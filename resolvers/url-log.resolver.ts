import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ParameterManagementService } from '../service/navegation-parameters/parameter-management.service';


@Injectable({
  providedIn: 'root'
})
export class UrlLogResolver implements Resolve<Observable<any>>{
  private urlLog: string[] = [];

  constructor(
    private parameterManagerService: ParameterManagementService,
  ) { }

  resolve(_, state: RouterStateSnapshot): Observable<any> {
    const urlParameter = this.parameterManagerService.getParameter('urlLog') || [];
    this.urlLog = [...urlParameter, state.url];
    this.parameterManagerService.sendParameters({
      urlLog: this.urlLog,
    });

    return of(this.urlLog);
  }
}
