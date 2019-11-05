import { Component, OnInit, Input } from '@angular/core';
import { HymnMidi } from '@store/hymn-midi/hymn-midi.model';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutPage implements OnInit {

  @Input() public hymnMidiList: HymnMidi[];

  constructor() { }

  ngOnInit() { }

}
