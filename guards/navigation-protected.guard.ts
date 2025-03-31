import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';

import navigationProtectedTreeJson from '../../assets/data/navigation-protection.json';

import { IUrlChildrenTree } from '../models/navigation-protected.interface';
import { ParameterManagementService } from '../service/navegation-parameters/parameter-management.service';

const DEFAULT_URL_LENGTH = 3;

@Injectable({
  providedIn: 'root',
})
export class NavigationProtectedGuard implements CanActivate {

  constructor(
    private parameterManager: ParameterManagementService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let mainPath = state.url.split('/');
    const customUrlLength = route.routeConfig?.data?.['urlLength'];
    const customPathToFind = route.routeConfig?.data?.['customPathToFind'];
    const urlLengthToUse = customUrlLength ? customUrlLength : DEFAULT_URL_LENGTH;
    const customPathToFindParameter: string | undefined = customPathToFind ?? undefined;
    const parameter = this.parameterManager.getParameter('navigationProtectedParameter');
    const compareParameter = parameter ? parameter : null;

    if (mainPath.length > urlLengthToUse) {
      mainPath = mainPath.slice(0, urlLengthToUse);    // mainPath.pop(); // NOTE: comment this line for cut url when main path is only 2 levels
    }

    const rootPath = mainPath.join('/');
    const subPath: string | undefined = route.routeConfig?.path as string || customPathToFindParameter;
    const navProtectedTree = route.routeConfig?.data?.['navigateProtection'] ?? navigationProtectedTreeJson;

    const findMainPath = navProtectedTree.find((properties) => properties.path === rootPath);
    if (!findMainPath) {
      this.resetParameters();
      this.router.navigate(['/login']).then(() => {});
      return false;
    } else if (findMainPath && !subPath && !customPathToFindParameter) {
      return true;
    }

    const subPathFounded = this.searchUrl(findMainPath.children, subPath ?? '');

    const isAllowedAccess = subPath && subPathFounded && subPathFounded.parameter === compareParameter;

    if (!isAllowedAccess) {
      const customPathGuardURL = route.routeConfig?.data?.['customURL'];
      this.resetParameters();
      const urlWithoutCustomPath = customPathGuardURL ?? findMainPath.path;
      const urlToBack = customPathToFindParameter ? 'home' : urlWithoutCustomPath;
      this.router.navigate([urlToBack]).then(() => {});
      return false;
    } else {
      return true;
    }
  }

  private searchUrl(urlChildren: IUrlChildrenTree[], pathToFind: string): IUrlChildrenTree | null {
    return urlChildren.reduce((urlFounded: IUrlChildrenTree | null, current) => {
      if (current.path === pathToFind) {
        urlFounded = current;
        return urlFounded;
      }

      if (!urlFounded && Array.isArray(current.children)) {
        return this.searchUrl(current.children, pathToFind);
      }

      return urlFounded;
    }, null);
  }

  private resetParameters() {
    this.parameterManager.sendParameters({
      navigationProtectedParameter: null,
      navigateStateParameters: null,
    });
  }
}
