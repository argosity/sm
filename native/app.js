import { Navigation } from 'react-native-navigation';
import User from 'hippo/user';
import Config from 'hippo/config';
import { autorun, when } from 'mobx';
import registerScreens from './screens';

registerScreens();

function showLogin() {
    Navigation.startSingleScreenApp({
        screen: {
            screen: 'showmaker.login',
            title: 'Login',
            navigatorStyle: {},
            navigatorButtons: {},
        },
    });
}

function showApp() {
    Navigation.startSingleScreenApp({
        screen: {
            screen: 'showmaker.events',
            title: 'Events',
            navigatorStyle: {},
            navigatorButtons: {},
        },
    });
}


when(
    () => Config.isIntialized,
    () => {
        autorun(
            () => (User.isLoggedIn ? showApp() : showLogin()),
        );
    },
);
