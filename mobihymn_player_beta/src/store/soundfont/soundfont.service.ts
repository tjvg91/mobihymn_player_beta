import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SoundfontStore } from './soundfont.store';
import * as Soundfont from 'soundfont-player';

@Injectable({ providedIn: 'root' })
export class SoundfontService {
  constructor(private soundfontStore: SoundfontStore, private http: HttpClient) {}

  set() {
    const ac = new AudioContext();
    Soundfont.instrument(ac, 'assets/soundfonts/acoustic_grand_piano-mp3.js').then(instru => {
      this.soundfontStore.update({
        soundfont: instru
      });
    });
  }
}
