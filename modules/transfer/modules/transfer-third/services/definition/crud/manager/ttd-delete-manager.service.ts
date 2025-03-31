import {Injectable} from '@angular/core';
import {ITTDDeleteConfirm} from '../../../../interfaces/third-crud.interface';
import {TTDDeleteConfirmService} from '../personalization/delete/ttd-delete-banpais-confirm.service';

@Injectable({
  providedIn: 'root'
})
export class TtdDeleteManagerService {

  constructor(
    private deleteConfirm: TTDDeleteConfirmService,
  ) {
  }


  buildDeleteAccountLayout(deleteConfirm: ITTDDeleteConfirm) {
    return this.deleteConfirm.builderDeleteConfirmation(deleteConfirm);
  }

}
