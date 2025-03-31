import { StorageService } from '@adf/security';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { FindServiceCodeService } from '../common/find-service-code.service';


/**
 * @author Fabian Serrano
 * @date 19/09/2021
 *
 * Retrieve the business name based on the profile
 */
@Injectable({
  providedIn: 'root'
})
export class ParameterManagementService {

  private parameterList = new Subject<Object>();
  public parameterList$ = this.parameterList.asObservable();

  constructor(
    private storage: StorageService,
    private findServiceCodeService: FindServiceCodeService,
  ) { }

  getSharedParameter(): Observable<Object> {
    return this.parameterList$;
  }

  sendParameters(newParameters: Object) {
    if (this.storage.getItem("parameterList")) {
      let parameterListStorage = JSON.parse(this.storage.getItem("parameterList"));
      for (const key in newParameters) {
        parameterListStorage[key] = newParameters[key];
      }
      this.storage.addItem("parameterList", JSON.stringify(parameterListStorage));
    } else {
      this.storage.addItem("parameterList", JSON.stringify(newParameters));
    }
    this.parameterList.next(newParameters);
  }

  getParameter<T = any>(nameParameter: string): T {
    if (this.storage.getItem("parameterList")) {
      let parameterListStorage = JSON.parse(this.storage.getItem("parameterList"));
      return parameterListStorage[nameParameter] ? parameterListStorage[nameParameter] : undefined;
    } else {
      return undefined as unknown as T;
    }
  }

  getMenuEquivalence(router: Router) {
    const urlTree = router.parseUrl(router.url);
    const equivalence = urlTree.root.children['primary'].toString();

    if (!urlTree.root.children['primary']) {
      return;
    }

    return this.findServiceCodeService.getServiceCode(equivalence);
  }
}
