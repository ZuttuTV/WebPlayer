import shaka from 'shaka-player/dist/shaka-player.ui';
import {Captions} from "lucide-svelte";
import {mount} from "svelte";

export function getSubtitles(myapp: any) {
    myapp.SubtitleMenu = class extends shaka.ui.Element {
        constructor(parent: HTMLElement, controls: any) {
            super(parent, controls);

            // The actual button that will be displayed
            this.button_ = document.createElement('button');
            this.button_.className = 'subtitle-button';
            this.parent.appendChild(this.button_);

            // Mount the Captions icon component into the button
            mount(Captions, {
                target: this.button_,
                props: {
                    size: 24,
                    color: 'white'
                }
            });

            // Listen for clicks on the button to open the subtitles menu
            this.eventManager.listen(this.button_, 'click', () => {
                // Get the player instance
                const player = this.controls.getPlayer();

                // Get all text tracks
                const tracks = player.getTextTracks();

                // Create a container for the subtitle options
                // Create a container for the subtitle options
                const container = document.createElement('div');
                container.className = 'shaka-subtitle-selection';
                container.style.position = 'absolute';
                container.style.background = 'rgba(28, 28, 28, 0.9)';
                container.style.borderRadius = '2px';
                container.style.color = 'white';
                container.style.maxHeight = '300px';
                container.style.overflowY = 'auto';
                container.style.zIndex = '100';

                // Position the menu right above the button
                const buttonRect = this.button_.getBoundingClientRect();
                const controlsRect = this.controls.getControlsContainer().getBoundingClientRect();
                container.style.bottom = (controlsRect.height - buttonRect.top + controlsRect.top) + 'px';
                container.style.left = (buttonRect.left - controlsRect.left) + 'px';



                // Sort tracks alphabetically by label or language
                const sortedTracks = [...tracks].sort((a, b) => {
                    const aName = a.label || a.language || '';
                    const bName = b.label || b.language || '';
                    return aName.localeCompare(bName, undefined, { sensitivity: 'base' });
                });

                // Add each track as a selectable option
                sortedTracks.forEach((track: { label: string; language: any; }) => {
                    const trackDiv = document.createElement('div');
                    trackDiv.textContent = track.label || `${track.language}`;
                    trackDiv.className = 'shaka-subtitle-option';
                    trackDiv.style.padding = '8px 12px';
                    trackDiv.style.cursor = 'pointer';

                    // Highlight the currently selected track
                    if (player.isTextTrackVisible() &&
                        track === player.getTextTracks().find((t: { active: any; }) => t.active)) {
                        trackDiv.style.fontWeight = 'bold';
                        trackDiv.style.backgroundColor = 'rgba(138, 43, 226, 0.5)';
                    }

                    trackDiv.addEventListener('click', (event) => {
                        event.stopPropagation();  // Prevent event from bubbling up
                        player.selectTextTrack(track);
                        player.setTextTrackVisibility(true);
                        container.remove();
                    });
                    container.appendChild(trackDiv);
                });

                // Add "Off" option
                const offDiv = document.createElement('div');
                offDiv.textContent = 'Off';
                offDiv.className = 'shaka-subtitle-option';
                offDiv.style.padding = '8px 12px';
                offDiv.style.cursor = 'pointer';

                offDiv.addEventListener('click', (event) => {
                    event.stopPropagation();  // Prevent event from bubbling up
                    player.setTextTrackVisibility(false);
                    container.remove();
                });
                container.appendChild(offDiv);

                // Add to the UI controls
                this.controls.getControlsContainer().appendChild(container);

                // Close menu when clicking elsewhere
                const removeMenu = (event:any) => {
                    if (!container.contains(event.target) && event.target !== this.button_) {
                        container.remove();
                        document.removeEventListener('click', removeMenu);
                    }
                };

                // Delay to prevent immediate closing
                setTimeout(() => {
                    document.addEventListener('click', removeMenu);
                }, 100);
            });
        }
    };


// Factory that will create a button at run time.
    myapp.SubtitleMenu.Factory = class {
        create(rootElement: any, controls: any) {
            return new myapp.SubtitleMenu(rootElement, controls);
        }
    };

// Register our factory with the controls, so controls can create button instances.
    shaka.ui.Controls.registerElement(
        /* This name will serve as a reference to the button in the UI configuration object */ 'subtitles',
        new myapp.SubtitleMenu.Factory());
}