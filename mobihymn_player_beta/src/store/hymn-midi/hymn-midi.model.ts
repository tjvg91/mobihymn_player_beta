import { ID } from '@datorama/akita';

export interface HymnMidi {
  id: ID;
  number: string;
  title: string;
  midi: string;
}

/**
 * A factory function that creates HymnMidi
 */
export function createHymnMidi(params: Partial<HymnMidi>) {
  return {
    ...params
  } as HymnMidi;
}
