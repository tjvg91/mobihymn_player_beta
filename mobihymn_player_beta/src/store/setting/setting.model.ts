import { ID } from '@datorama/akita';

export interface Setting {
  id: ID;
  currentHymn: ID;
}

/**
 * A factory function that creates Settings
 */
export function createSetting(params: Partial<Setting>) {
  return {
    ...params
  } as Setting;
}
