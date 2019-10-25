import * as Firebase from 'firebase';

import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { ID } from '@datorama/akita';

export interface AppSettingsState {
  firebaseAuth: Firebase.auth.Auth;
  activeHymnId: ID;
}

export function createInitialState(): AppSettingsState {
  return {
    firebaseAuth: null,
    activeHymnId: 0
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'app-settings' })
export class AppSettingsStore extends Store<AppSettingsState> {
  constructor() {
    super(createInitialState());
  }

  akitaPreUpdate(prevState: AppSettingsState, nextState: AppSettingsState) {
    return nextState;
  }
}
