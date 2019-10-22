import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import * as WebAudioFont from 'webaudiofont';

export interface SoundfontState {
  webAudioFont: WebAudioFont;
}

export function createInitialState(): SoundfontState {
  return {
    webAudioFont: null
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'soundfont' })
export class SoundfontStore extends Store<SoundfontState> {
  constructor() {
    super(createInitialState());
  }
}
