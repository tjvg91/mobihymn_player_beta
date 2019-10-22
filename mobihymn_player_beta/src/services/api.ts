import { File } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';
import {
  HttpClient,
  HttpHeaders,
  HttpSentEvent,
  HttpProgressEvent,
  HttpUserEvent,
  HttpEvent
} from '@angular/common/http';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { from, Observable } from 'rxjs';

export class API {
  ASSETS = (this.platform.is('cordova') ? this.file.applicationDirectory : '') + 'assets';

  private isCordova = this.platform.is('cordova');

  public storage = this.platform.is('android')
    ? this.file.externalDataDirectory
    : this.platform.is('ios')
    ? this.file.documentsDirectory
    : this.ASSETS;
  public soundfont = this.ASSETS + '/soundfonts/0043_GeneralUserGS_sf2_file.js';
  public midiFiles = this.storage + '/assets';

  public http = this.isCordova ? this.ionicHttp : this.httpClient;

  constructor(
    private file: File,
    private platform: Platform,
    private httpClient: HttpClient,
    private ionicHttp: HTTP
  ) {}

  publc;
  httpCall(
    method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH',
    url: string,
    body?: any,
    headers?: HttpHeaders | { [header: string]: string | string[] }
  ): Observable<
    ArrayBuffer | HTTPResponse | HttpSentEvent | HttpUserEvent<object> | HttpProgressEvent
  > {
    switch (method) {
      case 'GET':
        return this.isCordova
          ? from(this.http.get(url, null, headers))
          : ((this.http as HttpClient).get(url, {
              headers
            }) as Observable<ArrayBuffer>);
      case 'POST':
        return this.isCordova
          ? from(
              this.http.post(url, body, {
                observe: 'events',
                headers
              })
            )
          : ((this.http as HttpClient).post(url, body, {
              observe: 'events',
              headers
            }) as Observable<ArrayBuffer | HttpEvent<object>>);
      case 'PUT':
        return this.isCordova
          ? from(
              this.http.put(url, body, {
                observe: 'events',
                headers
              })
            )
          : ((this.http as HttpClient).post(url, body, {
              observe: 'events',
              headers
            }) as Observable<ArrayBuffer | HttpEvent<object>>);
    }
  }
}
