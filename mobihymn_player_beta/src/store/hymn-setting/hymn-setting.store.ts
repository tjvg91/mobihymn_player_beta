import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { HymnSetting } from './hymn-setting.model';

export interface HymnSettingState extends EntityState<HymnSetting> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'hymn-setting' })
export class HymnSettingStore extends EntityStore<HymnSettingState, HymnSetting> {

  constructor() {
    super();
  }

}

