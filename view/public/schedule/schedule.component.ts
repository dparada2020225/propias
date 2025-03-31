import { Component } from '@angular/core';
import { StyleManagementService } from 'src/app/service/common/style-management.service';
import { environment } from 'src/environments/environment';
import { EProfile } from '../../../enums/profile.enum';

@Component({
  selector: 'byte-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent {
  horario: string | undefined;

  constructor(private styleManagement: StyleManagementService) {
    this.horario = environment['profile'] || 'byte-theme';
  }

  get corporateImageApplication(): string {
    return this.styleManagement.corporateImageApplication() ? 'background-corporate' : '';
  }

  get classNameContainerBP(): string {
    return environment.profile === EProfile.HONDURAS ? 'schedule-content-bp' : '';
  }
}
