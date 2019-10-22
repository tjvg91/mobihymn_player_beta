import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SoundfontService } from 'src/store/soundfont/soundfont.service';
import { HymnMidiService } from 'src/store/hymn-midi/hymn-midi.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private soundfontService: SoundfontService,
    private hymnMidiService: HymnMidiService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.initializeSoundfonts();
      });
    } else {
      this.initializeSoundfonts();
    }
  }

  initializeSoundfonts() {
    this.soundfontService.set();
    this.hymnMidiService.get();
  }
}
