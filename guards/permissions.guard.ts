import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { StorageService } from '@adf/security';
import { PermissionsService } from '../service/private-main/permissions.service';
import { FindServiceCodeService } from '../service/common/find-service-code.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionsGuard implements CanActivate {
  constructor(
    private router: Router,
    private permissionsService: PermissionsService,
    private storage: StorageService,
    private findServiceCode: FindServiceCodeService,
    ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let userLoggedIn = this.storage.getItem('userLoggedIn');

    // Se verifica que en el localStorage exista el item de usuario logueado.
    if (!userLoggedIn) {
      // Si no existe el item de usuario logueado se navega al login,
      // y se retorna falso para detener la navegación a otros urls.
      if (state.url) {
        this.storage.addItem('returnUrl', JSON.stringify(state.url));
      }

      this.router.navigate(['login']);
      return false;
    }

    let userLogged = JSON.parse(userLoggedIn);

    // Se verifica si el usuario está logueado
    if (!userLogged) {
      // Si el usuario no está logueado, se retorna falso y se navega al login.
      if (state.url) {
        this.storage.addItem('returnUrl', JSON.stringify(state.url));
      }

      this.router.navigate(['login']);
      return false;
    }

    let program = state.url.substring(1);

    // Se obtiene el programa equivalente según el perfil: banpais, bipa o bisv según corresponda.
    const equivalenceProgram = this.findServiceCode.getServiceCode(program);

    // Si no existe un programa equivalente, se retorna false y se detiene la navegación.
    if (!equivalenceProgram) {
      if (state.url) {
        this.storage.addItem('returnUrl', JSON.stringify(state.url));
      }

      return false;
    }

    // Si existe un programa equivalente, entonces se consume el servicio de permisos
    // para hacer las va lidaciones correspondientes.
    return this.permissionsService.permission(equivalenceProgram, state);
  }
}
