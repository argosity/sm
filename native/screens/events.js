import React from 'react';
import {
    StyleSheet,
    FlatList,
    Text,
    View,
    TouchableHighlight,
} from 'react-native';
import { observer } from 'mobx-react/native';
import { partial } from 'lodash';
// import { action, observable } from 'mobx';
import User from 'hippo/user';
import EventModel from 'sm/models/event.js';
import Query from 'hippo/models/query.js';
import { autobind } from 'core-decorators';
import moment from 'moment';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});



@observer
export default class EventsScreen extends React.PureComponent {

    query = new Query({
        src: EventModel,
        autoFetch: true,
        syncOptions: { with: 'with_details' },
        fields: [
            { id: 'id', visible: false },
            'identifier',
            'title',
            'sub_title',
            'description',
            'occurs_at',
            'image_details',
            'venue_details',
            'visible_after', 'visible_until',
            'onsale_after', 'onsale_until',
            'capacity',
        ],
    });

    constructor(props) {
        super(props);
        // if you want to listen on navigator events, set this up
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent({ type, id }) {
        if ('NavBarButtonPress' === type && 'logout' === id) {
            User.logout();
        }
    }

    componentDidMount() {
        this.query.open();
    }

    @autobind
    onEventSelect(index) {
        const event = this.query.results.rowAsObject(index);
        this.props.navigator.push({
            screen: 'showmaker.check-in',
            title:  event.title,
            passProps: { event },
        });
    }

    @autobind
    renderEvent({ item: [id, identifier, title, sub_title, description, occurs_at], index }) {
        return (
            <TouchableHighlight
                onPress={partial(this.onEventSelect, index)}
            >
                <View
                    style={{ flexDirection: 'column', height: 100, padding: 20 }}
                >
                    <Text style={styles.titleText}>{title}</Text>
                    <Text>{sub_title}</Text>
                    <Text>{moment(occurs_at).format('YYYY-MM-DD')}</Text>
                </View>
            </TouchableHighlight>
        );
    }

    @autobind
    keyForRow(row) {
        return row[0];
    }

    render() {
        return (
            <FlatList
                style={styles.container}
                data={this.query.results.rows.peek()}
                extraData={this.query.results.updateKey}
                renderItem={this.renderEvent}
                keyExtractor={this.keyForRow}
            />

        );
    }
}
