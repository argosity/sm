import Sound from 'react-native-sound';
import Config from './config';

const SOUNDS = {};
['fail', 'beep'].forEach((snd) => {
    SOUNDS[snd] = new Sound(`${snd}.mp3`, Sound.MAIN_BUNDLE, (error) => {
        // eslint-disable-next-line no-console
        if (error) console.warn(`failed to load '${snd}' sound`, error);
    });
});

let WebView;

const Handlers = {

    ready(tenant) {
        Config.tenant = tenant;
    },

    startBarcodeScan() {
        WebView.isScanning = true;
    },

    playSound(sndId) {
        const sound = SOUNDS[sndId];
        if (sound) {
            Sound.setCategory('Playback');
            sound.play();
        } else {
            // eslint-disable-next-line no-console
            console.warn(`${sndId} doesn't exist`);
        }
    },

};

export function setRef(wv) {
    WebView = wv;
}

export function onMessage(msg) {
    let parsedMessage;
    try {
        parsedMessage = JSON.parse(msg.nativeEvent.data);
    } catch (e) {
        // ignore unknown postMessages
    }
    if (parsedMessage &&
        parsedMessage.command &&
        Handlers[parsedMessage.command]
    ) {
        Handlers[parsedMessage.command](...parsedMessage.args);
    }
}
