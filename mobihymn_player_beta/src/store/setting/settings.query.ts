import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { SettingsStore, SettingsState } from './settings.store';
import { Setting } from './setting.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsQuery extends QueryEntity<SettingsState, Setting> {

  constructor(protected store: SettingsStore) {
    super(store);
  }

}
