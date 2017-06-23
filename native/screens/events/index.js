import React from 'react';
import {
    StyleSheet,
    FlatList,
    Text,
    View,
    TouchableHighlight,
} from 'react-native';
import { observer } from 'mobx-react';
import { partial } from 'lodash';
// import { action, observable } from 'mobx';

import EventModel from 'sm/models/event.js';
import Query from 'hippo/models/query.js';
import { autobind } from 'core-decorators';

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
            'image_details',
            'venue_details',
            'occurs_at',
            'visible_after', 'visible_until',
            'onsale_after', 'onsale_until',
            'capacity',
        ],
    });

    componentDidMount() {
        this.query.open();
    }

    @autobind
    onEventSelect(index) {
        this.props.navigator.push({
            screen: 'showmaker.event',
            passProps: {
                event: this.query.modelForRow(index),
            },
        });
    };

    @autobind
    renderEvent({ item: row, index }) {

        return (
            <TouchableHighlight
                onPress={partial(this.onEventSelect, index)}
            >
                <View
                    style={{ flexDirection: 'row', height: 100, padding: 20 }}
                >

                    <Text>{row[2]}</Text>
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
};
