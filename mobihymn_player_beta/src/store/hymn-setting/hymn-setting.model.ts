import { ID } from "@datorama/akita";

export interface HymnSetting {
  id: ID;
  tempo: number;
  transposeBy: number;
}

/**
 * A factory function that creates HymnSetting
 */
export function createHymnSetting(params: Partial<HymnSetting>) {
  return {} as HymnSetting;
}
