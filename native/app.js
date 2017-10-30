import React from 'react';
import { Text, WebView, View, StyleSheet, Dimensions } from 'react-native';
import { observer } from 'mobx-react';
import { observable, computed, action } from 'mobx';
import Camera from 'react-native-camera';
import Bridge from './bridge';

import { onMessage, setRef } from './api';
import Config from './config';

@observer
export default class ShowMakerWeb extends React.Component {

    @observable command;
    @observable isScanning = false;

    constructor(props) {
        super(props);
        setRef(this);
    }

    @computed get uri() {
        return Config.tenant ?
               `http://${Config.tenant}.argosity.com:9292/` :
               'http://dev.argosity.com:9292/mobile';
    }

    sendCommand(cmd, ...args) {
        this.command = `window._transmitToShowMaker(${cmd}, ${JSON.stringify(args)})`;
    }

    @action.bound startScan() {
        const options = {};
        this.camera.capture({metadata: options})
            .then((data) => console.log(data))
            .catch(err => console.error(err));
    }

    @action.bound onBarcodeRead(ev) {
        console.log(ev);

        this.isScanning = false;
    }

    renderCamera() {
        if (!this.isScanning) { return null; }

        const { width } = Dimensions.get('window');
        return (
            <Camera
                ref={(cam) => {
                        this.camera = cam;
                }}
                onBarCodeRead={this.onBarcodeRead}
                style={{
                    position: 'absolute',
                    top: 100,
                    height: 200,
                    right: 20,
                    width: width - 40,
                }}
                aspect={Camera.constants.Aspect.fill}
            />
        );
    }

    render() {
        if (!Config.initialized) { return null; }

        return (
            <View style={styles.container}>
                <WebView
                    style={styles.webview}
                    injectJavaScript={this.command}
                    injectedJavaScript={`(${Bridge.toString()})()`}
                    onMessage={onMessage}
                    source={{ uri: this.uri }}
                />
                {this.renderCamera()}
            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    webview: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    preview: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: 50,
        height: 50,
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 10,
        margin: 40,
    }
});
