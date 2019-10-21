import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { HttpClient } from '@angular/common/http';
import { HymnMidiStore } from './hymn-midi.store';
import { HymnMidi } from './hymn-midi.model';

@Injectable({ providedIn: 'root' })
export class HymnMidiService {

  constructor(private hymnMidiStore: HymnMidiStore,
              private http: HttpClient) {
  }

  get() {
    this.http.get('https://akita.com').subscribe((entities) => this.hymnMidiStore.set(entities));
  }

  add(hymnMidi: HymnMidi) {
    this.hymnMidiStore.add(hymnMidi);
  }

  update(id, hymnMidi: Partial<HymnMidi>) {
    this.hymnMidiStore.update(id, hymnMidi);
  }

  remove(id: ID) {
    this.hymnMidiStore.remove(id);
  }
}
