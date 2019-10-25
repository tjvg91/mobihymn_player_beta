import * as Firebase from 'firebase';
import { API } from 'src/services/api';
import { HymnMidi } from 'src/store/hymn-midi/hymn-midi.model';
import { HymnMidiService } from 'src/store/hymn-midi/hymn-midi.service';

import { Component } from '@angular/core';
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
    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      });
    } else {
    }
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
    this.api.file.readAsText(path, file).then(val => {
      const data = JSON.parse(val) as HymnMidi[];
      data.forEach(datum => {
        this.hymnMidiService.add(datum);
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
