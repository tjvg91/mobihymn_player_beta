import { Component, OnInit } from '@angular/core';
import { HymnMidiQuery } from '@store/hymn-midi/hymn-midi.query';

@Component({
  selector: 'app-about-container',
  templateUrl: './about.container.html',
  styleUrls: ['./about.container.scss'],
})
export class AboutContPage implements OnInit {

    public getAllMidis$ = this.hymnMidiQuery.selectAll();

  constructor(
      private hymnMidiQuery: HymnMidiQuery
  ) { }

  ngOnInit() {}

}
