import { ID } from '@datorama/akita';
import { HymnSetting } from '@store/hymn-setting/hymn-setting.model';

export interface Settings {
  activeHymn: ID;
  activeHymnSettings: HymnSetting[];
}

export interface KeySignature {
  major: MusicalKey[];
  minor: MusicalKey[];
}

export interface MusicalKey {
  name: string;
  otherNames: string[];
}
