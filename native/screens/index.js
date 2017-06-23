import { Navigation } from 'react-native-navigation';

import Login   from './login/index';
import Signup  from './signup/index';
import Events  from './events';
import CheckIn from './check-in';

export default function() {
    Navigation.registerComponent('showmaker.events',   () => Events );
    Navigation.registerComponent('showmaker.login',    () => Login  );
    Navigation.registerComponent('showmaker.signup',   () => Signup );
    Navigation.registerComponent('showmaker.check-in', () => CheckIn );
}
