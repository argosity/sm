export default function() {
    let onBarcodeCallback;

    const transmit = function(command, ...args) {
        window.postMessage(JSON.stringify({ command, args }));
    };

    window.ShowMakerApp = {
        onReady(tenant) { transmit('ready', tenant); },
        startBarcodeScan() { transmit('startBarcodeScan'); },
        onBarcodeScan(cb) { onBarcodeCallback = cb; },
    };
}
