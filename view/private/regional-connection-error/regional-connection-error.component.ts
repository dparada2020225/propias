import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'byte-regional-connection-error',
  templateUrl: './regional-connection-error.component.html',
  styleUrls: ['./regional-connection-error.component.scss'],
})
export class RegionalConnectionErrorComponent {
  constructor(private router: Router) {
  }

  goToLogin() {
    this.router.navigate(['login']);
  }
}
