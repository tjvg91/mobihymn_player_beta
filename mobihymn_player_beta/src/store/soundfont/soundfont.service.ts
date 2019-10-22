import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SoundfontStore } from './soundfont.store';
import * as WebAudioFont from 'webaudiofont';
import { API } from 'src/services/api';

@Injectable({ providedIn: 'root' })
export class SoundfontService {
  ac = new AudioContext();
  constructor(private soundfontStore: SoundfontStore, private http: HttpClient, private api: API) {}

  set() {
    /* WebAudioFont.instrument(this.ac, 'assets/soundfonts/acoustic_grand_piano-mp3.js').then(instru => {
      this.soundfontStore.update({
        soundfont: instru
      });
    }); */
    const player = new WebAudioFont();
    player.loader.startLoad(
      this.ac,
      this.api.soundfont,
      'acoustic_piano'
    );
    this.soundfontStore.update({
      webAudioFont: player
    });
  }
}
