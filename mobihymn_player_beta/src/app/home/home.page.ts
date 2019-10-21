import { Component } from '@angular/core';
import { Options, LabelType } from 'ng5-slider';
import * as keyJson from '../../assets/keys.json';
import * as MIDI from 'midi-player-js';
import * as SoundfontPlayer from 'soundfont-player';
import { SoundfontQuery } from '../../store/soundfont/soundfont.query';
import { map, catchError } from 'rxjs/operators';

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

  constructor(private soundfontQuery: SoundfontQuery) {
    const hm = this;
    this.ac = new AudioContext();

    // tslint:disable-next-line:no-string-literal
    this.keys = keyJson['default'];
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
    this.voices = [{}, {}, {}];
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
      .select(state => state.soundfont)
      .pipe(
        map(soundfont => {
          hm.soundfont = soundfont;

          hm.mdiPlayer = new MIDI.Player(player => {
            if (player.name && player.name === 'Note on') {
              try {
                hm.soundfont.play(player.noteNumber, hm.ac.currentTime, {
                  gain: player.velocity / 100
                });
              } catch (error) {}
            }
          });
        })
      );
  }
}
