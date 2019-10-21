import { ID } from '@datorama/akita';

export interface HymnMidi {
  id: ID;
  name: string;
}

/**
 * A factory function that creates HymnMidi
 */
export function createHymnMidi(params: Partial<HymnMidi>) {
  return {
    ...params
  } as HymnMidi;
}
