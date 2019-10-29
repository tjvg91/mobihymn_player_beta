import * as Firebase from 'firebase';
import * as WebAudioFont from 'webaudiofont';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { File } from '@ionic-native/file/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { Platform } from '@ionic/angular';

import { environment } from '../environments/environment';
import { HymnSettingQuery } from '@store/hymn-setting/hymn-setting.query';
import { HymnMidiQuery } from '@store/hymn-midi/hymn-midi.query';
import { Settings } from './model';
import { HymnMidiStore } from '@store/hymn-midi/hymn-midi.store';
import { HymnSettingStore } from '@store/hymn-setting/hymn-setting.store';

export class API {
  ASSETS = (this.platform.is('cordova') ? this.inFile.applicationDirectory : '') + 'assets';

  public isCordova = this.platform.is('cordova');

  public storage = this.platform.is('android')
    ? this.inFile.externalDataDirectory
    : this.platform.is('ios')
    ? this.inFile.documentsDirectory
    : this.ASSETS;

  public http = this.isCordova ? this.ionicHttp : this.httpClient;
  public file = this.inFile;

  public firebaseAuth: Firebase.auth.Auth;
  public isSignedIn = false;

  constructor(
    private inFile: File,
    private platform: Platform,
    private httpClient: HttpClient,
    private ionicHttp: HTTP,
    private hymnMidiQuery: HymnMidiQuery,
    private hymnMidiStore: HymnMidiStore,
    private hymnSettingQuery: HymnSettingQuery,
    private hymnSettingStore: HymnSettingStore
  ) {}

  public httpCall<T>(
    method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH',
    url: string,
    successCallback: (arg0: T) => any,
    errorCallback?: (arg0: any) => any,
    body?: any,
    headers?: HttpHeaders | { [header: string]: string | string[] }
  ): void {
    const newUrl = this.platform.is('cordova')
      ? url
      : url.replace(/https:\/\/firebasestorage\.googleapis\.com/, '/firebaseapi');
    console.log(url);
    console.log(newUrl);
    switch (method) {
      case 'GET':
        if (this.isCordova) {
          this.ionicHttp
            .get(newUrl, null, headers)
            .then<void, never>(resp => {
              successCallback(resp.data);
            })
            .catch(error => {
              if (errorCallback) {
                errorCallback(error);
              }
            });
        } else {
          this.httpClient
            .get<T>(newUrl, {
              headers
            })
            .subscribe(
              val => {
                successCallback(val);
              },
              error => {
                if (errorCallback) {
                  errorCallback(error);
                }
              }
            );
        }
        break;
      case 'POST':
        if (this.isCordova) {
          this.ionicHttp
            .post(newUrl, body, headers)
            .then(resp => {
              successCallback(resp.data);
            })
            .catch(error => {
              if (errorCallback) {
                errorCallback(error);
              }
            });
        } else {
          this.httpClient
            .post<T>(newUrl, body, {
              headers
            })
            .subscribe(
              val => {
                successCallback(val);
              },
              error => {
                if (errorCallback) {
                  errorCallback(error);
                }
              }
            );
        }
        break;
      case 'PUT':
        if (this.isCordova) {
          this.ionicHttp
            .put(newUrl, body, headers)
            .then(resp => {
              successCallback(resp.data);
            })
            .catch(error => {
              errorCallback(error);
            });
        } else {
          this.httpClient
            .put<T>(newUrl, body, {
              headers
            })
            .subscribe(
              val => {
                successCallback(val);
              },
              error => {
                errorCallback(error);
              }
            );
        }
        break;
    }
  }

  public signInToFirebaseAuth() {
    const app = Firebase.initializeApp(environment.firebase.config);
    const auth = Firebase.auth(app);
    auth
      .signInWithEmailAndPassword(environment.firebase.email, environment.firebase.password)
      .catch(error => alert(error))
      .then(() => {
        this.isSignedIn = true;
      });
    this.firebaseAuth = auth;
  }

  public setSoundfont() {
    const player = new WebAudioFont();
    player.loader.decodeAfterLoading(new AudioContext(), '_tone_0043_GeneralUserGS_sf2_file');
    return player;
  }

  public saveSettings() {
    const settings = {
      activeHymn: this.hymnMidiQuery.getActiveId(),
      activeHymnSettings: this.hymnSettingQuery.getAll()
    } as Settings;

    this.file.writeFile(
      this.storage + '/mobihymn_player_beta',
      'settings.json',
      JSON.stringify(settings),
      {
        replace: true
      }
    );
  }

  public getSettings() {
    this.file.checkFile(this.storage + '/mobihymn_player_beta', 'settings.json').then(exists => {
      if (exists) {
        this.file.readAsText(this.storage + '/mobihymn_player_beta', 'settings.json').then(text => {
          const settings = JSON.parse(text) as Settings;
          if (settings.activeHymn) {
            this.hymnMidiStore.setActive(settings.activeHymn);
          }
          if (settings.activeHymnSettings) {
            this.hymnSettingStore.set(settings.activeHymnSettings);
          }
        });
      }
    });
  }
}
