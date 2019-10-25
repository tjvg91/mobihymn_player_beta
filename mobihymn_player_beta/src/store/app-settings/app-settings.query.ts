import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { AppSettingsStore, AppSettingsState } from './app-settings.store';

@Injectable({ providedIn: 'root' })
export class AppSettingsQuery extends Query<AppSettingsState> {

  constructor(protected store: AppSettingsStore) {
    super(store);
  }

}
