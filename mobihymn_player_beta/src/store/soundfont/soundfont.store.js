import { createEntityStore } from '@datorama/akita';

const initialState = {};

export const soundfontStore = createEntityStore(initialState, { name: 'Soundfont' });

