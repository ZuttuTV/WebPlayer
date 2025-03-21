import Player from './Player.svelte';

    export { Player as default };

    export function createPlayer(target: HTMLElement, props = {}) {
      return new Player({
        target,
        props
      });
    }