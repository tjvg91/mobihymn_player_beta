import * as Firebase from 'firebase';
import { environment } from '../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppSettingsStore } from './app-settings.store';

@Injectable({ providedIn: 'root' })
export class AppSettingsService {
  constructor(private appSettingsStore: AppSettingsStore, private http: HttpClient) {}

  getFirebaseAuth(): Firebase.auth.Auth {
    const app = Firebase.initializeApp(environment.firebase);
    const auth = Firebase.auth(app);
    auth
      .signInWithEmailAndPassword('tim.gandionco@gmail.com', 'Tjvg1991')
      .catch(error => alert(error));
    return auth;
  }
}
