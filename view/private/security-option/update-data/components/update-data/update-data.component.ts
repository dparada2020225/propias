import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { IFlowError } from 'src/app/models/error.interface';
import { IIsSchedule } from 'src/app/models/isSchedule.interface';
import { ValidationTriggerTimeService } from 'src/app/service/common/validation-trigger-time.service';
import { environment } from 'src/environments/environment';
import { IResponseExpirationDate } from '../../enum/update-data-status.interfaces';

@Component({
  selector: 'byte-update-data',
  templateUrl: './update-data.component.html',
  styleUrls: ['./update-data.component.scss']
})
export class UpdateDataComponent implements OnInit {

  typeProfile: string = environment.profile;
  code!: IResponseExpirationDate

  constructor(
    private activatedRoute: ActivatedRoute,
    private validationTriggerTime: ValidationTriggerTimeService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.validationRangeTriggerTime()
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
