import { createEntityQuery } from '@datorama/akita';
import { soundfontStore } from './soundfont.store';

export const soundfontQuery = createEntityQuery(soundfontStore);
