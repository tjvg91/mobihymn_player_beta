import * as Firebase from 'firebase';
import { API } from '@services/api';
import { HymnMidi } from '@store/hymn-midi/hymn-midi.model';
import { HymnMidiService } from '@store/hymn-midi/hymn-midi.service';

import { Component, HostListener } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    }
  ];

  HYMNAL_JSON = 'hymnal.json';
  HYMNAL_DIR = this.api.storage + '/mobihymn_player_beta';

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private hymnMidiService: HymnMidiService,
    private fileTransfer: FileTransfer,
    private api: API
  ) {
    this.initializeApp();
  }

  initializeApp() {
    if (this.api.isCordova) {
      this.platform.ready().then(() => {
        this.statusBar.styleDefault();
        this.statusBar.hide();
        this.splashScreen.hide();
      });
      this.platform.pause.subscribe(() => {
        this.api.saveSettings();
      });
    }
  }

  checkHymnalFile() {
    this.api.file
      .checkFile(this.HYMNAL_DIR, this.HYMNAL_JSON)
      .then(exists => {
        alert('app component exists: ' + exists);
        if (!exists) {
          this.downloadFromFirebase();
        } else {
          this.downloadSuccess(this.HYMNAL_DIR, this.HYMNAL_JSON);
        }
      })
      .catch((err) => {
        if (err['message'] === 'NOT_FOUND_ERR') {
          this.downloadSuccess(this.HYMNAL_DIR, this.HYMNAL_JSON);
        }
      });
  }

  downloadFromFirebase() {
    this.api.firebaseAuth.onAuthStateChanged(() => {
      const storage = Firebase.storage().ref();
      storage
        .child('hymnal.json')
        .getDownloadURL()
        .then(url => {
          // this.api.httpCall<string>('GET', url, this.getUrlSuccess, this.getUrlError);
          this.transferFile(url);
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  getUrlSuccess(resp: string) {
    const data = JSON.parse(resp) as HymnMidi[];
    data.forEach(datum => {
      this.hymnMidiService.add(datum);
    });
  }

  getUrlError(error: any) {
    console.log('Error', error);
  }

  downloadSuccess(path, file) {
    this.api.file.readAsText(path, file).then(text => {
      const data = JSON.parse(text) as HymnMidi[];
      data.forEach(datum => {
        this.hymnMidiService.add(datum);
      });
    }).catch(err => {
      Object.keys(err).forEach(key => {
        alert(key + ': ' + err[key]);
      });
    });
  }

  downloadError() { }

  transferFile(url: string) {
    const app = this;
    const obj = this.fileTransfer.create();
    obj.onProgress(ev => { });
    obj
      .download(url, this.HYMNAL_DIR + '/' + this.HYMNAL_JSON)
      .then(() => {
        app.downloadSuccess(this.HYMNAL_DIR, this.HYMNAL_JSON);
      })
      .catch(() => {
        app.downloadError();
      });
  }

  @HostListener('window:beforeunload')
  onBeforeUnload() {
    if (!this.platform.is('cordova')) {
      this.api.saveSettings();
    }
  }
}
