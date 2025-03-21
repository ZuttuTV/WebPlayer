<script lang="ts">
    import 'shaka-player/dist/controls.css';
    import shaka from 'shaka-player/dist/shaka-player.ui';

    import {getSubtitles} from './subtitles';
    import {getSkipControls} from './skipControls';


    export let src = '';


    function initApp() {
        shaka.polyfill.installAll();
        if (shaka.Player.isBrowserSupported()) {
            initPlayer();
        } else {
            console.error('Browser not supported!');
        }
    }


    async function initPlayer() {
        const videoElement = document.getElementById('video') as HTMLVideoElement;
        const videoContainerElement = videoElement.parentElement;

        const localPlayer = new shaka.Player();

        // Create UI with configuration
        const ui = new shaka.ui.Overlay(
            localPlayer,
            videoContainerElement,
            videoElement,
        );



        // Configure UI with explicit options to ensure cast button is included
        const uiConfig = {

            enableTooltips: true,
            contextMenuElements: ['statistics', 'loop'],
            addSeekBar: true,
            doubleClickForFullscreen: true,
            forceLandscapeOnFullscreen: true,
            customContextMenu: true,
            seekBarColors: {
                base: 'rgba(255, 255, 255, 0.3)',
                buffered: 'rgba(255, 255, 255, 0.54)',
                played: 'rgb(138,43,226, 0.7)',
            },


            controlPanelElements: [
                'play_pause', 'time_and_duration',
                'skip_back',
                'skip_forward',
                'spacer',
                'mute',
                'volume',
                'subtitles',

                // 'overflow_menu',

                'fullscreen',
            ],
            overflowMenuButtons: [
                'captions',
                'playback_rate',
            ],

        };


        getSkipControls(localPlayer);

        getSubtitles(localPlayer);

        ui.configure(uiConfig)


        await localPlayer.attach(videoElement);

        const controls = ui.getControls()



        const player = controls.getPlayer();

        // Listen for error events.
        player.addEventListener('error', onErrorEvent);

        // Try to load a manifest.
        // This is an asynchronous process.
        try {
            await player.load(src);
            // This runs if the asynchronous load is successful.
            console.log('The video has now been loaded!');
        } catch (e) {
            // onError is executed if the asynchronous load fails.
            onError(e);
        }
    }

    function onErrorEvent(event: any) {
        // Extract the shaka.util.Error object from the event.
        onError(event.detail);
    }

    function onError(error: any) {
        // Log the error.
        console.error('Error code', error.code, 'object', error);
    }

    document.addEventListener('DOMContentLoaded', initApp);


</script>

<main>
    <div data-shaka-player-container
         data-shaka-player-cast-receiver-id="07AEE832"
    >
        <video data-shaka-player id="video"></video>
    </div>
</main>


<style>
    main {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
        margin: 0;
        padding: 0;
        position: fixed;
        top: 0;
        left: 0;
        box-sizing: border-box;
    }

    /* Make the player container fill the main element completely */
    div[data-shaka-player-container] {
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
    }

    /* Make the video element fill its container completely */
    video {
        width: 100%;
        height: 100%;
        background: black;
    }


</style>