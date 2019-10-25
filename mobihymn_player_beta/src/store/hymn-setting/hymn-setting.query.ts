import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { HymnSettingStore, HymnSettingState } from './hymn-setting.store';
import { HymnSetting } from './hymn-setting.model';

@Injectable({
  providedIn: 'root'
})
export class HymnSettingQuery extends QueryEntity<HymnSettingState, HymnSetting> {

  constructor(protected store: HymnSettingStore) {
    super(store);
  }

}
