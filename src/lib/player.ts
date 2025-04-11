import 'shaka-player/dist/controls.css';
import shaka from 'shaka-player/dist/shaka-player.ui';
import {getSkipControls} from "./skipControls";

export async function initPlayer(src: string) {
    const videoElement = document.getElementById('video') as HTMLVideoElement;
    const videoContainerElement = videoElement.parentElement;


    // Add playsinline attributes programmatically
    videoElement.setAttribute('playsinline', '');
    videoElement.setAttribute('webkit-playsinline', '');
    videoElement.setAttribute('x-webkit-airplay', 'allow');

    // Create a new player instance
    const localPlayer = new shaka.Player(videoElement);


    // Configure text display settings
    localPlayer.configure({
        streaming: {
            alwaysStreamText: true,
        },
        textDisplayer: {
            fontScale: 1.2,
            fontFamily: 'Arial, Helvetica, sans-serif',
            textBackgroundColor: 'rgba(0, 0, 0, 0.5)'
        }
    });

    // Create UI with configuration
    const ui = new shaka.ui.Overlay(
        localPlayer,
        videoContainerElement,
        videoElement
    );

    // Configure UI
    const uiConfig = {
        overrideNativeControls: true,     // Override native controls

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
            'captions',
            'fullscreen',
        ],
        overflowMenuButtons: [
            'playback_rate',
        ],
    };

    getSkipControls(localPlayer);
    ui.configure(uiConfig);

    // Listen for error events
    localPlayer.addEventListener('error', onErrorEvent);

    // Listen for text track events
    localPlayer.addEventListener('texttrackvisibility', () => {
        console.log('Text track visibility changed:', localPlayer.isTextTrackVisible());
    });

    localPlayer.addEventListener('trackschanged', () => {
        const tracks = localPlayer.getTextTracks();
        console.log('Available text tracks:', tracks);
    });

    // Try to load the manifest
    try {
        await localPlayer.load(src);
        console.log('The video has now been loaded!');

        // Set text track visibility to true by default
        localPlayer.setTextTrackVisibility(true);

        // Log available text tracks
        const tracks = localPlayer.getTextTracks();
        console.log('Available text tracks:', tracks);
    } catch (e) {
        onError(e);
    }
}

function onErrorEvent(event: any) {
    onError(event.detail);
}

function onError(error: any) {
    console.error('Error code', error.code, 'object', error);
}