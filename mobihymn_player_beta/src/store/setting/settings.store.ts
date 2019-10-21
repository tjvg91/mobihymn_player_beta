import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Setting } from './setting.model';

export interface SettingsState extends EntityState<Setting> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'settings' })
export class SettingsStore extends EntityStore<SettingsState, Setting> {

  constructor() {
    super();
  }

}

