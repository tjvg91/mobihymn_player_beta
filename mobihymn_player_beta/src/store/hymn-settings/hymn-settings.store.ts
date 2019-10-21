import { Injectable } from '@angular/core';
import { Store, StoreConfig, ID } from '@datorama/akita';

export interface HymnSettingsState {
  hymnId: ID;
  transposeBy: number;
  tempo: number;
}

export function createInitialState(): HymnSettingsState {
  return {
    hymnId: 0,
    transposeBy: 0,
    tempo: 0
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'hymn-settings' })
export class HymnSettingsStore extends Store<HymnSettingsState> {
  constructor() {
    super(createInitialState());
  }
}
