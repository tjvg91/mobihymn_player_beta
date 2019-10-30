import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ID } from '@datorama/akita';

import MIDIButtons from '@assets/midi-buttons.json';
import { HymnMidi } from '@store/hymn-midi/hymn-midi.model';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage {
  buttons = MIDIButtons;
  inputReset = true;
  midiVal = '1';
  midiList: HymnMidi[];

  @Input()
  set hymnMidiList(val: HymnMidi[]) {
    this.midiList = val;
  }

  @Output() setActiveHymn = new EventEmitter<ID>();
  @Output() routeToHome = new EventEmitter<void>();

  constructor(private toastCtrl: ToastController) {}

  ionViewDidEnter() {
    const routerOutlet = document.querySelector('ion-router-outlet');

    const thisContent = routerOutlet.querySelector('app-list ion-content');
    thisContent.shadowRoot
      .querySelector('main')
      .setAttribute('style', 'display:flex; justify-content: center; flex-direction: column');
  }

  async buttonClick(btnVal: string | number) {
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
              const found = this.midiList.find(midi => midi.number === this.midiVal);
              if (found) {
                this.setActiveHymn.emit(parseInt(this.midiVal));
                this.routeToHome.emit();
              } else {
                const toast = await this.toastCtrl.create({
                  duration: 3000,
                  message: 'MIDI not found.'
                });
                toast.present();
              }
              this.inputReset = true;
              break;
            default:
              break;
          }
        }
      }
    }
  }
}
