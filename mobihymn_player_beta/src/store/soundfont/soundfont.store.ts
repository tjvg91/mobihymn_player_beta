import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import * as Soundfont from 'soundfont-player';

export interface SoundfontState {
  soundfont: Soundfont.Player;
}

export function createInitialState(): SoundfontState {
  return {
    soundfont: null
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'soundfont' })
export class SoundfontStore extends Store<SoundfontState> {
  constructor() {
    super(createInitialState());
  }
}
