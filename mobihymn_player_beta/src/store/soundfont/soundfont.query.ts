import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { SoundfontStore, SoundfontState } from './soundfont.store';

@Injectable({ providedIn: 'root' })
export class SoundfontQuery extends Query<SoundfontState> {
  constructor(protected store: SoundfontStore) {
    super(store);
  }
}
