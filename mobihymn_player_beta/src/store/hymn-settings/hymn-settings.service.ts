import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HymnSettingsStore } from './hymn-settings.store';

@Injectable({ providedIn: 'root' })
export class HymnSettingsService {
  constructor(private hymnSettingsStore: HymnSettingsStore, private http: HttpClient) {}
}
