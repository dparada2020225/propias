import { Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, interval } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WorkerService {

  constructor(
    public updates: SwUpdate
  ) {
    if (updates.isEnabled) {
      interval(environment.updateTime).subscribe(() => updates.checkForUpdate()
        .then(() => console.log('checking for updates')));
    }
  }

  public checkForUpdates(): void {
    this.updates.versionUpdates
      .pipe(
        filter((evt: any): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
      )
      .subscribe({
      next: () => {
        this.promptUser()
      }
    });
  }

  private promptUser(): void {
    this.updates.activateUpdate().then(() => document.location.reload());
  }
}
