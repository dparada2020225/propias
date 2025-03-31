import { StorageService } from '@adf/security';
import { Injectable } from '@angular/core';
import { RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { IMenuOption } from '../../models/menu.interface';
import { FindServiceCodeService } from '../common/find-service-code.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  private _isValid: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private storageService: StorageService,
    private findService: FindServiceCodeService,
  ) { }

  get isValid(): Observable<boolean> {
    return this._isValid.asObservable();
  }

  permission(equivalenceProgram: string, state: RouterStateSnapshot): boolean {
    const menuList: IMenuOption[] = JSON.parse(this.storageService.getItem('userMenu'));
    const isFoundEquivalence = this.findService.searchMenuEquivalence(equivalenceProgram, menuList);
    this._isValid.next(!isFoundEquivalence);

    return isFoundEquivalence;
  }
}
