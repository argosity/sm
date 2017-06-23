import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import User from 'hippo/user';
import Config from '../../config';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';

const { width, height } = Dimensions.get('window');
const background = require('./login1_bg.png');
const mark = require('./login1_mark.png');
const lockIcon = require('./login1_lock.png');
const personIcon = require('./login1_person.png');
const identifierIcon = require('./signup_identifier.png');

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    markWrap: {
        flex: 1,
        paddingVertical: 30,
    },
    mark: {
        width: null,
        height: null,
        flex: 1,
    },
    background: {
        width,
        height,
    },
    wrapper: {
        paddingVertical: 30,
    },
    inputWrap: {
        flexDirection: 'row',
        marginVertical: 10,
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#CCC',
    },
    iconWrap: {
        paddingHorizontal: 7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        height: 20,
        width: 20,
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#FF3366',
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
    },
    forgotPasswordText: {
        color: '#D8D8D8',
        backgroundColor: 'transparent',
        textAlign: 'right',
        paddingRight: 15,
    },
    signupWrap: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    accountText: {
        color: '#D8D8D8',
    },
    signupLinkText: {
        color: '#FFF',
        marginLeft: 5,
    },
});

@observer
export default class LoginScreen extends React.PureComponent {

    @observable login = '';
    @observable password = '';
    @observable identifier = '';

    @action.bound
    attemptLogin() {
//        debugger
        Config.api_host = `http://${this.identifier}.hippo.dev:9292`;
        // api_root_domain = 'hippo.dev:9292'; //showmaker.com';
        // Config.protocol = 'http:';

        User.attemptLogin(this.login, this.password);
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={background} style={styles.background} resizeMode="cover">
                    <View style={styles.markWrap}>
                        <Image source={mark} style={styles.mark} resizeMode="contain" />
                    </View>
                    <View style={styles.wrapper}>
                        <View style={styles.inputWrap}>
                            <View style={styles.iconWrap}>
                                <Image source={identifierIcon} style={styles.icon} resizeMode="contain" />
                            </View>
                            <TextInput
                                autoCapitalize="none"
                                value={this.identifier}
                                onChangeText={id => (this.identifier = id)}
                                onSubmitEditing={() => this.loginInput.focus()}
                                autoCorrect={false}
                                placeholder="Account Identifier"
                                placeholderTextColor="#FFF"
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputWrap}>
                            <View style={styles.iconWrap}>
                                <Image source={personIcon} style={styles.icon} resizeMode="contain" />
                            </View>
                            <TextInput
                                autoCapitalize="none"
                                autoFocus={true}
                                autoCorrect={false}
                                value={this.login}
                                onChangeText={login => (this.login = login)}
                                onSubmitEditing={() => this.passwordInput.focus()}
                                ref={i => (this.loginInput = i)}
                                placeholder="Username"
                                placeholderTextColor="#FFF"
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputWrap}>
                            <View style={styles.iconWrap}>
                                <Image source={lockIcon} style={styles.icon} resizeMode="contain" />
                            </View>
                            <TextInput
                                autoCapitalize="none"
                                placeholderTextColor="#FFF"
                                placeholder="Password"
                                style={styles.input}
                                value={this.password}
                                onChangeText={password => (this.password = password)}
                                ref={i => (this.passwordInput = i)}
                                secureTextEntry
                            />
                        </View>
                        <TouchableOpacity activeOpacity={0.5}>
                            <View>
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={this.attemptLogin}
                        >
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Sign In</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.signupWrap}>
                            <Text style={styles.accountText}>Don’t have an account?</Text>
                            <TouchableOpacity
                                activeOpacity={0.5}
                            >
                                <View>
                                    <Text style={styles.signupLinkText}>Sign Up</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Image>
            </View>
        );
    }
}
