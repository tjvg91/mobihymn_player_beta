import * as Firebase from 'firebase';
import * as MIDI from 'midi-player-js';
import { LabelType, Options } from 'ng5-slider';
import * as Webfont from 'webaudiofont';

import { Component } from '@angular/core';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Network } from '@ionic-native/network/ngx';
import { AlertController } from '@ionic/angular';

import keyJson from '../../assets/keys.json';
import { API } from '../../services/api';
import { HymnMidi } from '../../store/hymn-midi/hymn-midi.model';
import { HymnMidiService } from '../../store/hymn-midi/hymn-midi.service';
import { HymnMidiQuery } from '../../store/hymn-midi/hymn-midi.query';
import { HymnSettingQuery } from '../../store/hymn-setting/hymn-setting.query';
import { HymnSettingStore } from '../../store/hymn-setting/hymn-setting.store';
import { HymnMidiStore } from '../../store/hymn-midi/hymn-midi.store.js';

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
  webfont: any;
  ac: AudioContext;
  title = '';
  repeat = false;
  isConnected = false;

  alertCtrl: AlertController;
  alert: HTMLIonAlertElement;

  HYMNAL_JSON = 'hymnal.json';
  HYMNAL_DIR = this.api.storage + '/mobihymn_player_beta';

  constructor(
    private network: Network,
    private fileTransfer: FileTransfer,
    private api: API,
    private hymnMidiService: HymnMidiService,
    private hymnMidiStore: HymnMidiStore,
    private hymnMidiQuery: HymnMidiQuery,
    private hymnSettingStore: HymnSettingStore,
    private hymnSettingQuery: HymnSettingQuery
  ) {
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

    this.network.onConnect().subscribe(() => {
      if (!this.api.isSignedIn) {
        this.api.signInToFirebaseAuth();
      }
      if (this.alert) {
        this.alert.dismiss();
      }
    });

    this.alertCtrl
      .create({
        message:
          'A file is missing in your device and needs to be downloaded. Internet connection is needed.',
        backdropDismiss: false,
        keyboardClose: false
      })
      .then(alert => {
        this.alert = alert;
        if (!this.isConnected) {
          this.alert.present();
        }
      });

    this.hymnMidiQuery.selectActiveId().subscribe(hymnId => {
      if (hymnId) {
        this.hymnMidiQuery.selectEntity(hymnId).subscribe(hymnMidi => {
          if (hymnMidi) {
            this.mdiPlayer.loadDataUri(hymnMidi.midi);
            this.tempoVal = this.mdiPlayer.tempo;
            this.title = hymnMidi.title;
          }
        });
      }
    });

    this.webfont = this.api.setSoundfont();
    this.setupMidiPlayer();
  }

  ionViewDidEnter() {
    this.repeat = false;
  }

  checkHymnalFile() {
    this.api.file
      .checkFile(this.HYMNAL_DIR, this.HYMNAL_JSON)
      .then(exists => {
        if (!exists) {
          this.downloadFromFirebase();
        }
      })
      .catch(err => {
        alert(err);
      });
  }

  playPause() {
    this.mdiPlayer.isPlaying ? this.mdiPlayer.pause() : this.mdiPlayer.play();
  }

  setupMidiPlayer() {
    this.webfont = new Webfont.WebAudioFontPlayer();
    this.mdiPlayer = new MIDI.Player(event => {
      console.log(event);
      if (event.name && event.name === 'Note on') {
        try {
          this.webfont.queueWaveTable(this.ac);
          this.webfont.play(event.noteNumber, this.ac.currentTime, {
            gain: event.velocity / 100
          });
        } catch (error) {}
      }
    });

    this.mdiPlayer.on('fileLoaded', () => {
      console.log('LOADED');
    });

    this.mdiPlayer.on('midiEvent', event => {
      console.log(event);
    });
  }

  downloadFromFirebase() {
    this.api.firebaseAuth.onAuthStateChanged(user => {
      const storage = Firebase.storage().ref();
      storage
        .child('hymnal.json')
        .getDownloadURL()
        .then(url => {
          // this.api.httpCall<string>('GET', url, this.getUrlSuccess, this.getUrlError);
          this.transferFile(url);
        })
        .catch(err => {
          alert(err);
        });
    });
  }

  downloadSuccess(path, file) {
    const hm = this;
    this.api.file.readAsText(path, file).then(val => {
      const data = JSON.parse(val) as HymnMidi[];
      data.forEach(datum => {
        hm.hymnMidiService.add(datum);
        hm.hymnMidiStore.setActive(1);
        hm.hymnSettingStore.setActive(1);
      });
    });
  }

  downloadError() {}

  transferFile(url: string) {
    const app = this;
    const obj = this.fileTransfer.create();
    obj.onProgress(ev => {});
    obj
      .download(url, this.HYMNAL_DIR + '/' + this.HYMNAL_JSON)
      .then(() => {
        this.downloadSuccess(this.HYMNAL_DIR, this.HYMNAL_JSON);
      })
      .catch(() => {
        this.downloadError();
      });
  }
}
