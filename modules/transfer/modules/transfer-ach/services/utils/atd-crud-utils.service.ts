import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AtdCrudUtilsService {
  buildNameMask() {
    return {
      mask: /^.{0,22}x*$/
    }
  }

  buildIdentifyMask() {
    return {
      mask: /^[a-zA-Z0-9]{0,18}$/
    }
  }

  buildAliasMask() {
    return {
      mask: /^[a-zA-Z0-9\s]{0,25}$/
    }
  }

  buildAccountNumberMask() {
    return {
      mask: /^\d+$/
    }
  }
}
