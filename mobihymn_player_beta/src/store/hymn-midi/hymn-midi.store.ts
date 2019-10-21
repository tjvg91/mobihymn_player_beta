import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { HymnMidi } from './hymn-midi.model';

export interface HymnMidiState extends EntityState<HymnMidi> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'hymn-midi' })
export class HymnMidiStore extends EntityStore<HymnMidiState, HymnMidi> {

  constructor() {
    super();
  }

}

