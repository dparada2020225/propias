import { DynamicFormService, EHttpMethod, RESTCallConfigBuilder } from '@adf/components';
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DinamicFormResolver implements Resolve<boolean> {
  constructor(private dynamicForm: DynamicFormService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    let test = new RESTCallConfigBuilder()
      .url('/v1/settings/data-setting')
      .method(EHttpMethod.GET)
      .build();

      const resp =this.dynamicForm.startBuilder(test)
      console.log(resp)
    return  resp ;
     ;
  }
}
