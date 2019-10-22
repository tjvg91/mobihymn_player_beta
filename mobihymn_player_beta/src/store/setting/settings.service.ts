import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { HttpClient } from '@angular/common/http';
import { SettingsStore } from './settings.store';
import { Setting } from './setting.model';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  constructor(private settingsStore: SettingsStore, private http: HttpClient) {}

  get() {}

  add(setting: Setting) {
    this.settingsStore.add(setting);
  }

  update(id, setting: Partial<Setting>) {
    this.settingsStore.update(id, setting);
  }

  remove(id: ID) {
    this.settingsStore.remove(id);
  }
}
