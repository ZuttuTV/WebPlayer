import shaka from 'shaka-player/dist/shaka-player.ui';
import {UndoDot, RedoDot} from "lucide-svelte";
import {mount} from "svelte";

export function getSkipControls(myapp: any) {
    // Skip Forward Implementation
    myapp.SkipForwardButton = class extends shaka.ui.Element {
        constructor(parent: HTMLElement, controls: any) {
            super(parent, controls);

            this.button_ = document.createElement('button');
            this.button_.className = 'skip-forward-button';
            this.parent.appendChild(this.button_);

            // Mount the SkipForward icon
            mount(RedoDot, {
                target: this.button_,
                props: {
                    size: 24,
                    color: 'white'
                }
            });

            // Add text showing skip seconds
            const skipSeconds = document.createElement('span');
            skipSeconds.textContent = '+15s';
            skipSeconds.style.fontSize = '10px';
            skipSeconds.style.position = 'absolute';
            skipSeconds.style.bottom = '2px';
            skipSeconds.style.right = '2px';
            this.button_.appendChild(skipSeconds);

            this.eventManager.listen(this.button_, 'click', (event: any) => {
                event.stopPropagation();
                const player = this.controls.getPlayer();
                const currentTime = player.getMediaElement().currentTime;
                player.getMediaElement().currentTime = currentTime + 15;
            });
        }
    };

    // Skip Backward Implementation
    myapp.SkipBackButton = class extends shaka.ui.Element {
        constructor(parent: HTMLElement, controls: any) {
            super(parent, controls);

            this.button_ = document.createElement('button');
            this.button_.className = 'skip-back-button';
            this.parent.appendChild(this.button_);

            // Mount the SkipBack icon
            mount(UndoDot, {
                target: this.button_,
                props: {
                    size: 24,
                    color: 'white'
                }
            });

            // Add text showing skip seconds
            const skipSeconds = document.createElement('span');
            skipSeconds.textContent = '-5s';
            skipSeconds.style.fontSize = '10px';
            skipSeconds.style.position = 'absolute';
            skipSeconds.style.bottom = '2px';
            skipSeconds.style.right = '2px';
            this.button_.appendChild(skipSeconds);

            this.eventManager.listen(this.button_, 'click', (event: any) => {
                event.stopPropagation();
                const player = this.controls.getPlayer();
                const currentTime = player.getMediaElement().currentTime;
                player.getMediaElement().currentTime = Math.max(0, currentTime - 5);
            });
        }
    };

    // Register factories for both buttons
    myapp.SkipForwardButton.Factory = class {
        create(rootElement: any, controls: any) {
            return new myapp.SkipForwardButton(rootElement, controls);
        }
    };

    myapp.SkipBackButton.Factory = class {
        create(rootElement: any, controls: any) {
            return new myapp.SkipBackButton(rootElement, controls);
        }
    };

    // Register our elements with the controls
    shaka.ui.Controls.registerElement('skip_forward', new myapp.SkipForwardButton.Factory());
    shaka.ui.Controls.registerElement('skip_back', new myapp.SkipBackButton.Factory());
}