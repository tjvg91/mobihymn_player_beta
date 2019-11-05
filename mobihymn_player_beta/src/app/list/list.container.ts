import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { HymnMidiQuery } from '@store/hymn-midi/hymn-midi.query';
import { HymnMidiStore } from '@store/hymn-midi/hymn-midi.store';
import { ID } from '@datorama/akita';

@Component({
  selector: 'app-list-cont',
  templateUrl: 'list.container.html',
  styleUrls: ['list.container.scss']
})
export class ListContPage {
  hymnMidiList$ = this.hymnMidiQuery.selectAll();

  constructor(
    private router: Router,
    private hymnMidiQuery: HymnMidiQuery,
    private hymnMidiStore: HymnMidiStore,
    private screenOrientation: ScreenOrientation
  ) {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

  setActiveHymn(val: ID) {
    this.hymnMidiStore.setActive(val);
  }

  routeToHome() {
    this.router.navigate(['/home']);
  }
}
