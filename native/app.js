import React from 'react';
import {
    WebView, View, StyleSheet, Dimensions,
} from 'react-native';
import Button from 'react-native-button';
import { observer } from 'mobx-react';
import { observable, computed, action } from 'mobx';
import Camera from 'react-native-camera';
import Bridge from './bridge';
import NetworkStatusModal from './network-status-modal';

import { onMessage, setRef } from './api';
import Config from './config';

let styles;

@observer
export default class ShowMakerWeb extends React.Component {

    @observable isScanning = false;
    @observable webView;

    constructor(props) {
        super(props);
        setRef(this);
    }

    sendCommand(cmd, payload) {
        const emit = `window.ShowMakerApp.emit('${cmd}', ${JSON.stringify(payload)})`;
        this.webView.injectJavaScript(emit);
    }

    @action.bound onBarcodeRead(ev) {
        this.isScanning = false;
        this.sendCommand('barcodeScan', ev);
    }

    @action.bound setWebViewRef(wv) {
        this.webView = wv;
    }

    @action.bound cancelCapture() {
        this.isScanning = false;
    }

    renderCamera() {
        if (!this.isScanning) { return null; }
        const { width } = Dimensions.get('window');

        return (
            <View
                style={{
                    position: 'absolute',
                    top: 100,
                    height: width * 0.6,
                    right: 20,
                    left: 20,
                    backgroundColor: 'black',
                }}
            >
                <Camera
                    style={styles.camera}
                    onBarCodeRead={this.onBarcodeRead}
                    aspect={Camera.constants.Aspect.fill}
                />

                <Button
                    containerStyle={{
                        padding: 10,
                        height: 45,
                        overflow: 'hidden',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        margin: 10,
                        color: 'white',
                    }}
                    onPress={this.cancelCapture}
                >
                    Cancel
                </Button>

            </View>
        );
    }

    render() {
        if (!Config.initialized) { return null; }
        return (
            <View style={styles.container}>
                <NetworkStatusModal />
                <WebView
                    ref={this.setWebViewRef}
                    bounces={false}
                    style={styles.webview}
                    injectedJavaScript={`(${Bridge.toString()})()`}
                    onMessage={onMessage}
                    source={{ uri: Config.url }}
                />
                {this.renderCamera()}
            </View>
        );
    }

}


styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    webview: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    camera: {
        flex: 1,
    },
});
