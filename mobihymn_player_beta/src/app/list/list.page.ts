import { Component } from '@angular/core';
import MIDIButtons from '../../assets/midi-buttons.json';
import { Router } from '@angular/router';
import { HymnMidiQuery } from '../../store/hymn-midi/hymn-midi.query';
import { HymnMidi } from '../../store/hymn-midi/hymn-midi.model';
import { HymnMidiStore } from '../../store/hymn-midi/hymn-midi.store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage {
  buttons = MIDIButtons;
  inputReset = true;
  midiVal = '1';

  constructor(
    private router: Router,
    private hymnMidiQuery: HymnMidiQuery,
    private hymnMidiStore: HymnMidiStore
  ) {}

  ionViewDidEnter() {
    const routerOutlet = document.querySelector('ion-router-outlet');

    const thisContent = routerOutlet.querySelector('app-list ion-content');
    thisContent.shadowRoot
      .querySelector('main')
      .setAttribute('style', 'display:flex; justify-content: center; flex-direction: column');
  }

  buttonClick(btnVal: string | number) {
    if (!(/[fst]$/.test(this.midiVal) && /f|s|t/.test(btnVal + ''))) {
      if (this.inputReset) {
        if (/\d/.test(btnVal + '')) {
          if (btnVal !== 0) {
            this.midiVal = btnVal + '';
            this.inputReset = false;
          }
        }
      } else {
        if (/[0-9fst]/.test(btnVal + '')) {
          this.midiVal += btnVal + '';
        } else {
          switch (btnVal) {
            case '<':
              if (this.midiVal.length === 1) {
                this.inputReset = true;
                this.midiVal = '1';
              } else {
                this.midiVal = this.midiVal.substr(0, this.midiVal.length - 1);
              }
              break;
            case '>':
              this.hymnMidiQuery
                .selectEntity((midi: HymnMidi) => midi.number === this.midiVal)
                .pipe(
                  map(midi => {
                    this.hymnMidiStore.setActive(midi.id);
                    this.router.navigate(['/home']);
                  })
                );
              break;
            default:
              break;
          }
        }
      }
    }
  }
}
