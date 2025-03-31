import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EProfile } from '../../enums/profile.enum';

@Injectable({
    providedIn: 'root'
})
export class StyleManagementService {
    profile: string = environment.profile;
    corporateImageApplication(): boolean {
      switch (this.profile) {
        case EProfile.SALVADOR :
            return true;
        case EProfile.PANAMA:
            return true;
        default:
            return false;
      }
    }
}
