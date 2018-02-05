import React from 'react';
import {
    Image, View, Text, Button, Modal, NetInfo, StyleSheet,
} from 'react-native';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import logo from './logo.png';

@observer
export default class NetworkStatusModal extends React.Component {

    @observable isOnline = true;

    constructor(props) {
        super(props);
        NetInfo.getConnectionInfo().then(this.onConnectionChange);
        NetInfo.addEventListener('connectionChange', this.onConnectionChange);
    }

    @action.bound onConnectionChange({ type }) {
        this.isOnline = ('none' !== type);
    }

    @action.bound onCloseModal() {

    }

    render() {
        console.log(logo)
        return (
            <Modal
                visible={!this.isOnline}
                animationType={'slide'}
                onRequestClose={this.onCloseModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.innerContainer}>
                        <Image source={logo} style={styles.logo} />
                        <Text style={styles.heading}>
                            Unable to contact server
                        </Text>
                        <Text>
                            ShowMaker requires a network connection.
                            Please connect to the internet and try again.
                        </Text>
                    </View>
                </View>
            </Modal>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#dcdee3',
    },
    heading: {
        marginTop: 20,
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: 22,
    },
    innerContainer: {
        alignItems: 'center',
    },
    logo: {
        height: '40%',
        resizeMode: Image.resizeMode.contain,
    },
});
