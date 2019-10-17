import { Component } from '@angular/core';
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tempoVal: number;
  keyVal: number;
  tempoOptions: Options;
  keyOptions: Options;

  constructor() {
    this.tempoOptions = {
      minLimit:　60,
      maxLimit: 120,
      vertical: true,
      step: 1
    };
    this.keyOptions = {
      minLimit: 0,
      maxLimit: 11,
      vertical: true,
      step: 1
    }
  }

}
