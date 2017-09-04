import React from 'react';
import PropTypes from 'prop-types';
import { action } from 'mobx';
import { observer } from 'mobx-react';

import Box from 'grommet/components/Box';
import Layer from 'grommet/components/Layer';

import NetworkActivityOverlay from 'hippo/components/network-activity-overlay';

import TextEditor from 'hippo/components/text-editor';

import Show from '../../models/show';
import './page-editor.scss';


@observer
export default class PageEditor extends React.PureComponent {
    static propTypes = {
        show:      PropTypes.instanceOf(Show).isRequired,
        onComplete: PropTypes.func.isRequired,
    }

    @action.bound
    onDone({ content }) {
        this.props.show.set({ page: content });
        this.props.onComplete();
    }

    render() {
        const { props: { show } } = this;
        return (
            <Layer onClose={this.props.onComplete} closer className="shows-page">
                <NetworkActivityOverlay model={show} />
                <Box
                    separator='horizontal'
                    full="horizontal"
                    size="full"
                    basis="xxlarge"
                >
                    <TextEditor
                        defaultContent={this.props.show.page}
                        assets={this.props.show.page_images}
                        onComplete={this.onDone}
                    />
                </Box>
            </Layer>
        );
    }
}
