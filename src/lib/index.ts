import { initPlayer } from './player';

export function createPlayer(src: string) {
  initPlayer(src).then(r =>  console.log(r));

}