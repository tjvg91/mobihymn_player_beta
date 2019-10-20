import { soundfontStore } from './soundfont.store';

export async function update(id, data) {
  await Promise.resolve();
  soundfontStore.update(id, data);
}

export async function remove(id) {
  await Promise.resolve();
  soundfontStore.remove(id);
}
