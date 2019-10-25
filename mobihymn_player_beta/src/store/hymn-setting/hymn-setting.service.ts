import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { HttpClient } from '@angular/common/http';
import { HymnSettingStore } from './hymn-setting.store';
import { HymnSetting } from './hymn-setting.model';

@Injectable({ providedIn: 'root' })
export class HymnSettingService {

  constructor(private hymnSettingStore: HymnSettingStore,
              private http: HttpClient) {
  }

  get() {
    this.http.get('https://akita.com').subscribe((entities) => this.hymnSettingStore.set(entities));
  }

  add(hymnSetting: HymnSetting) {
    this.hymnSettingStore.add(hymnSetting);
  }

  update(id, hymnSetting: Partial<HymnSetting>) {
    this.hymnSettingStore.update(id, hymnSetting);
  }

  remove(id: ID) {
    this.hymnSettingStore.remove(id);
  }
}
