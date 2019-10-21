import { File } from '@ionic-native/file/ngx';

const ASSETS = '/assets/';

export class API {
  public getSoundFont = ASSETS + 'soundfonts/acoustic_grand_piano-mp3.js';
  constructor(private file: File) {}
}
