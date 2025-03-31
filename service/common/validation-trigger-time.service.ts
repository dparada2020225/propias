import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdfAlertModalComponent } from '@adf/components';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from './util.service';
import { MenuService } from '../shared/menu.service';
import { IFlowError } from 'src/app/models/error.interface';
import { environment } from 'src/environments/environment';
import { IIsSchedule } from 'src/app/models/isSchedule.interface';

@Injectable({
  providedIn: 'root',
})
export class ValidationTriggerTimeService {
  private isScheduleAvailable = false;

  private countryUTC = {
    banpais: -6,
    bipa: -5,
    bisv: -6,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private router: Router,
    private util: UtilService,
    private menuService: MenuService
  ) {}

  get isAvailableSchedule() {
    return this.isScheduleAvailable;
  }

  validate(profile: string, schedule: IIsSchedule | IFlowError) {
    if (schedule.hasOwnProperty('error')) {
      const message = schedule as IFlowError;
      this.openModal(message.message);
      return;
    }

    const isScheduleAvailable = this.menuService.validatorSchedule(schedule as IIsSchedule, this.countryUTC[profile]);
    this.isScheduleAvailable = isScheduleAvailable;

    if (!isScheduleAvailable) {
      this.openModal();
    }
  }

  openModal(errorMessage?: string) {
    const modal = this.modalService.open(AdfAlertModalComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} b2b-alert sm-600 button-100`,
      size: `lg`,
    });

    modal.componentInstance.data = this.util.alertScheduleServiceLayout(errorMessage);

    modal.dismissed.subscribe((a) => {
      this.showSpinner();

      this.router.navigate(['/home']).finally(() => {
        this.hiddenSpinner();
      });
    });

    modal.result.then((isResult: boolean) => {
      this.router.navigate(['/home']).finally(() => {
        this.hiddenSpinner();
      });
    });
  }

  private showSpinner() {
    this.spinner.show('main-spinner');
  }

  private hiddenSpinner() {
    this.spinner.hide('main-spinner');
  }
}
