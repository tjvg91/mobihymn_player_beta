import * as Firebase from 'firebase';

import { Component } from '@angular/core';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Network } from '@ionic-native/network/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AlertController, LoadingController } from '@ionic/angular';
import { HymnMidi } from '@store/hymn-midi/hymn-midi.model';
import { HymnMidiQuery } from '@store/hymn-midi/hymn-midi.query';
import { HymnMidiService } from '@store/hymn-midi/hymn-midi.service';
import { HymnMidiStore } from '@store/hymn-midi/hymn-midi.store.js';
import { HymnSettingQuery } from '@store/hymn-setting/hymn-setting.query';
import { HymnSettingStore } from '@store/hymn-setting/hymn-setting.store';

import { API } from '../../services/api';
import { HymnSetting } from '@store/hymn-setting/hymn-setting.model';
import { HymnSettingService } from '@store/hymn-setting/hymn-setting.service';



@Component({
  selector: 'app-home-container',
  templateUrl: 'home.container.html',
  styleUrls: ['home.container.scss']
})
export class HomeContPage {
  activeMidi$ = this.hymnMidiQuery.selectActive();
  activeSetting$ = this.hymnSettingQuery.selectActive();

  isConnected = false;

  alert: HTMLIonAlertElement;

  HYMNAL_JSON = 'hymnal.json';
  HYMNAL_DIR = this.api.storage + '/mobihymn_player_beta';

  constructor(
    private network: Network,
    private fileTransfer: FileTransfer,
    private screenOrientation: ScreenOrientation,
    private api: API,
    private hymnMidiService: HymnMidiService,
    private hymnMidiStore: HymnMidiStore,
    private hymnMidiQuery: HymnMidiQuery,
    private hymnSettingStore: HymnSettingStore,
    private hymnSettingQuery: HymnSettingQuery,
    private hymnSettingService: HymnSettingService,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController
  ) {
    const hm = this;
    this.network.onConnect().subscribe(() => {
      this.isConnected = true;
      if (!this.api.isSignedIn) {
        this.api.signInToFirebaseAuth();
      }
      if (this.alert) {
        this.alert.dismiss();
      }
    });

    this.isConnected = this.network.type !== this.network.Connection.NONE;

    if (this.api.isCordova) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      this.checkHymnalFile();
      this.api.getSettings();
    }
  }

  checkHymnalFile() {
    this.api.file
      .checkFile(this.HYMNAL_DIR, this.HYMNAL_JSON)
      .then(exists => {
        alert('exists: ' + exists);
        if (!exists) {
          if (!this.isConnected) {
            this.alertCtrl
              .create({
                message:
                  'A file is missing in your device and needs internet connection to be downloaded. Connect to the internet.',
                backdropDismiss: false,
                keyboardClose: false
              })
              .then(alertComp => {
                this.alert = alertComp;
                if (!this.isConnected) {
                  this.alert.present();
                }
              });
          } else {
            if (!this.api.isSignedIn) {
              this.api.signInToFirebaseAuth();
            }
          }
        } else {
          this.downloadSuccess(this.HYMNAL_DIR, this.HYMNAL_JSON);
        }
      })
      .catch(err => {
        alert(err);
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
    alert('download success');
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

  downloadError(error: any) {
    alert(error);
  }

  transferFile(url: string) {
    const app = this;
    const obj = this.fileTransfer.create();

    let loader: HTMLIonLoadingElement;
    let loaderShowing = false;
    const loadingComp = app.loadCtrl.create({
      message: 'Downloading 0%...'
    });
    obj.onProgress(ev => {
      loadingComp.then(loading => {
        loader = loading;
        if (!loaderShowing) {
          loader.present();
          loaderShowing = true;
        }
        loader.message = 'Downloading ' + ((ev.loaded / ev.total) * 100).toFixed(0) + '%...';
      });
    });
    obj
      .download(url, this.HYMNAL_DIR + '/' + this.HYMNAL_JSON)
      .then(() => {
        loader.dismiss();
        app.downloadSuccess(this.HYMNAL_DIR, this.HYMNAL_JSON);
      })
      .catch(error => {
        app.downloadError(error);
      });
  }

  addSetting(val: HymnSetting) {
    this.hymnSettingStore.add(val);
  }

  updateSetting(val: Partial<HymnSetting>) {
    this.hymnSettingService.update(val.id, val);
  }
}
