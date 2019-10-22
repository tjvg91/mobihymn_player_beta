import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { HttpClient } from '@angular/common/http';
import { HymnMidiStore } from './hymn-midi.store';
import { HymnMidi } from './hymn-midi.model';
import { API } from 'src/services/api';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HymnMidiService {
  constructor(private hymnMidiStore: HymnMidiStore, private http: HttpClient, private api: API) {}

  get() {
    this.api.httpCall('GET', '/', null, null).pipe(
      map(resp => {
        console.log(resp);
        return resp;
      }),
      catchError(error => {
        console.log(error);
        return error;
      })
    );
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
