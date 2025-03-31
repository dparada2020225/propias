import { Component, Input } from '@angular/core';

@Component({
  selector: 'byte-stkn-bisv-step-vertical',
  templateUrl: './stkn-bisv-step-vertical.component.html',
  styleUrls: ['./stkn-bisv-step-vertical.component.scss']
})
export class StknBisvStepVerticalComponent  {

  @Input() secondStepOn: boolean = false;
}
