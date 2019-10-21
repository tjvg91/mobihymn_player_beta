import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { HymnMidiStore, HymnMidiState } from './hymn-midi.store';
import { HymnMidi } from './hymn-midi.model';

@Injectable({
  providedIn: 'root'
})
export class HymnMidiQuery extends QueryEntity<HymnMidiState, HymnMidi> {

  constructor(protected store: HymnMidiStore) {
    super(store);
  }

}
