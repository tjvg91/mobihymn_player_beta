import * as MIDI from 'midi-player-js';
import { LabelType, Options } from 'ng5-slider';
import { map } from 'rxjs/operators';
import * as SoundfontPlayer from 'soundfont-player';

import { Component } from '@angular/core';

import keyJson from '../../assets/keys.json';
import { SoundfontQuery } from '../../store/soundfont/soundfont.query';

@Component({ selector: 'app-home', templateUrl: 'home.page.html', styleUrls: ['home.page.scss'] })
export class HomePage {
  tempoVal = 80;
  keyVal = 0;
  playerVal = 70;
  tempoOptions: Options;
  keyOptions: Options;
  playerOptions: Options;
  keys: any[];
  voices: any[];
  mdiPlayer: MIDI.Player;
  soundfont: SoundfontPlayer.Player;
  ac: AudioContext;
  repeat = false;

  constructor(private soundfontQuery: SoundfontQuery) {
    const hm = this;
    this.ac = new AudioContext();

    // tslint:disable-next-line:no-string-literal
    this.keys = keyJson;
    this.tempoOptions = {
      floor: 60,
      ceil: 120,
      vertical: true,
      hidePointerLabels: true,
      step: 1
    };
    this.keyOptions = {
      floor: 0,
      ceil: 11,
      vertical: true,
      hidePointerLabels: true,
      translate: (value: number, label: LabelType): string => {
        return this.keys[value];
      }
    };
    this.playerOptions = {
      floor: 0,
      ceil: 150,
      hideLimitLabels: true,
      hidePointerLabels: true,
      translate: (value: number): string => {
        return (value / 60).toFixed(0) + ':' + (value % 60).toFixed(0);
      }
    };
    this.soundfontQuery
      .select(state => state.webAudioFont)
      .pipe(
        map(webAudioFont => {
          if (webAudioFont) {
            hm.soundfont = webAudioFont;
            this.setupMidiPlayer();
          }
        })
      )
      .subscribe();
  }

  ionViewDidEnter() {
    this.repeat = false;
  }

  playPause() {
    this.mdiPlayer.isPlaying ? this.mdiPlayer.pause() : this.mdiPlayer.play();
  }

  setupMidiPlayer() {
    this.mdiPlayer = new MIDI.Player(event => {
      console.log(event);
      if (event.name && event.name === 'Note on') {
        try {
          this.soundfont.play(event.noteNumber, this.ac.currentTime, {
            gain: event.velocity / 100
          });
        } catch (error) {}
      }
    });

    this.mdiPlayer.loadFile('assets/a-whole-new-world.mid');

    this.mdiPlayer.on('fileLoaded', () => {
      console.log('LOADED');
    });

    this.mdiPlayer.on('midiEvent', event => {
      console.log(event);
    });
  }
}
