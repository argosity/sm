import { Navigation } from 'react-native-navigation';
import User from 'hippo/user';
import Config from 'hippo/config';
import { autorun, when } from 'mobx';
import { onBoot } from 'hippo/models/pub_sub';
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
    onBoot();

    Navigation.startSingleScreenApp({
        screen: {
            screen: 'showmaker.events',
            title: 'Events',
            navigatorStyle: {},
            navigatorButtons: {
                leftButtons: [
                    {
                        title: 'Logout', // for a textual button, provide the button title (label)
                        id: 'logout',
                    },
                ],
            },
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
