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
import EventModel from 'sm/models/event.js';
import { cloneDeep } from 'lodash';

@observer
export default class CheckInScreen extends React.PureComponent {

    static propTypes = {
        event: PropTypes.object.isRequired,
    }

    render() {
        return (
            <View
                style={{ flexDirection: 'row', height: 100, padding: 20 }}
            >
                <Text>
                    {this.event.title}
                </Text>
            </View>
        );
    }

    constructor(props) {
        super(props);
        // console.log(props.event);
        this.event = new EventModel(cloneDeep(props.event));
    }
}
