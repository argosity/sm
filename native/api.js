import Config from './config';

let WebView;

const Handlers = {

    ready(tenant) {
        Config.tenant = tenant;
    },
    startBarcodeScan() {
        WebView.isScanning = true;
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
