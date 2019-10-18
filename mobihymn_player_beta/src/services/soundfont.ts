import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { API } from './api';
import { HTTP } from '@ionic-native/http/ngx';

export class SoundfontService {
  constructor(
    private http: HttpClient,
    private platform: Platform,
    private api: API,
    private httpIonic: HTTP
  ) {}

  public getSoundFonts(): Observable<any> {
    const httpCaller = this.platform.is('cordova')
      ? from(this.httpIonic.get(this.api.getSoundFont, null, null))
      : this.http.get(this.api.getSoundFont);
    return httpCaller.pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      }),
      switchMap((data: any) => data)
    );
  }
}
