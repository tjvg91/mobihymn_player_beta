import * as MIDI from 'midi-player-js';
import { LabelType, Options } from 'ng5-slider';

import { Component, Input, Output, EventEmitter } from '@angular/core';

import { API } from '@services/api';
import { environment } from '@environments/environment';
import { HymnMidi } from '@store/hymn-midi/hymn-midi.model';
import { KeySignature } from '@services/model';
import { HymnSetting } from '@store/hymn-setting/hymn-setting.model';

@Component({ selector: 'app-home', templateUrl: 'home.page.html', styleUrls: ['home.page.scss'] })
export class HomePage {
  tempoVal = 80;
  keyVal = 0;
  keyPos = 0;
  playerVal = 0;
  tempoOptions: Options;
  keyOptions: Options;
  playerOptions: Options;
  keys: KeySignature;
  keyType: 'major' | 'minor';
  voices: MIDI.Track[];
  mdiPlayer: MIDI.Player;
  webfont: any;
  ac: AudioContext;
  title = '';
  totalTime: number;
  repeat = false;

  alert: HTMLIonAlertElement;

  HYMNAL_JSON = 'hymnal.json';
  HYMNAL_DIR = this.api.storage + '/mobihymn_player_beta';

  curMidi: HymnMidi;
  curSetting: HymnSetting;
  dataUri = environment.mockData ? environment.mockData[0].midi : this.curMidi.midi;

  @Input()
  set activeMidi(val: HymnMidi) {
    if (val) {
      this.curMidi = val;
      this.mdiPlayer.loadDataUri(val.midi);
      this.tempoVal = this.mdiPlayer.tempo;
      this.title = val.title;
    }
  }

  @Input()
  set activeSettings(val: HymnSetting) {
    if (val) {
      this.curSetting = val;
      this.mdiPlayer.tempo = this.tempoVal = this.curSetting.tempo;
      this.keyVal = this.curSetting.transposeBy;
    }
  }

  @Output() addSetting = new EventEmitter<HymnSetting>();
  @Output() updateSetting = new EventEmitter<Partial<HymnSetting>>();

  constructor(private api: API) {
    const hm = this;
    this.ac = new AudioContext();

    // tslint:disable-next-line:no-string-literal
    this.keys = environment.keys;
    this.tempoOptions = {
      floor: 60,
      ceil: 120,
      vertical: true,
      hidePointerLabels: true,
      step: 1
    };
    this.keyOptions = {
      floor: -6,
      ceil: 6,
      vertical: true,
      hidePointerLabels: true,
      step: 1
    };
    this.playerOptions = {
      floor: 0,
      ceil: 150,
      hideLimitLabels: true,
      hidePointerLabels: true,
      step: 1,
      translate: (value: number): string => {
        return (value / 60).toFixed(0) + ':' + (value % 60).toFixed(0);
      }
    };

    this.title = environment.mockData ? environment.mockData[0].title : '';
    this.setupMidiPlayer();
  }

  ionViewDidEnter() {
    this.repeat = false;
  }

  playPause() {
    this.mdiPlayer.isPlaying ? this.mdiPlayer.pause() : this.mdiPlayer.play();
  }

  setupMidiPlayer() {
    this.webfont = this.api.getSoundfont();
    this.webfont.loader.decodeAfterLoading(this.ac, '');
    this.mdiPlayer = new MIDI.Player(event => {
      if (event.name && event.name === 'Note on') {
        try {
          this.webfont.queueWaveTable(
            this.ac,
            this.ac.destination,
            window['soundfont'],
            this.ac.currentTime,
            event.noteNumber + this.keyVal,
            event.velocity / 100
          );
        } catch (error) {
          console.log(error);
        }
      }
    });

    this.mdiPlayer.on('playing', () => {
      this.playerVal = this.mdiPlayer.getSongTime() - this.mdiPlayer.getSongTimeRemaining();
    });

    this.mdiPlayer.on('endOfFile', () => {
      if (this.repeat) {
        this.playerVal = 0;
        this.mdiPlayer['skipToSeconds'](this.playerVal);
      } else {
        this.stop();
      }
    });

    this.mdiPlayer.loadDataUri(this.dataUri);
    this.totalTime = this.mdiPlayer.getSongTime();

    this.tempoVal = this.mdiPlayer.tempo;

    const keySig = this.mdiPlayer.tracks[0].events.filter(event => event['keySignature'])[0][
      'keySignature'
    ];
    this.keyType = /Major/.test(keySig) ? 'major' : 'minor';
    this.keyPos = this.keys[this.keyType].findIndex(key => {
      return key.otherNames.indexOf(keySig) >= 0;
    });

    this.voices = this.mdiPlayer.tracks.slice(1, this.mdiPlayer.tracks.length);
    console.log(this.webfont.queueWaveTable);
  }

  pausePlay() {
    if (this.mdiPlayer.isPlaying()) {
      this.mdiPlayer.pause();
    } else {
      this.mdiPlayer.play();
    }
  }

  stop() {
    const tempVoices = this.voices.map(val => val);
    this.mdiPlayer.stop();
    this.playerVal = 0;
    this.voices = this.mdiPlayer.tracks.slice(1, this.mdiPlayer.tracks.length);
    const enables = tempVoices.map(val => val['enabled']);
    this.voices.forEach((voice, index) => {
      voice['enabled'] = enables[index];
    });
  }

  toggleTrack(index) {
    const item = this.voices.find(v => v['index'] === index);
    if (item['enabled']) {
      item.disable();
    } else {
      item.enable();
    }
  }

  showKey(keyPos: number) {
    if (this.keyType) {
      const val = (keyPos + this.keyVal) % this.keys[this.keyType].length;
      return (
        this.keys[this.keyType][val < 0 ? val + 12 : val].name +
        (this.keyVal === 0
          ? ''
          : this.keyVal > 0
          ? ' (+' + this.keyVal + ')'
          : ' (' + this.keyVal + ')')
      );
    } else {
      return '';
    }
  }

  showTime(val: number, isMilliSeconds = true) {
    if (isMilliSeconds) {
      const mins = this.pad(parseInt((val / 1000 / 60) * 1000 + ''), 2);
      const secs = this.pad(parseInt(((val / 1000) % 60) * 1000 + ''), 2);
      return mins + ':' + secs;
    } else {
      const mins = this.pad(parseInt(val / 60 + ''), 2);
      const secs = this.pad(parseInt((val % 60) + ''), 2);
      return mins + ':' + secs;
    }
  }

  onTempoChange(event) {
    let wasPlaying = false;
    if (this.mdiPlayer.isPlaying()) {
      this.mdiPlayer.pause();
      wasPlaying = true;
    }
    this.mdiPlayer.tempo = event.value;
    if (wasPlaying) {
      this.mdiPlayer.play();
    }
    this.totalTime = this.mdiPlayer.getSongTime();

    if (this.curSetting) {
      this.updateSetting.emit({
        id: this.curMidi ? this.curMidi.id : environment.mockData[0].id,
        tempo: event.value
      });
    } else {
      this.addSetting.emit({
        id: this.curMidi ? this.curMidi.id : environment.mockData[0].id,
        tempo: event.value,
        transposeBy: this.keyVal
      });
    }
  }

  toggleRepeat() {
    this.repeat = !this.repeat;
  }

  onPlayerChange(event) {
    console.log(event);
    this.mdiPlayer['skipToSeconds'](this.playerVal);
  }

  pad(num, size) {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }
}
