import React from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    FlatList,
    Text,
    View,
    TouchableHighlight,
} from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, action } from 'mobx';
import EventModel from 'sm/models/event.js';
import { cloneDeep, uniqueId } from 'lodash';

import { observePubSub } from 'hippo/models/pub_sub';
import Checkin from './check-in/model';

@observer
export default class CheckInScreen extends React.PureComponent {

    static propTypes = {
        event: PropTypes.object.isRequired,
    }

    @action.bound
    onPress() {
        // this.checkin.event.title = uniqueId(this.checkin.event.title);
        // this.checkin.foo = uniqueId('foo');

        this.event.title = uniqueId('foo');

        // debugger

        // debugger
        // this.forceUpdate() //onPress={() => { Alert.alert('You tapped the button!')}}
    }

    @observable checkin = new Checkin({ event: this.props.event });

    @observable event = new EventModel(this.props.event);

    render() {
        const { event } = this;

        observePubSub(event);
        console.log("RENDER", this.event.title);

        return (
            <View
                style={{ flexDirection: 'column', padding: 20 }}
            >
                <Text
                    onPress={this.onPress}
                    style={{ fontSize: 24, fontWeight: 'bold' }}>
                    {this.event.title}
                </Text>
                <Text>{this.event.sub_title}</Text>
            </View>
        );
    }

    constructor(props) {
        super(props);
        console.log(props.event);
        // const event = new EventModel(cloneDeep(props.event));
//        this.
    }
}
