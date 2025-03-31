import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { IFlowError } from 'src/app/models/error.interface';
import { IIsSchedule } from 'src/app/models/isSchedule.interface';
import { ValidationTriggerTimeService } from 'src/app/service/common/validation-trigger-time.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'byte-voucher-update-data',
  templateUrl: './voucher-update-data.component.html',
  styleUrls: ['./voucher-update-data.component.scss']
})
export class VoucherUpdateDataComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private validationTriggerTime: ValidationTriggerTimeService,
    private spinner: NgxSpinnerService,

  ) { }

  ngOnInit(): void {
    this.validationRangeTriggerTime()
  }

  goHome(){
    this.router.navigate(['/home'])
  }

  validationRangeTriggerTime() {
    const schedule: IIsSchedule | IFlowError = this.activatedRoute.snapshot.data['scheduleService'];

    this.validationTriggerTime.validate(environment.profile, schedule);
    this.hiddenSpinner()
  }

  private hiddenSpinner() {
    this.spinner.hide('main-spinner');
  }


}
