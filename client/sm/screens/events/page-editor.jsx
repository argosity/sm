import React from 'react';
import PropTypes from 'prop-types';
import { action } from 'mobx';
import { observer } from 'mobx-react';

import Box from 'grommet/components/Box';
import Layer from 'grommet/components/Layer';

import NetworkActivityOverlay from 'hippo/components/network-activity-overlay';

import TextEditor from 'hippo/components/text-editor';

import Event from '../../models/event';
import './page-editor.scss';


@observer
export default class PageEditor extends React.PureComponent {
    static propTypes = {
        event:      PropTypes.instanceOf(Event).isRequired,
        onComplete: PropTypes.func.isRequired,
    }

    @action.bound
    onDone({ content }) {
        this.props.event.set({ page: content });
        this.props.onComplete();
    }

    render() {
        const { props: { event } } = this;
        return (
            <Layer onClose={this.props.onComplete} closer className="events-page">
                <NetworkActivityOverlay model={event} />
                <Box
                    separator='horizontal'
                    full="horizontal"
                    size="full"
                    basis="xxlarge"
                >
                    <TextEditor
                        defaultContent={this.props.event.page}
                        assets={this.props.event.page_images}
                        onComplete={this.onDone}
                    />
                </Box>
            </Layer>
        );
    }
}
