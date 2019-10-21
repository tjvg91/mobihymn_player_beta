import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { HymnSettingsStore, HymnSettingsState } from './hymn-settings.store';

@Injectable({ providedIn: 'root' })
export class HymnSettingsQuery extends Query<HymnSettingsState> {

  constructor(protected store: HymnSettingsStore) {
    super(store);
  }

}
